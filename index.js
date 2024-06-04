const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

const { CHROME_EXECUTABLE_PATH } = require("./src/config");
const main = require("./src/main");

// const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  (async () => {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });
    main(browser);
  })();
  res.json({ hi: "Hi" });
});

app.get("/ok", (req, res) => {
  res.json({ hi: "ok" });
});

module.exports = app;
