const { program } = require("commander");
const { listToods, addTood, removeToodById } = require("./src/tood");

program
  .name("tood")
  .description(
    "Fun project to create some toods and evolve the solution based on requirements in https://gist.github.com/CheeseStick/2009ecac9973617a619b7d1a9642ce30"
  )
  .version("0.0.1");

program
  .command("create")
  .description("Create a tood item")
  .argument("<str>", "name of item")
  .action((str) => {
    addTood(str);
  });

program
  .command("list")
  .description("List all tood items")
  .action(() => {
    listToods();
  });

program
  .command("remove")
  .description("Remove a tood item by id")
  .argument("<int>", "the tood id")
  .action((int) => {
    removeToodById(parseInt(int));
  });

program.parse();
