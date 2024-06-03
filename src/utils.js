const fs = require("fs");
const path = require("path");
const { DATA_FILE_PATH } = require("./config");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function loadData() {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH);
    return JSON.parse(data);
  }
  return {};
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  delay,
  loadData,
  saveData,
};
