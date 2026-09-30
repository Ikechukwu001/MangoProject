// app/api/job-alerts/route.js
// Job listings are a premium feature, so the check happens here on the server.
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, jobAlerts, profiles } from "@/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await db
    .select({ plan: profiles.plan, premiumStatus: profiles.premiumStatus })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  const isPremium =
    profile?.plan?.trim() === "premium" || profile?.premiumStatus === "active";

  if (!isPremium) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(jobAlerts)
    .orderBy(desc(jobAlerts.createdAt))
    .limit(300);

  // Same field names the job cards already use
  const jobs = rows.map((r) => ({
    id: r.id,
    title: r.title,
    company: r.company,
    location: r.location,
    job_url: r.jobUrl,
    source: r.source,
    created_at: r.createdAt,
    description: r.description,
    date: r.date,
  }));

  return NextResponse.json({ jobs });
}