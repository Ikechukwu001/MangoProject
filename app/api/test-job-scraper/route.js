// app/api/test-job-scraper/route.js

import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Service role bypasses RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const response = await fetch(
      "https://www.myjobmag.com/search/jobs?q=pharmacy+technicians",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs = [];

    $("li.job-list-li").each((_, el) => {
      const text = $(el).text().trim();
      if (text.includes("adsbygoogle")) return;

      const infoEl = $(el).find("li.job-info");
      const titleEl = infoEl.find("a").first();

      const fullTitle = titleEl.text().trim();
      const relativeLink = titleEl.attr("href") || "";
      if (!fullTitle || !relativeLink) return;

      const atIndex = fullTitle.lastIndexOf(" at ");
      const title = atIndex !== -1 ? fullTitle.slice(0, atIndex).trim() : fullTitle;
      const company = atIndex !== -1 ? fullTitle.slice(atIndex + 4).trim() : "";

      const job_url = relativeLink.startsWith("http")
        ? relativeLink
        : `https://www.myjobmag.com${relativeLink}`;

      let location = "";
      infoEl.find("span, li").each((_, node) => {
        const t = $(node).text().trim();
        if (t && !t.includes("adsbygoogle")) location = t;
      });

      const desc = $(el).find("li.job-desc").text().trim().slice(0, 300);

      jobs.push({ title, company, location, job_url, description: desc, source: "MyJobMag" });
    });

    const results = [];
    for (const job of jobs) {
      const { error } = await supabase
        .from("job_alerts")
        .upsert(job, { onConflict: "job_url" });
      results.push({
        job: job.title,
        company: job.company,
        status: error ? error.message : "ok",
      });
    }

    return NextResponse.json({ extracted: jobs.length, results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}