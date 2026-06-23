// app/api/test-job-scraper/route.js

import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

const NON_CITY = ["full-time", "part-time", "remote", "contract", "?q=", "medical", "healthcare", "retail", "pharmaceutical"];

async function scrapeMyJobMag() {
  const res = await fetch(
    "https://www.myjobmag.com/search/jobs?q=pharmacy+technicians",
    { headers: HEADERS }
  );
  const html = await res.text();
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
    infoEl.find("span").each((_, node) => {
      const t = $(node).text().trim();
      if (t && !t.includes("adsbygoogle")) location = t;
    });

    const date = $(el).find("li.job-item").first().text().trim();
    const desc = $(el).find("li.job-desc").text().trim().slice(0, 300);

    jobs.push({ title, company, location, date, job_url, description: desc, source: "MyJobMag" });
  });

  return jobs;
}

async function scrapeJobberman() {
  // Step 1: get listing URLs
  const res = await fetch(
    "https://www.jobberman.com/jobs?q=pharmacy+technician",
    { headers: HEADERS }
  );
  const html = await res.text();
  const $ = cheerio.load(html);
  const urls = [];

  $("a[href*='/listings/']").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !urls.includes(href)) urls.push(href);
  });

  // Step 2: fetch each listing
  const jobs = [];
  for (const url of urls.slice(0, 10)) {
    await new Promise((r) => setTimeout(r, 600));
    try {
      const r = await fetch(url, { headers: HEADERS });
      const h = await r.text();
      const $$ = cheerio.load(h);

      const title = $$("h1").first().text().trim();

      let company = $$("h2.text-base.leading-6.font-normal").first().text().trim();
      if (!company) {
        const pt = $$("title").text();
        const m = pt.match(/at (.+?) \| Jobberman/i);
        if (m) company = m[1].trim();
      }

      let location = "";
      $$("a.text-link-500").each((_, el) => {
        const href = $$(el).attr("href") || "";
        const t = $$(el).text().trim();
        const isCity = href.includes("/jobs/") && !NON_CITY.some((s) => href.includes(s));
        if (isCity && t) location = t;
      });

      const date = $$("span.text-gray-500.text-base.leading-6.font-normal")
        .first().text().trim();

      const salary = $$("span.inline-flex.items-center.gap-x-2")
        .filter((_, el) => $$(el).text().includes("NGN"))
        .first().text().trim();

      if (title && company) {
        jobs.push({
          title, company,
          location: location || "",
          date,
          job_url: url,
          description: salary ? `Salary: ${salary}` : "",
          source: "Jobberman",
        });
      }
    } catch (e) {
      console.error("Listing error:", e.message);
    }
  }

  return jobs;
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const [myJobMagJobs, jobbermanJobs] = await Promise.all([
    scrapeMyJobMag(),
    scrapeJobberman(),
  ]);

  const allJobs = [...myJobMagJobs, ...jobbermanJobs];

  const results = [];
  for (const job of allJobs) {
    const { error } = await supabase
      .from("job_alerts")
      .upsert(job, { onConflict: "job_url" });
    results.push({
      title: job.title,
      company: job.company,
      location: job.location,
      date: job.date,
      source: job.source,
      status: error ? error.message : "ok",
    });
  }

  return NextResponse.json({
    myjobmag: myJobMagJobs.length,
    jobberman: jobbermanJobs.length,
    total: allJobs.length,
    results,
  });
}