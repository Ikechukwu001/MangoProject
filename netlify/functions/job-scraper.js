// netlify/functions/job-scraper.js

const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async () => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
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

      // Parse "Job Title at Company Name"
      const atIndex = fullTitle.lastIndexOf(" at ");
      const title = atIndex !== -1 ? fullTitle.slice(0, atIndex).trim() : fullTitle;
      const company = atIndex !== -1 ? fullTitle.slice(atIndex + 4).trim() : "";

      const job_url = relativeLink.startsWith("http")
        ? relativeLink
        : `https://www.myjobmag.com${relativeLink}`;

      // Location: last non-empty span/li text that isn't an ad
      let location = "";
      infoEl.find("span, li").each((_, node) => {
        const t = $(node).text().trim();
        if (t && !t.includes("adsbygoogle")) location = t;
      });

      const desc = $(el).find("li.job-desc").text().trim().slice(0, 300);

      jobs.push({
        title,
        company,
        location,
        job_url,
        description: desc,
        source: "MyJobMag",
      });
    });

    console.log("Jobs extracted:", jobs.length);

    let inserted = 0;
    let skipped = 0;

    for (const job of jobs) {
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
        extracted: jobs.length,
        inserted,
        skipped,
      }),
    };
  } catch (error) {
    console.error("Scraper error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};