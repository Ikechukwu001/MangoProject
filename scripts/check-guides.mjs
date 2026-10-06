// Checks every study guide in content/guides and reports problems.
// Run from the project root:  node scripts/check-guides.mjs
// Exits with an error if any lesson is broken, so it can also run before a deploy.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content", "guides");
const SEGMENT = /^[a-z0-9-]+$/;
const MIN_QUESTIONS = 3;

const problems = [];
const courses = new Map(); // "bdt/bdt-152" -> { total, drafts, orders: Map }

function fail(file, message) {
  problems.push(`${file}: ${message}`);
}

function dirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function checkLesson(subject, course, fileName) {
  const rel = `${subject}/${course}/${fileName}`;
  const slug = fileName.slice(0, -3);

  if (!SEGMENT.test(slug)) {
    fail(rel, "file name must use lowercase letters, numbers and hyphens only");
  }

  const raw = fs.readFileSync(path.join(ROOT, subject, course, fileName), "utf8");
  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    fail(rel, `frontmatter could not be read (${error.reason || error.message})`);
    return;
  }
  const { data, content } = parsed;

  for (const field of ["title", "subject", "course", "courseTitle"]) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      fail(rel, `missing "${field}"`);
    }
  }
  if (!Number.isFinite(Number(data.order)) || Number(data.order) < 1) {
    fail(rel, 'missing or invalid "order" (use 1, 2, 3...)');
  }
  if (!Number.isFinite(Number(data.readingTime))) {
    fail(rel, 'missing "readingTime"');
  }

  if (
    typeof data.subject === "string" &&
    data.subject.toLowerCase() !== subject
  ) {
    fail(rel, `subject "${data.subject}" does not match folder "${subject}"`);
  }
  if (
    typeof data.course === "string" &&
    data.course.trim().toLowerCase().replace(/\s+/g, "-") !== course
  ) {
    fail(rel, `course "${data.course}" does not match folder "${course}"`);
  }

  for (const field of ["objectives", "keyPoints", "examFocus"]) {
    if (!Array.isArray(data[field]) || data[field].length === 0) {
      fail(rel, `"${field}" must be a list with at least one item`);
    }
  }

  const quiz = Array.isArray(data.quickCheck) ? data.quickCheck : [];
  if (quiz.length < MIN_QUESTIONS) {
    fail(rel, `quickCheck needs at least ${MIN_QUESTIONS} questions (has ${quiz.length})`);
  }
  quiz.forEach((q, i) => {
    const label = `quickCheck question ${i + 1}`;
    if (typeof q.question !== "string" || !q.question.trim()) {
      fail(rel, `${label} has no question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      fail(rel, `${label} needs at least 2 options`);
    } else if (
      !Number.isInteger(q.answer) ||
      q.answer < 0 ||
      q.answer >= q.options.length
    ) {
      fail(rel, `${label} has an "answer" that is not a valid option number (counting from 0)`);
    }
    if (typeof q.explanation !== "string" || !q.explanation.trim()) {
      fail(rel, `${label} has no explanation`);
    }
  });

  if (!content.trim()) fail(rel, "the lesson body is empty");

  const key = `${subject}/${course}`;
  if (!courses.has(key)) {
    courses.set(key, { total: 0, drafts: 0, orders: new Map() });
  }
  const entry = courses.get(key);
  entry.total += 1;
  if (data.draft === true) entry.drafts += 1;

  const order = Number(data.order);
  if (entry.orders.has(order)) {
    fail(rel, `"order: ${order}" is also used by ${entry.orders.get(order)}`);
  } else {
    entry.orders.set(order, fileName);
  }
}

for (const subjectDir of dirs(ROOT)) {
  if (!subjectDir.isDirectory()) continue;
  if (!SEGMENT.test(subjectDir.name)) {
    fail(subjectDir.name, "folder name must use lowercase letters, numbers and hyphens only");
  }
  for (const courseDir of dirs(path.join(ROOT, subjectDir.name))) {
    if (!courseDir.isDirectory()) continue;
    if (!SEGMENT.test(courseDir.name)) {
      fail(`${subjectDir.name}/${courseDir.name}`, "folder name must use lowercase letters, numbers and hyphens only");
    }
    for (const file of dirs(path.join(ROOT, subjectDir.name, courseDir.name))) {
      if (file.isFile() && file.name.endsWith(".md")) {
        checkLesson(subjectDir.name, courseDir.name, file.name);
      }
    }
  }
}

let total = 0;
let drafts = 0;
console.log("Study guides");
for (const [key, entry] of [...courses.entries()].sort()) {
  total += entry.total;
  drafts += entry.drafts;
  const published = entry.total - entry.drafts;
  console.log(
    `  ${key.padEnd(18)} ${entry.total} lesson(s): ${published} published, ${entry.drafts} draft`
  );
}
console.log(`Total: ${total} lesson(s), ${total - drafts} published, ${drafts} draft`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s) found:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("No problems found.");
