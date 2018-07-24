'use strict';


const jsonPath = require('jsonpath');
const jsonFile = require('jsonfile');
const fileExists = require('file-exists');
const chalk = require('chalk');
const sizeOf = require('image-size');

let withoutErrors = true;

const printErrorAndExit = function(error) {
	printError('Formats validation aborted because of error: ' + error);
	process.exit(1);
};

const printError = function (error) {
	console.error(chalk.red(error));
	withoutErrors = false;
};

const printLog = function(log) {
	console.log(chalk.green(log));
};

const sizeIsCorrect = function(path, width, height) {
	const size = sizeOf(path);
	const epsilon = 1; // fallback must be match format size with 1 pixel max difference
	return Math.abs(size.width - width) < epsilon && Math.abs(size.height - height) < epsilon;
};

const validateSize = function(path, size) {
	if (size == null || typeof size !== 'object') {
		printError('One or more sizes are empty or not objects!');
	}
	else if (size.name == null || typeof size.name !== 'string') {
		printError('One or more sizes have empty or missing names!');
	}
	else if (size.type == null || typeof size.type !== 'string') {
		printError(`"${size.name}" format's property 'type' must be a string.`);
	}
	else if (size.type !== 'STATIC' && size.type !== 'ADAPTIVE') {
		printError(`"${size.name}" format's property 'type' is "${size.type}" which is not supported!`);
	}
	else if (size.width == null || size.height == null) {
		printError(`"${size.name}" format's dimensions are missing!`);
	}
	else if (size.index == null || typeof size.index !== 'string') {
		printError(`"${size.name}" format's property 'index' is missing or not a string.`);
	}
	else if (!fileExists.sync(path + '/' + size.index)) {
		printError(`"${size.name}" format's index file is not found!`);
	}
	else if (!new RegExp("^.*\.(html)$").test(size.index.toLowerCase())) {
		printError(`"${size.name}" format's index file must be a html.`);
	}
	else if (size.fallback == null || size.fallback.static == null || typeof size.fallback.static !== 'string') {
		printError(`"${size.name}" format's fallback path is missing or not a string.`);
	}
	else if (!fileExists.sync(path + '/' + size.fallback.static)) {
		printError(`"${size.name}" format's fallback file is not found!`);
	}
	else if (!new RegExp("^.*\.(png|jpg|gif)$").test(size.fallback.static.toLowerCase())) {
		printError(`"${size.name}" format's fallback file must be a png, jpg or gif.`);
	}
	else if (size.type === 'STATIC' && !sizeIsCorrect(path + '/' + size.fallback.static, size.width, size.height)) {
		printError(`"${size.name}" format's fallback file doesn't match specified dimensions (${size.width}x${size.height})!`);
	}
	else {
		// printLog(`Size "${size.name}" is valid`);
	}
};

const validateFormats = function(path, manifest) {
	console.log('Starting formats validation...');

	const sizes = jsonPath.query(manifest, '$.sizes');

	if (Array.isArray(sizes)) {
		sizes[0].forEach(function(size) {
			validateSize(path, size);
		});
		if (withoutErrors) {
			printLog('\u2714 Formats validation finished: All formats are valid!');
		}
		else {
			// console.log('Formats validation finished, errors printed to console.');
		}
	}
	else {
		printErrorAndExit('Sizes were not found!');
	}
};

const validateSchema = function(path) {
	
	var schema = require('../config/schema.json');
	var data = require( path + '/manifest.json' );

	var Ajv = require('ajv');
	var ajv = new Ajv({allErrors: true, jsonPointers: true});
	require('ajv-errors')(ajv /*, {singleError: true} */);
	var validate = ajv.compile(schema);
	var valid = validate(data);
	if (!valid) {
		
		if (Array.isArray(validate.errors)) {
			validate.errors.forEach(function(element) {
				printError(element.message);
			});
		}

	} else {

		printLog('\u2714 Schema validation finished: Manifest is valid!');
		
		const manifestFullPath = path + '/manifest.json';
		
		try {
			validateFormats(path, jsonFile.readFileSync(manifestFullPath));
		} catch (e) {
			printErrorAndExit('"manifest.json" is not valid!');
		}
	}
};

const validatePath = function(path) {
	console.log('Starting manifest validation...');

	const manifestFullPath = path + '/manifest.json';

	if (fileExists.sync(manifestFullPath)) {

		try {
			validateSchema(path, jsonFile.readFileSync(manifestFullPath));
		} catch (e) {
			printErrorAndExit('"manifest.json" is not valid!');
		}

	}
	else {
		printErrorAndExit('"manifest.json" not found!');
	}
};

module.exports = { validatePath };