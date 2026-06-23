// netlify/functions/job-scraper.js

const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

// ── MyJobMag ──────────────────────────────────────────────
async function scrapeMyJobMag() {
  try {
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

      // FIX: only grab spans (location), skip li.job-item (date)
      let location = "";
      infoEl.find("span").each((_, node) => {
        const t = $(node).text().trim();
        if (t && !t.includes("adsbygoogle")) location = t;
      });

      // Grab date separately from li.job-item
      const date = $(el).find("li.job-item").first().text().trim();

      const desc = $(el).find("li.job-desc").text().trim().slice(0, 300);

      jobs.push({
        title,
        company,
        location,
        date,
        job_url,
        description: desc,
        source: "MyJobMag",
      });
    });

    console.log(`MyJobMag: ${jobs.length} jobs found`);
    return jobs;
  } catch (e) {
    console.error("MyJobMag error:", e.message);
    return [];
  }
}

// ── Jobberman ─────────────────────────────────────────────
async function scrapeJobbermanUrls() {
  try {
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

    return urls.slice(0, 15);
  } catch (e) {
    console.error("Jobberman URL error:", e.message);
    return [];
  }
}

async function scrapeJobbermanListing(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim();

    // Company from h2 or page title
    let company = $("h2.text-base.leading-6.font-normal").first().text().trim();
    if (!company) {
      const pt = $("title").text();
      const m = pt.match(/at (.+?) \| Jobberman/i);
      if (m) company = m[1].trim();
    }

    // FIX: location is a text-link-500 anchor whose href is /jobs/{city}
    // Exclude links whose href contains known non-city segments
    const NON_CITY = ["full-time", "part-time", "remote", "contract", "?q=", "medical", "healthcare", "retail", "pharmaceutical"];
    let location = "";
    $("a.text-link-500").each((_, el) => {
      const href = $(el).attr("href") || "";
      const t = $(el).text().trim();
      const isCity = href.includes("/jobs/") && !NON_CITY.some((s) => href.includes(s));
      if (isCity && t) location = t;
    });

    // Date
    const date = $("span.text-gray-500.text-base.leading-6.font-normal")
      .first().text().trim();

    // Salary
    const salary = $("span.inline-flex.items-center.gap-x-2")
      .filter((_, el) => $(el).text().includes("NGN"))
      .first().text().trim();

    if (!title || !company) return null;

    return {
      title,
      company,
      location: location || "",
      date,
      job_url: url,
      description: salary ? `Salary: ${salary}` : "",
      source: "Jobberman",
    };
  } catch (e) {
    console.error(`Jobberman listing error (${url}):`, e.message);
    return null;
  }
}

async function scrapeJobberman() {
  const urls = await scrapeJobbermanUrls();
  console.log(`Jobberman: ${urls.length} URLs found`);

  const jobs = [];
  for (const url of urls) {
    await new Promise((r) => setTimeout(r, 800));
    const job = await scrapeJobbermanListing(url);
    if (job) jobs.push(job);
  }

  console.log(`Jobberman: ${jobs.length} jobs extracted`);
  return jobs;
}

// ── Main handler ──────────────────────────────────────────
exports.handler = async () => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const [myJobMagJobs, jobbermanJobs] = await Promise.all([
      scrapeMyJobMag(),
      scrapeJobberman(),
    ]);

    const allJobs = [...myJobMagJobs, ...jobbermanJobs];
    console.log(`Total: ${allJobs.length}`);

    let inserted = 0;
    let skipped = 0;

    for (const job of allJobs) {
      const { error } = await supabase
        .from("job_alerts")
        .upsert(job, { onConflict: "job_url" });

      if (error) {
        console.error("Insert error:", error.message);
        skipped++;
      } else {
        inserted++;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        sources: {
          myjobmag: myJobMagJobs.length,
          jobberman: jobbermanJobs.length,
        },
        total: allJobs.length,
        inserted,
        skipped,
      }),
    };
  } catch (error) {
    console.error("Handler error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};