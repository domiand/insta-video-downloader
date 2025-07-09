
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/download", async (req, res) => {
  const igUrl = req.query.url;

  if (!igUrl || !igUrl.includes("instagram.com")) {
    return res.status(400).json({ success: false, error: "Invalid URL" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: false, // show Chrome for testing
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log("Opening:", igUrl);
    await page.goto(igUrl, { waitUntil: "networkidle2", timeout: 0 });

    // Wait a bit more in case of slow load
    await page.waitForTimeout(5000);

    // Remove login popups
    await page.evaluate(() => {
      const popup = document.querySelector('div[role="dialog"]');
      if (popup) popup.remove();
    });

    // Extract video URL
    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector("video");
      return video ? video.src : null;
    });

    await browser.close();

    if (videoUrl && videoUrl.startsWith("http")) {
      return res.json({ success: true, videoUrl });
    } else {
      return res.json({ success: false, error: "No video found on the page" });
    }
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    return res.status(500).json({ success: false, error: "Scraping failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Puppeteer IG scraper running on port ${PORT}`);
});


