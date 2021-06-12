#!/usr/bin/env node
'use strict';
const fs = require("fs");
const inquirer = require("inquirer");
const { spawn } = require("child_process");

const packageJsonLocation = process.cwd() + "/package.json";

function runScript(script) {
  spawn("npm", ["run", script], { stdio: "inherit" });
}

fs.readFile(packageJsonLocation, (err, data) => {
  if (err) {
    console.error("The package.json file not found");
    process.exit();
  }

  const packageJson = JSON.parse(data);

  if (!packageJson.scripts) {
    console.error("The package.json do not have any scripts.");
    process.exit();
  }

  const availableScripts = Object.keys(packageJson.scripts);

  if (availableScripts.length === 0) {
    console.error("The package.json do not have any scripts.");
    process.exit();
  }

  if (availableScripts.length === 1) {
    console.log(`You have one script, Running: ${availableScripts[0]}`);
    runScript(availableScripts[0]);
  } else {
    inquirer
      .prompt([
        {
          type: "list",
          name: "script",
          message: `You have ${availableScripts.length} scripts, Please select to run: `,
          choices: availableScripts,
        },
      ])
      .then(({ script }) => {
        runScript(script);
      });
  }
});
