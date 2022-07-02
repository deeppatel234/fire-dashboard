/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const chalk = require("chalk");
const build = require("../../build/build");

const startBuild = async () => {
  console.log(chalk.white.bgBlue("\nThe Chrome extension build started"));

  try {
    await build("chrome");

    console.log(chalk.white.bgBlue("\nThe Chrome extension build successfully\n"));
  } catch (err) {
    console.error(err);
    console.log(chalk.red("\nThe Chrome extension build failed\n"));
  }
};

startBuild();
