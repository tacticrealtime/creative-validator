'use strict';

/*

Minimal valid manifest example:

{
  "editor": {
    "url": "editor.html",
    "version": "1.1"
  },
  "sizes": [
    {
      "type": "STATIC",
      "name": "Test",
      "width": 300,
      "height": 600,
      "index": "test.html",
      "fallback": {
        "static": "fallback.png"
      }
    }
  ]
}

 */

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
		printError('One or more sizes has empty or missing names!');
	}
	else if (size.type == null || typeof size.type !== 'string') {
		printError(`Type of size "${size.name}" is invalid!`);
	}
	else if (size.type !== 'STATIC' && size.type !== 'RESPONSIVE') {
		printError(`Size "${size.name}" has type "${size.type}" which is not supported!`);
	}
	else if (size.width == null || size.height == null) {
		printError(`Dimensions for size "${size.name}" are missing!`);
	}
	else if (size.index == null || typeof size.index !== 'string') {
		printError(`Index path of size "${size.name}" is invalid!`);
	}
	else if (!fileExists.sync(path + '/' + size.index)) {
		printError(`Index file of size "${size.name}" is not found!`);
	}
	else if (size.fallback == null || size.fallback.static == null) {
		printError(`Fallback path of size "${size.name}" is invalid!`);
	}
	else if (!fileExists.sync(path + '/' + size.fallback.static)) {
		printError(`Fallback for size "${size.name}" is not found!`);
	}
	else if (size.type === 'STATIC' && !sizeIsCorrect(path + '/' + size.fallback.static, size.width, size.height)) {
		printError(`Fallback for size "${size.name}" doesn't match specified dimensions (${size.width}x${size.height})!`);
	}
	else {
		printLog(`Size "${size.name}" is valid`);
	}
};

const validateFormats = function(path, manifest) {
	const sizes = jsonPath.query(manifest, '$.sizes');
	if (Array.isArray(sizes)) {
		sizes[0].forEach(function(size) {
			validateSize(path, size);
		});
		console.log();
		if (withoutErrors) {
			printLog('\u2714 Formats validation finished: all sizes are valid!');
		}
		else {
			console.log('Formats validation finished, errors printed to console.');
		}
	}
	else {
		printErrorAndExit('Sizes are not found!');
	}
};

const validatePath = function(path) {
	console.log('Starting formats validation...');
	const manifestFullPath = path + '/manifest.json';
	if (fileExists.sync(manifestFullPath)) {
		validateFormats(path, jsonFile.readFileSync(manifestFullPath));
	}
	else {
		printErrorAndExit('"manifest.json" is not found!');
	}
};

module.exports = { validatePath };