const cron = require("node-cron");
const login = require("./login");
const cronScrape = require("./cron");
const { delay } = require("./utils");

async function main(browser) {
  const page = await browser.newPage();

  try {
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle2",
      timeout: 90000,
    });
    if (page.url().includes("login")) {
      await login(page, browser);
    }
    await page.close();

    cron.schedule("* * * * *", async () => {
      console.log("Schedule...");
      cronScrape(browser);
    });
  } catch (error) {
    console.error("Error in main process:", error);
    console.log("Retrying main process...");
    await delay(3000); // Delay before retrying
    await page.close();
    return main(browser);
  }
}

module.exports = main;
