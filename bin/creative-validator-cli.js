#!/usr/bin/env node
'use strict';

const program = require('commander');
const formatsValidator = require('../lib/formats-validator');
const previewValidator = require('../lib/preview-validator');
const securityValidator = require('../lib/security-validator');

program
	.version(require('../package.json').version)
	.option('-p, --preview-page [path to custom preview page]', 'Use custom preview page instead of standard preview.html included into validator')
	.usage('[path]')
	.description('Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.')
	.parse(process.argv);

const path = program.args.shift() || '.';

formatsValidator.validatePath(path);
securityValidator.validatePath(path);
previewValidator.validatePath(path, program.previewPage);