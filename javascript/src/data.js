const fs = require("fs");
const path = require("path");
const { config } = require("./config");
const { logger } = require("./logger");

let data = undefined;
const INITIAL_DATA = { toods: [] };

const loadData = () => {
  if (config?.featureFlags?.forceCleanDataSlate === true) {
    logger.warn(
      "Forcing a clean data slate as the featureFlag: forceCleanDataSlate is enabled."
    );
    data = INITIAL_DATA;
    return;
  }

  if (!fs.existsSync(config.dataFilePath)) {
    logger.warn("No data file found. Using initial data");
    data = INITIAL_DATA;
    return;
  }

  const file = fs.readFileSync(config.dataFilePath);
  data = JSON.parse(file);
  logger.debug(`Data loaded was: ${file}`);
};

const saveData = (data) => {
  const dataFolderPath = path.dirname(config.dataFilePath);
  const exists = fs.existsSync(dataFolderPath);
  if (!exists) {
    fs.mkdirSync(dataFolderPath);
  }

  fs.writeFileSync(config.dataFilePath, prettyPrintJson(data), () => {});
};

const prettyPrintJson = (json) => {
  return JSON.stringify(json, null, 2);
};

loadData();

module.exports = { data, saveData };
