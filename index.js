const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");

const { CHROME_EXECUTABLE_PATH } = require("./src/config");
const main = require("./src/main");

// const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );

const CHROMIUM_PATH =
  "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  await (async () => {
    const executablePath = await chromium.executablePath(CHROMIUM_PATH);
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    console.log("lunch");
    main(browser);
  })();
  res.json({ hi: "Hi" });
});

app.get("/ok", (req, res) => {
  res.json({ hi: "ok" });
});

module.exports = app;
