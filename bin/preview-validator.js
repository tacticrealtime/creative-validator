#!/usr/bin/env node
"use strict";

const program = require("commander");
const previewValidator = require("../lib/preview-validator-v2.0");

program
  .version(require("../package.json").version)
  .usage("[path]")
  .description(
    "Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used."
  )
  .parse(process.argv);

const path = program.args.shift() || ".";

previewValidator.validatePath(path, program.previewPage, true);
