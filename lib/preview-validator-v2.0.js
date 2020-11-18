'use strict';


const puppeteer = require('puppeteer');
const fs = require('fs');
const httpServer = require('http-server');
const chalk = require('chalk');
const randomUserAgent = require('random-user-agent');
const domainWhitelist = require('../config/whitelist');
const randomId = require('random-id');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const config = require('../config/preview-validator-config');
const net = require('net');

const previewHtml = `preview_${randomId()}.html`;

let server;
let port = config.server.port;
let errors = [];
let withoutErrors = true;
let _debug = true;

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

function getAvailablePort (startingAt) {

	function getNextAvailablePort (currentPort, cb) {
		const server = net.createServer();
		server.listen(currentPort, _ => {
			server.once('close', _ => {
				cb(currentPort)
			});
			server.close()
		});
		server.on('error', _ => {
			getNextAvailablePort(++currentPort, cb)
		})
	}

	return new Promise(resolve => {
		getNextAvailablePort(startingAt, resolve)
	})
}

const copyPreviewPage = function (path, previewPage) {
	fs.copyFileSync(previewPage, path + '/' + previewHtml);
};

const deletePreviewPage = function (path) {
	fs.unlinkSync(path + '/' + previewHtml);
};

const runServer =  async function (path) {
	server = httpServer.createServer({cors:true, root:path});
	port = await getAvailablePort(8000);
	server.listen(port);
};

const stopServer = function () {
	server.close();
};

const runInBrowser = async function(path) {
	const browser = await puppeteer.launch({headless:config.puppeteer.headless, args: ['--no-sandbox']});
	const page = await browser.newPage();
	page.setUserAgent(randomUserAgent());
	page.on('request', function (request) {
		const requestUrl = request.url();
		const domain = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(requestUrl)[1];
		if (domainWhitelist.indexOf(domain) === -1 && requestUrl.substr(0, 5) !== 'data:') {
			printError('Detected request to disallowed domain: ' + requestUrl);
		}
	});
	page.on('error', function(err) {
		printError('error happen at the page: ', err);
	});
	page.on('pageerror', function(pageerr) {
		printError('pageerror occurred: ', pageerr);
	});
	await page.goto(`http://localhost:${port}/${previewHtml}`, {waitUntil:'networkidle2'});
	printStatus('Waiting for editor to load...');
	await page.waitFor(config.waitingTime.editor);
	const formatCount = await page.evaluate(() => {
		return document.querySelector('.dcbde-creative-size-selector select').childElementCount;
});

	// TODO: add option to select specific format to test (can use some selector like this [label="500x500"])

	for (let i = 1; i <= formatCount; ++i) {
		const formatNameValue = await page.evaluate((num) => {
			return {
				name: document.querySelector('.dcbde-creative-size-selector select option:nth-child(' + num + ')').label,
				value: document.querySelector('.dcbde-creative-size-selector select option:nth-child(' + num + ')').value
			};
	}, i.toString());
		printStatus(`Testing format "${formatNameValue.name}" (${i}/${formatCount})...`);
		await page.select('.dcbde-creative-size-selector select', formatNameValue.value);
		await page.waitFor(config.waitingTime.format);
	}

	await browser.close();
};

const validatePath = async function(path, previewPage, debug) {
	_debug = debug;
	
	printStatus('Starting preview validation...');
	if (!previewPage) {
		previewPage = appDir + '/../res/preview.html';
	}
	copyPreviewPage(path, previewPage);
	runServer(path);
	await runInBrowser();
	deletePreviewPage(path);
	stopServer();
	if (withoutErrors) {
		printLog('\u2714 Preview validation finished without errors.');
	}
	else {
		printStatus('Preview validation finished, errors printed to console.');
	}
	return errors;
};

module.exports = { validatePath };