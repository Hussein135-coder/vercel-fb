const { timeout } = require("puppeteer-core");
const { FACEBOOK_EMAIL, FACEBOOK_PASSWORD } = require("./config");
const { delay } = require("./utils");
async function login(page, browser) {
  try {
    console.log("Loging...");
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle2",
      timeout: 90000,
    });
    if (page.url().includes("login")) {
      await page.type("#email", FACEBOOK_EMAIL);
      await page.type("#pass", FACEBOOK_PASSWORD);
      await page.click("button[name=login]");
      await page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 90000,
      });
    }
    const cookies = await page.cookies();
    return cookies;
  } catch (error) {
    console.error("Login failed:", error);
    console.log("Retrying login...");
    await delay(3000);
    return login(page);
  }
}

module.exports = login;
