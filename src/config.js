require("dotenv").config();
const path = require("path");

module.exports = {
  FACEBOOK_EMAIL: process.env.FACEBOOK_EMAIL,
  FACEBOOK_PASSWORD: process.env.FACEBOOK_PASSWORD,
  CHROME_EXECUTABLE_PATH: process.env.CHROME_EXECUTABLE_PATH,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_IDS: [
    process.env.CHAT_ID_1,
    process.env.CHAT_ID_2,
    process.env.CHAT_ID_3,
  ],
  DATA_FILE_PATH: path.join(__dirname, "../data/data.json"),
  URLS: [process.env.URL_1, process.env.URL_2, process.env.URL_3],
};
