// const chalk = require("chalk");
import chalk from "chalk";
import build from "../../build/build";

// const build = require("../../build/build");

const startBuild = async () => {
  console.log(chalk.white.bgBlue("\nThe Chrome extension build started"));

  try {
    await build("chrome");

    console.log(chalk.white.bgBlue("\nThe Chrome extension build successfully\n"));
  } catch (err) {
    // console.error(err);
    // console.log(chalk.red("\nThe Chrome extension build failed\n"));
  }
};

startBuild();
