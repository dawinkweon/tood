const fs = require("fs");
const { logger } = require("./logger");
const CONFIG_FILE_PATH = "./config/config.json";

let config = undefined;

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

loadConfig();

module.exports = { config };
