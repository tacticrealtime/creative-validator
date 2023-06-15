#!/usr/bin/env node
"use strict";

const program = require("commander");
const schemaValidator = require("../lib/formats-validator-v2.0");

program
  .version(require("../package.json").version)
  .usage("[path]")
  .description(
    "Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used."
  )
  .parse(process.argv);

const path = program.args.shift() || ".";

schemaValidator.validatePath(path, true);
