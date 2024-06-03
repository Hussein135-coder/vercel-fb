const { delay, loadData, saveData } = require("./utils");
const { TELEGRAM_CHAT_IDS, URLS } = require("./config");

async function scrapePage(browser, url) {
  console.log("Scraping Page...");
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const elements = await page.$$('div[role="button"]');
    for (const element of elements) {
      const text = await page.evaluate((el) => el.innerText, element);
      if (text.includes("Show more") || text.includes("عرض المزيد")) {
        await element.click();
        await delay(500);
      }
    }

    const LINK = url.includes("profile.php") ? "permalink" : "post";

    const latestPost = await page.evaluate((LINK) => {
      const page = document.querySelector("div[role='main'] h1");
      const post = document.querySelector(
        'div[data-pagelet="ProfileTimeline"] div[role="article"]'
      );
      let content = "",
        link = "",
        name = "";

      if (post) {
        link = post.querySelector(`a[href*="/${LINK}"]`);
        content = post.querySelector('div[dir="auto"]');
        name = page.innerText;
      }

      return {
        content: content ? content.innerText : "No post found",
        link: link ? link.href : "",
        name: name,
      };
    }, LINK);

    await page.close();
    return latestPost;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    console.log("Retrying scrape...");
    await delay(3000); // Delay before retrying
    await page.close();
    return scrapePage(browser, url); // Retry scraping
  }
}

function scrapeAllPages(browser, bot) {
  console.log("Scraping All Pages...");
  const data = loadData();
  const newData = { ...data };

  URLS.forEach(async (url) => {
    try {
      const post = await scrapePage(browser, url);
      console.log(
        `Latest post from ${url}: ${post.content} || Url: ${post.link}`
      );

      newData[url] = post;
      if (data[url]?.content !== post.content) {
        const message = `اسم الصفحة: ${post.name}\n\nالمنشور: ${post.content}\n\n[رابط المنشور](${post.link})`;

        TELEGRAM_CHAT_IDS.forEach(async (TELEGRAM_CHAT_ID) => {
          if (TELEGRAM_CHAT_ID) {
            console.log("Sending Post...");
            await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
              parse_mode: "Markdown",
            });
          }
        });

        saveData(newData);
      }
    } catch (error) {
      console.error(`Error All scraping ${url}:`, error);
      console.log("Retrying All scrape...");
      await delay(3000); // Delay before retrying
      return true;
      //return scrapeAllPages(browser, bot); // Retry scraping
    }
  });
}

module.exports = {
  scrapeAllPages,
};
