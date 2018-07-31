# Description

This is collection of utilities designed for partially automate process of checking third party creatives.

# Installation:

1. Clone this repository
2. Run command `npm install` from directory where you cloned it

# Formats validator

## Usage

`./bin/formats-validator.js [path]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.

## What it does

Utility checks on given path:

1. manifest.json existence
2. validates manifest.json through JSON Schema
2. sizes section in manifest existence
3. files specified in "index" property of each size all exist too
4. static fallback is specified for each size and file on given path exists

# Preview validator

## Usage

`./bin/preview-validator.js [path]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.

## What it does

Utility launches headless Chromium with [puppeteer](https://github.com/GoogleChrome/puppeteer) and opens preview page for given creative.
Then it waits for 30 seconds **for each format** and logs the following:

* If creative throws errors to JS console
* If creative requests disallowed domains

## What it doesn't

### Scan for malicious code
This utility doesn't scan creative for viruses or any kinds of malicious code. 

### Feeds validation
This utility cannot be used to make sure that external resources is not used in feeds. Feed can contain anything and it can be dynamic. Feed domain though (https://feed.trtm.io) is not included into wh

# Security validation

## Usage

`./bin/security-validator.js [path]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.

## What it does

Utility checks on given path javascript files for some basic security issues.

# Full validation

For running all included validators you can run the following command:

`./bin/creative-validator.js [path] debug`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.
When formats validator finds error further validation is stopped. When preview validator finds error validation continues.
Debug argument must be included in order to view log messages in the command-line interface.


# Installation as a dependency of creative

Run `npm install github:tacticrealtime/creative-validator` inside directory of creative.
You also might want to consider installing it as a development dependency using `--save-dev` option.
After installing as a dependency it is possible to run validation with npm scripts.
For example like this:
```
"scripts": {

...

    "validate": "./node_modules/creative-validator/bin/creative-validator.js . debug",
    "validate-formats": "./node_modules/creative-validator/bin/formats-validator.js",
    "validate-security": "./node_modules/creative-validator/bin/security-validator.js",
    "validate-preview": "./node_modules/creative-validator/bin/preview-validator.js",

...

}
```

Then you can run the following commands inside creative directory:

`npm run validate` for full validation

`npm run validate-formats` for formats validation

`npm run validate-security` for security validation

`npm run validate-preview` for preview validation

# Validation errors

More detailed description of validation errors can be found on [errors page](ERROR_LIST.md)