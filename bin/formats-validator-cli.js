#!/usr/bin/env node
'use strict';

const program = require('commander');
const formatsValidator = require('../lib/formats-validator');

program
	.version(require('../package.json').version)
	.usage('[path]')
	.description('Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.')
	.parse(process.argv);

const path = program.args.shift() || '.';

formatsValidator.validatePath(path);