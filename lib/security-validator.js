const CLIEngine = require("eslint").CLIEngine;

const validatePath = function(path) {
	console.log('Starting security validation...');
	const CLIEngineOptions = require('../config/eslintrc');
	const pathEnding = path.slice(-1) === '/' ? '' : '/';
	CLIEngineOptions.ignorePattern = path + pathEnding + 'node_modules';
	CLIEngineOptions.useEslintrc = false;
	CLIEngineOptions.allowInlineConfig = false;
	const cli = new CLIEngine(CLIEngineOptions);
	const report = cli.executeOnFiles([path]);
	const formatter = cli.getFormatter('table');
	console.log('Security validation finished. Results:');
	console.log(formatter(report.results));
};

module.exports = { validatePath };