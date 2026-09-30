import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, profiles } from "@/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Returns the logged-in user and their profile (plan, premium status).
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null, profile: null }, { status: 401 });
  }

  const { user } = session;

  // Safety net: make sure a profile row always exists.
  await db
    .insert(profiles)
    .values({ id: user.id, email: user.email, fullName: user.name })
    .onConflictDoNothing();

  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  // Same field names the site already uses (full_name, premium_status).
  const profile = row
    ? {
        id: row.id,
        email: row.email,
        full_name: row.fullName,
        plan: row.plan,
        premium_status: row.premiumStatus,
      }
    : null;

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    profile,
  });
}
