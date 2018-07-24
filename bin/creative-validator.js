#!/usr/bin/env node
'use strict';

const program         = require('commander');
const schemaValidator = require('../lib/formats-validator-v2.0');

let errors = [];

const format = function (allErrors) {
	let messages = [];
	allErrors.forEach(function (validatorErrors) {
		validatorErrors.forEach(function (error) {
			messages.push(JSON.stringify({message: error}));
		});
	});
	console.log(messages.join());
};

program
	.version(require('../package.json').version)
	.usage('[path]')
	.description('Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.')
	.parse(process.argv);

const path = program.args.shift() || '.';
let debug  = program.args.shift();

if (debug === 'debug') {
	debug = true;
}
else {
	debug = false;
}

errors.push(schemaValidator.validatePath(path, debug));

format(errors);