import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import puppeteer from "puppeteer";

const execute = util.promisify(exec);

// --- Tool 1: File Creator ---
export async function createFile({ filePath, content }) {
  console.log(`> 📝 Tool Call: createFile(filePath="${filePath}")`);
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    const result = `Success: File created at ${filePath}`;
    console.log(`> Tool Response: ${result}`);
    return result;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// --- Tool 2: Command Executor ---
export async function executeCommand({ command }) {
  console.log(`> 💻 Tool Call: executeCommand(command="${command}")`);
  try {
    if (command.includes("rm -rf") || command.includes("format")) {
      return "Error: Command blocked for security.";
    }
    const { stdout, stderr } = await execute(command);
    return `Success: ${stdout.trim()}`;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// --- Tool 3: The "Eyes" (Profile Scraper) ---
export async function scrapeProfile({ url }) {
  console.log(`> 🕵️‍♂️ Tool Call: scrapeProfile(url="${url}")`);
  console.log(`> ⏳ Launching hidden browser...`);
  
  let browser;
  try {
    // Launch Puppeteer (Headless = true means you won't see the window)
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Fake a real user agent so Twitter doesn't block us immediately
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract Open Graph (OG) tags which contain public profile info
    const data = await page.evaluate(() => {
      const getMeta = (prop) => document.querySelector(`meta[property="${prop}"]`)?.content || "";
      return {
        title: getMeta("og:title") || document.title, // Usually "Name (@username) / X"
        description: getMeta("og:description"),       // The User Bio
        image: getMeta("og:image"),                   // The Profile Pic URL
        url: window.location.href
      };
    });

    await browser.close();

    const result = JSON.stringify(data);
    console.log(`> ✅ Scraped Data: ${result}`);
    return `Success. Profile Data: ${result}`;

  } catch (error) {
    if (browser) await browser.close();
    console.log(`> ❌ Scraping Failed: ${error.message}`);
    return `Error scraping url: ${error.message}. Proceed by inventing a generic profile based on the URL.`;
  }
}