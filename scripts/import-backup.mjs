// One-time import: Supabase backup file  ->  your new Neon database.
//
// Usage (from the project root):
//   node --env-file=.env.local scripts/import-backup.mjs "path/to/backup file" --dry-run
//   node --env-file=.env.local scripts/import-backup.mjs "path/to/backup file"
//
// --dry-run reads the backup and prints a report. It touches no database.

import fs from "node:fs";
import pg from "pg";
import { randomUUID } from "node:crypto";

const file = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!file || file.startsWith("--")) {
  console.error('Give me the backup file path, e.g.\n  node --env-file=.env.local scripts/import-backup.mjs "C:/path/to/db_cluster.backup" --dry-run');
  process.exit(1);
}

/* ---------- 1. Read the COPY blocks out of the pg_dump file ---------- */

const text = fs.readFileSync(file, "utf8");
const lines = text.split("\n");

function unescapeField(v) {
  if (v === "\\N") return null;
  if (!v.includes("\\")) return v;
  return v.replace(/\\(.)/g, (_, c) => {
    switch (c) {
      case "n": return "\n";
      case "t": return "\t";
      case "r": return "\r";
      case "b": return "\b";
      case "f": return "\f";
      case "v": return "\v";
      default: return c; // handles \\ and anything else
    }
  });
}

function readTable(name) {
  const start = lines.findIndex((l) => l.startsWith(`COPY ${name} (`));
  if (start === -1) throw new Error(`Table ${name} not found in backup`);
  const cols = lines[start].match(/\(([^)]*)\)/)[1].split(",").map((c) => c.trim());
  const rows = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].replace(/\r$/, "") === "\\.") break;
    const parts = lines[i].split("\t").map(unescapeField);
    const row = {};
    cols.forEach((c, idx) => (row[c] = parts[idx] ?? null));
    rows.push(row);
  }
  return rows;
}

const authUsers = readTable("auth.users");
const authIdentities = readTable("auth.identities");
const profilesRaw = readTable("public.profiles");
const premium = readTable("public.premium_requests");
const jobs = readTable("public.job_alerts");
const admins = readTable("public.admin_users");

/* ---------- 2. Shape the data for the new tables ---------- */

const profileById = new Map(profilesRaw.map((p) => [p.id, p]));
const problems = [];

function parseJson(s) {
  try { return s ? JSON.parse(s) : {}; } catch { return {}; }
}

const users = [];
const accounts = [];
const seenEmails = new Set();

for (const u of authUsers) {
  if (!u.email) { problems.push(`user ${u.id} has no email, skipped`); continue; }
  const email = u.email.trim().toLowerCase();
  if (seenEmails.has(email)) { problems.push(`duplicate email for user ${u.id}, skipped`); continue; }
  seenEmails.add(email);

  const meta = parseJson(u.raw_user_meta_data);
  const prof = profileById.get(u.id);
  const name = (prof?.full_name || meta.full_name || meta.name || email.split("@")[0]).trim();

  users.push({
    id: u.id,
    name,
    email,
    email_verified: !!u.email_confirmed_at,
    image: meta.avatar_url || meta.picture || null,
    created_at: u.created_at,
    updated_at: u.updated_at || u.created_at,
  });

  // Password login (bcrypt hashes carry over as-is)
  if (u.encrypted_password && u.encrypted_password.startsWith("$2")) {
    accounts.push({
      id: randomUUID(),
      account_id: u.id,
      provider_id: "credential",
      user_id: u.id,
      password: u.encrypted_password,
      created_at: u.created_at,
      updated_at: u.updated_at || u.created_at,
    });
  }
}

const userIds = new Set(users.map((u) => u.id));

// Google logins (provider_id is Google's own user id, which Better Auth also uses)
for (const i of authIdentities) {
  if (i.provider !== "google" || !userIds.has(i.user_id)) continue;
  accounts.push({
    id: randomUUID(),
    account_id: i.provider_id,
    provider_id: "google",
    user_id: i.user_id,
    password: null,
    created_at: i.created_at,
    updated_at: i.updated_at || i.created_at,
  });
}

