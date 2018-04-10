# Description

This is collection of utilities designed for partially automate process of checking third party creatives.

# Installation:

1. Clone this repository
2. Run command `npm install -g` from directory where you cloned it

# Formats validator

## Usage

`formats-validator [path]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.

## What it does

Utility checks on given path:

1. manifest.json existence
2. sizes section in manifest existence
3. files specified in "index" property of each size all exist too
4. static fallback is specified for each size and file on given path exists

# Preview validator

## Usage

`preview-validator [path] [-p [path to custom preview page]]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.
With `-p` option it is possible to use custom preview page instead of standard preview.html included into validator.

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

`security-validator [path]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.

## What it does

Utility checks on given path javascript files for some basic security issues.

# Full validation

For running all included validators you can run the following command:

`creative-validator [path] [-p [path to custom preview page]]`

Specify path to directory where creative is unzipped (manifest.json must be here). By default current path is used.
With `-p` option it is possible to use custom preview page instead of standard preview.html included into validator.
When formats validator finds error further validation is stopped. When preview validator finds error validation continues.

# Installation and usage on Linux (local installation and usage)

Global installation (`npm install -g`) might not work. Instead just run `npm install` for local installation.

For execution just run required validator from `bin` subdirectory of directory where you cloned git repository.

For example, `./bin/preview-validator-cli.js ../image-text-primitive/`

# Installation as a dependency of creative

Run `npm install npm install github:tacticrealtime/creative-validator` inside directory of creative.
You also might want to consider installing it as a development dependency using `--save-dev` option.
After installing as a dependency it is possible to run validation with npm scripts.
For example like this:
```
"scripts": {

...

    "validate": "./node_modules/creative-validator/bin/creative-validator-cli.js -p ./preview.html",
    "validate-formats": "./node_modules/creative-validator/bin/formats-validator-cli.js",
    "validate-preview": "./node_modules/creative-validator/bin/preview-validator-cli.js -p ./preview.html",

...

}
```

# Validation errors

More detailed description of validation errors can be found on [errors page](Errors.md)

# Development

During development it is more convenient to execute local version (as described in [paragraph about local installation and usage](#installation-and-usage-on-linux-local-installation-and-usage)).
You only need to run `npm install` once - for installing dependencies. If you change only `.js` code and/or `config/*.json` files you don't need to run `npm install` again.
If you prefer to run global version `npm install -g` then you need to do global install after every change in code or config files.