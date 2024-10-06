const { data, saveData } = require("./data");
const { logger } = require("./logger");

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

module.exports = { addTood, listToods, removeToodById };
