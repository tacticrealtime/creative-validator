const { ESLint } = require("eslint");

const chalk = require("chalk");

let errors = [];
let withoutErrors = true;
let _debug = false;

const printErrorAndExit = function (error) {
  printError("Formats validation aborted because of error: " + error);
  return;
};

const printError = function (error) {
  if (_debug) {
    console.error(chalk.red(error));
  }
  errors.push(error);
  withoutErrors = false;
};

const printStatus = function (status) {
  if (_debug) {
    console.log(chalk.cyan(status));
  }
};

const printLog = function (log) {
  if (_debug) {
    console.log(chalk.green(log));
  }
};

const formatError = function (element, messages, path) {
  if (
    messages == null ||
    messages.message == null ||
    typeof messages.message !== "string"
  ) {
    printError("Error message is not found");
  } else if (messages.severity == 2) {
    if (messages.message.indexOf("localStorage") !== -1) {
      printError(
        `Prohibited use of 'localStorage' is found at "${element.filePath.replace(
          path,
          "."
        )}" line ${messages.line} column ${messages.column}`
      );
    } else if (messages.message.indexOf("sessionStorage") !== -1) {
      printError(
        `Prohibited use of 'sessionStorage' is found at "${element.filePath.replace(
          path,
          "."
        )}" line ${messages.line} column ${messages.column}`
      );
    } else if (messages.message.indexOf("document.cookie") !== -1) {
      printError(
        `Prohibited use of 'document.cookie' is found at "${element.filePath.replace(
          path,
          "."
        )}" line ${messages.line} column ${messages.column}`
      );
    } else {
      printError(
        `"${messages.message}" is found at "${element.filePath.replace(
          path,
          "."
        )}" line ${messages.line} column ${messages.column}`
      );
    }
  }
};

const validatePath = async function (path, debug) {
  _debug = debug;

  printStatus("Starting security validation...");

  const CLIEngineOptions = require("../config/eslintrc");
  const cli = new ESLint(CLIEngineOptions);
  const report = await cli.lintFiles([path]);

  if (Array.isArray(report.results)) {
    report.results.forEach(function (element) {
      if (
        typeof element.messages !== "undefined" &&
        element.messages.length > 0 &&
        Array.isArray(element.messages)
      ) {
        element.messages.forEach(function (messages) {
          formatError(element, messages, path);
        });
      }
      if (element.errorCount == 0) {
        printLog(`File "${element.filePath.replace(path, ".")}" is valid`);
      }
      if (element.errorCount == 0) {
        printLog(`File "${element.filePath.replace(path, ".")}" is valid`);
      }
    });
    if (withoutErrors) {
      printLog("\u2714 Security validation finished: All files are valid!");
    } else {
      printStatus("Security validation finished, errors printed to console.");
    }
  } else {
    printErrorAndExit("Report results are not found!");
  }

  return errors;
};

module.exports = { validatePath };