const profiles = profilesRaw.filter((p) => {
  if (!userIds.has(p.id)) { problems.push(`profile ${p.id} has no user, skipped`); return false; }
  return true;
});
const premiumOk = premium.filter((p) => {
  if (!userIds.has(p.user_id)) { problems.push(`premium_request ${p.id} has no user, skipped`); return false; }
  return true;
});
const adminsOk = admins.filter((a) => userIds.has(a.user_id));

// users with no login method at all (would be locked out)
const withLogin = new Set(accounts.map((a) => a.user_id));
const noLogin = users.filter((u) => !withLogin.has(u.id)).length;

// duplicate payment references?
const refCounts = {};
premiumOk.forEach((p) => (refCounts[p.reference] = (refCounts[p.reference] || 0) + 1));
const dupRefs = Object.values(refCounts).filter((n) => n > 1).length;

console.log("---- Backup report ----");
console.log(`users to import:          ${users.length}`);
console.log(`  password logins:        ${accounts.filter((a) => a.provider_id === "credential").length}`);
console.log(`  google logins:          ${accounts.filter((a) => a.provider_id === "google").length}`);
console.log(`  users with no login:    ${noLogin}`);
console.log(`profiles:                 ${profiles.length}`);
console.log(`premium_requests:         ${premiumOk.length}  (duplicate references: ${dupRefs})`);
console.log(`job_alerts:               ${jobs.length}`);
console.log(`admin_users:              ${adminsOk.length}`);
if (problems.length) {
  console.log(`\nProblems (${problems.length}):`);
  problems.slice(0, 20).forEach((p) => console.log("  - " + p));
}

if (dryRun) {
  console.log("\nDry run only. Nothing was written.");
  process.exit(0);
}

/* ---------- 3. Write everything to Neon in one transaction ---------- */

const url = process.env.DATABASE_URL_DIRECT;
if (!url) {
  console.error("DATABASE_URL_DIRECT is missing from .env.local");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

async function insertMany(table, columns, rows, batch = 200) {
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch);
    const values = [];
    const placeholders = chunk.map((row, r) => {
      const ph = columns.map((c, k) => {
        values.push(row[c] === undefined ? null : row[c]);
        return `$${r * columns.length + k + 1}`;
      });
      return `(${ph.join(",")})`;
    });
    await client.query(
      `INSERT INTO ${table} (${columns.join(",")}) VALUES ${placeholders.join(",")}`,
      values
    );
  }
}

try {
  await client.query("BEGIN");

  const existing = await client.query("SELECT count(*)::int AS n FROM users");
  if (existing.rows[0].n > 0) {
    throw new Error("The users table already has data. Aborting so nothing gets doubled up.");
  }

  await insertMany("users", ["id", "name", "email", "email_verified", "image", "created_at", "updated_at"], users);
  await insertMany("accounts", ["id", "account_id", "provider_id", "user_id", "password", "created_at", "updated_at"], accounts);
  await insertMany("profiles", ["id", "email", "full_name", "plan", "premium_status", "created_at"], profiles);
  await insertMany(
    "premium_requests",
    ["id", "user_id", "email", "full_name", "amount", "reference", "status", "created_at", "updated_at",
     "payment_method", "paystack_access_code", "paystack_authorization_url", "paid_at", "paystack_amount_paid"],
    premiumOk
  );
  await insertMany("job_alerts", ["id", "title", "company", "location", "job_url", "source", "created_at", "description", "date"], jobs);
  await insertMany("admin_users", ["id", "user_id", "email", "created_at"], adminsOk);

  // keep auto-numbering in step with the imported ids
  await client.query(`SELECT setval(pg_get_serial_sequence('premium_requests','id'), COALESCE((SELECT max(id) FROM premium_requests), 1))`);
  await client.query(`SELECT setval(pg_get_serial_sequence('admin_users','id'), COALESCE((SELECT max(id) FROM admin_users), 1))`);

  await client.query("COMMIT");
  console.log("\nImport finished successfully.");
} catch (err) {
  await client.query("ROLLBACK");
  console.error("\nImport failed, nothing was saved:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
