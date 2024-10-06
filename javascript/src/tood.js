const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

const CONFIG_FILE_PATH = "./config/config.json";
const INITIAL_DATA = { toods: [] };

let config = undefined;
let data = undefined;

const loadConfig = () => {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    throw new Error(
      `Application will exit due to no config file found at ${config.configFilePath}`
    );
  }

  const file = fs.readFileSync(CONFIG_FILE_PATH);
  config = JSON.parse(file);

  logger.debug(`Config loaded: ${file}`);
};

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

const generateNewId = () => {
  if (data.toods.length === 0) {
    return 0;
  }

  const ids = data.toods.map((tood) => tood.id);
  return Math.max(...ids) + 1;
};

const addTood = (toodName) => {
  const tood = { id: generateNewId(), name: toodName, status: "TODO" };
  const updatedData = {
    ...data,
    toods: [...data.toods, tood],
  };

  logger.debug(`Updated toods were: ${updatedData}`);
  saveData(updatedData);
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

const listToods = () => {
  const toods = [...data.toods];
  toods.sort((t1, t2) => t1.id - t2.id);

  toods.forEach((tood) => {
    logger.info(`${tood.id}: ${tood.name}`);
  });
};

const removeToodById = (id) => {
  const updatedData = {
    ...data,
    toods: [...data.toods.filter((tood) => tood.id !== id)],
  };
  saveData(updatedData);
};

const initialize = () => {
  loadConfig();
  loadData();
};

initialize();

module.exports = { addTood, listToods, removeToodById };
