'use strict';

/*

Minimal valid manifest example:

{
  "type": "MANIFEST",
  "version": "1.1",
  "author": "Author's name",
  "brand": "Some brand",
  "name": "Some name",
  "created": "17/07/2018",
  "updated": "17/07/2018",
  "editor": {
    "url": "editor.html",
    "version": "1.1"
  },
  "sizes": [
    {
      "type": "STATIC",
      "name": "300x250",
      "width": 300,
      "height": 250,
      "index": "300x250\/index.html",
      "fallback": {
        "static": "300x250\/fallback.png"
      }
    }
  ],
  "data": {}
}

 */

const jsonPath = require('jsonpath');
const jsonFile = require('jsonfile');
const fileExists = require('file-exists');
const chalk = require('chalk');
const sizeOf = require('image-size');

let errors = [];
let withoutErrors = true;
let _debug = false;

const printErrorAndExit = function(error) {
	printError('Formats validation aborted because of error: ' + error);
	return;
};

const printError = function (error) {
	if (_debug) {
		console.error(chalk.red(error));
	}
	errors.push(error);
	withoutErrors = false;
};

const printStatus = function(status) {
	if (_debug) {
		console.log(chalk.cyan(status));
	}
};

const printLog = function(log) {
	if (_debug) {
		console.log(chalk.green(log));
	}
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
	else if (size.width === " " || size.height === " " || size.width === "" || size.height === "") {
		printError(`"${size.name}" format's dimension is an empty string!`);
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
	else if (size.fallback == null) {
		printError(`"${size.name}" format's 'fallback' property is missing.`);
	}
	else if (size.fallback.static == null) {
		printError(`"${size.name}" format's 'fallback' object is missing 'static' property.`);
	}
	else if (typeof size.fallback.static !== 'string') {
		printError(`"${size.name}" format's fallback 'static' property is not a string.`);
	}
	else if (!fileExists.sync(path + '/' + size.fallback.static)) {
		printError(`"${size.name}" format's fallback file is not found!`);
	}
	else if (!new RegExp("^.*\.(png|jpg|gif)$").test(size.fallback.static.toLowerCase())) {
		printError(`"${size.name}" format's fallback file must be a png, jpg or gif.`);
	}
	else if (!size.width.toString().includes("%") && !size.height.toString().includes("%") && size.width.toString() !== "1" && size.height.toString() !== "1" && size.width.toString() !== "0" && size.height.toString() !== "0" && size.type === 'STATIC' && !sizeIsCorrect(path + '/' + size.fallback.static, size.width, size.height)) {
		printError(`"${size.name}" format's fallback file doesn't match specified dimensions (${size.width}x${size.height})!`);
	}
	else {
		 printLog(`Format "${size.name}" is valid`);
	}
};

const validateFormats = function(path, manifest) {
	printStatus('Starting formats validation...');
	
	const sizes = manifest.sizes;
	
	if (Array.isArray(sizes)) {
		try {
			sizes.forEach(function(size) {
				validateSize(path, size);
			});
		}
		catch (e) {
			printErrorAndExit('Could not validate formats.');
		}
		if (withoutErrors) {
			printLog('\u2714 Formats validation finished: All formats are valid!');
		}
		else {
			printStatus('Formats validation finished, errors printed to console.');
		}
	}
	else {
		printErrorAndExit('Formats were not found!');
	}
};

const validateSchema = function(manifest) {

	var schema = require('../config/schema.json');

	var Ajv = require('ajv');
	var ajv = new Ajv({allErrors: true, jsonPointers: true});
	require('ajv-errors')(ajv /*, {singleError: true} */);
	var validate = ajv.compile(schema);
	var valid = validate(manifest);
	if (!valid) {

		if (Array.isArray(validate.errors)) {
			validate.errors.forEach(function(element) {
				printError(element.message);
			});
		}

		printStatus('Manifest validation finished, errors printed to console.');

	} else {

		printLog('\u2714 Schema validation finished: Manifest is valid!');

	}
};

const validatePath = function(path, debug) {
	_debug = debug;
	printStatus('Starting manifest validation...');

	const manifestFullPath = path + '/manifest.json';

	if (fileExists.sync(manifestFullPath)) {

		try {
			validateSchema(jsonFile.readFileSync(manifestFullPath));
			validateFormats(path, jsonFile.readFileSync(manifestFullPath));
		} catch (e) {
			printErrorAndExit('"manifest.json" is not valid!');
		}

	}
	else {
		printErrorAndExit('"manifest.json" is not found!');
	}
	
	return errors;
	
};

module.exports = { validatePath };