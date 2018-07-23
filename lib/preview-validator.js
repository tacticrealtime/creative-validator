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

const previewHtml = `preview_${randomId()}.html`;

let server;
let withoutErrors = true;

const copyPreviewPage = function (path, previewPage) {
	fs.copyFileSync(previewPage, path + '/' + previewHtml);
};

const deletePreviewPage = function (path) {
	fs.unlinkSync(path + '/' + previewHtml);
};

const runServer = function (path) {
	server = httpServer.createServer({cors:true, root:path});
	server.listen(config.server.port);
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
		const domain = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(requestUrl)[1];
		if (domainWhitelist.indexOf(domain) === -1 && requestUrl.substr(0, 5) !== 'data:') {
			console.error(chalk.red('Detected request to disallowed domain: ' + requestUrl));
			withoutErrors = false;
		}
	});
	page.on('error', function(err) {
		console.error(chalk.red('error happen at the page: ', err));
		withoutErrors = false;
	});
	page.on('pageerror', function(pageerr) {
		console.error(chalk.red('pageerror occurred: ', pageerr));
		withoutErrors = false;
	});
	await page.goto(`http://localhost:${config.server.port}/${previewHtml}`, {waitUntil:'networkidle2'});
	console.log('Waiting for editor to load...');
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
		console.log(`Testing format "${formatNameValue.name}" (${i}/${formatCount})...`);
		await page.select('.dcbde-creative-size-selector select', formatNameValue.value);
		await page.waitFor(config.waitingTime.format);
	}

	await browser.close();
};

const validatePath = async function(path, previewPage) {
	console.log('Starting preview validation...');
	if (!previewPage) {
		previewPage = appDir + '/../res/preview.html';
	}
	copyPreviewPage(path, previewPage);
	runServer(path);
	await runInBrowser();
	deletePreviewPage(path);
	stopServer();
	if (withoutErrors) {
		console.log();
		console.log(chalk.green('\u2714 Preview validation finished without errors.'));
		process.exit(0);
	}
	else {
		console.error('Preview validation finished, errors printed to console.');
		process.exit(1);
	}
};

module.exports = { validatePath };