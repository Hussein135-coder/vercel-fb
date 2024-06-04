const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

//const chromium = require("@sparticuz/chromium");

//const { CHROME_EXECUTABLE_PATH } = require("./src/config");
const main = require("./src/main");

const app = express();
app.use(cors());

app.use(express.json());

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

app.get("/", (req, res) => {
  (async () => {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    main(browser);
  })();
  res.json({ hi: "Hi" });
});

app.get("/ok", (req, res) => {
  res.json({ hi: "ok" });
});

module.exports = app;
