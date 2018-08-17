# Possible validation errors and warnings

## Formats validator

Formats validator checks manifest.json for correct "sizes" (also called "formats") configuration.
Minimal valid manifest.json example:

```
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
      "name": "Test",
      "width": 300,
      "height": 250,
      "index": "index.html",
      "fallback": {
        "static": "fallback.png"
      }
    }
  ],
  "data": {}
}
```

Please refer to this structure in case of errors in format validation.
Please also make sure that opening/closing braces and quotes match and manifest.json is valid [JSON document](http://json.org/).
Paths for "index" and fallback "static" are relative from manifest.json location.
Width and height values are specified in pixels.

### "manifest.json" is not found!

Please check path to creative in command line arguments - it must be a folder with manifest.json inside.
If you are working with boilerplate creative and running `npm run validate` this should not happen, please report a bug in this case.

### "manifest.json" is not valid!

Please check that manifest.json is a valid JSON document. You can refer to minimal valid manifest.json example.

### "manifest.json" must be an object.

Please check manifest.json - it must be an object.

### "manifest.json" must not contain any additional properties.

Please check that manifest.json does not contain any addition properties. Only "type", "version", "author", "brand", "name", "created", "updated", "editor", "sizes" and "data" properties are allowed.

### Manifest's property 'type' is missing.

Please check "type" property in manifest.json - it must be present.

### Manifest's property 'type' must be a string.

Please check "type" property in manifest.json - it must be a string.

### Manifest's property 'type' must be "MANIFEST".

Please check "type" property in manifest.json - it must be "MANIFEST".

### Manifest's property 'version' is missing.

Please check "version" property in manifest.json - it must be present.

### Manifest's property 'version' must be a numeric string or a number.

Please check "version" property in manifest.json - it must be a numeric string or a number.

### Manifest's property 'version' must be greater than 1.

Please check "version" property in manifest.json - it must be greater than 1.

### Manifest's property 'version' must be greater than 1 (decimal precision of 2).

Please check "version" property in manifest.json - it must be greater than 1 (decimal precision of 2). For example "1.6" or "2.14" but NOT "1.104".

### Manifest's property 'author' is missing.

Please check "author" property in manifest.json - it must be present.

### Manifest's property 'author' must be a string.

Please check "author" property in manifest.json - it must be a string.

### Manifest's property 'brand' is missing.

Please check "brand" property in manifest.json - it must be present.

### Manifest's property 'brand' must be a string.

Please check "brand" property in manifest.json - it must be a string.

### Manifest's property 'name' is missing.

Please check "name" property in manifest.json - it must be present.

### Manifest's property 'name' must be a string.

Please check "name" property in manifest.json - it must be a string.

### Manifest's property 'created' is missing.

Please check "created" property in manifest.json - it must be present.

### Manifest's property 'created' must be a string.

Please check "created" property in manifest.json - it must be a string.

### Manifest's property 'created' must match DD/MM/YYYY format.

Please check "created" property in manifest.json - it must match DD/MM/YYYY format. For example 17/07/2018

### Manifest's property 'updated' is missing.

Please check "updated" property in manifest.json - it must be present.

### Manifest's property 'updated' must be a string.

Please check "updated" property in manifest.json - it must be a string.

### Manifest's property 'updated' must match DD/MM/YYYY format.

Please check "updated" property in manifest.json - it must match DD/MM/YYYY format. For example 17/07/2018

### Manifest's property 'editor' is missing.

Please check "editor" property in manifest.json - it must be present.

### Manifest's property 'editor' must be an object.

Please check "editor" property in manifest.json - it must be an object.

### Property 'editor' must not contain any additional properties.

Please check that property 'editor' does not contain any addition properties. Only "url" and "version" properties are allowed.

### Editor's property 'url' is missing.

Please check "url" property inside "editor" property - it must be present.

### Editor's property 'url' must be a string.

Please check "url" property inside "editor" property - it must be a string.

### Editor's property 'url' must lead to .html file.

Please check "url" property inside "editor" property - it must lead to .html file.

### Editor's property 'version' is missing.

Please check "version" property inside "editor" property - it must be present.

### Editor's property 'version' must be a numeric string or a number.

Please check "version" property inside "editor" property - it must be a numeric string or a number.

### Editor's property 'version' must be greater than 1.

Please check "version" property inside "editor" property - it must be greater than 1.

### Editor's property 'version' must be greater than 1 (decimal precision of 2).

Please check "version" property inside "editor" property - it must be greater than 1 (decimal precision of 2). For example "1.6" or "2.14" but NOT "1.104".

### Manifest's property 'sizes' is missing.

Please check "sizes" property in manifest.json - it must be present.

### Manifest's property 'sizes' must be an array.

Please check "sizes" property in manifest.json - it must be an array.

### Manifest's property 'sizes' must contain an object.

Please check "sizes" property in manifest.json - it must contain an object with format properties.

### Manifest's property 'data' is missing.

Please check "data" property in manifest.json - it must be present.

### Manifest's property 'data' must be an object.

Please check "data" property in manifest.json - it must be an object.

### Formats are not found!

Please check "sizes" property in manifest.json - it must be an array.

### One or more formats are empty or not objects!

Please check "sizes" property in manifest.json - it must contain only objects.

### Could not validate formats.

Please check "sizes" property in manifest.json - it must contain a valid object.

### One or more sizes have empty or missing names!

Each object in "sizes" array must have "name" string field. It is recommended to use unique names for making more convenient advert editor.

### "NNN" format's property 'type' must be a string.

Each object in "sizes" array must have "type" string field.

### "NNN" format's property 'type' is "XYZ" which is not supported!

Currently only values "STATIC" and "ADAPTIVE" for "type" field are supported.

### "NNN" format's dimensions are missing!

Each object in "sizes" must contain "width" and "height" number properties.

### "NNN" format's property 'index' is missing or is not a string.

Each object in "sizes" must contain "index" string property with relative path to html of this specific format.

### "NNN" format's index file is not found!

Please check that html file specified in "index" property exists.

### "NNN" format's index file must be a html.

Please check that format's file is a '.html' file.

### "NNN" format's 'fallback' property is missing.

Each object in "sizes" must contain "fallback" property.

### "NNN" format's 'fallback' object is missing 'static' property.

Each object in "sizes" must contain "fallback" object with "static" string property.

### "NNN" format's fallback 'static' property is not a string.

Each object in "sizes" must contain "fallback" object with "static" string property.
This string must be a relative path to fallback image of this specific format.

### "NNN" format's fallback file is not found!

Please check that fallback image specified in "static" property exists.

### "NNN" format's fallback file must be a png, jpg or gif.

Please check that fallback image specified in "static" property is png, jpg or gif.

### "NNN" format's fallback file does not match specified dimensions (NNNxKKK)!

For any static format fallback image's size (width, height) must match specified dimensions of the format.

For example for 300x600 format properties must be
```
"width": 300,
"height": 600,
```
The fallback image can be
```
"fallback": {
  "static": "fallback.png"
}
```
Where fallback.png is 300 pixels width and 600 pixels height.

## Security validator

Security validator checks code for some basic security issues in javascript code.
Any warnings are printed in report and must be reviewed by humans.
There are 3 types of errors which relates to actions forbidden in creatives: usage of cookies, usage of localStorage and usage of sessionStorage.
Security validator also check for basic errors in javascript code.

### Prohibited use of 'document.cookie' is found at "FILE"

Cookies cannot be used in creatives. Please remove any cookies usages from code.

### Prohibited use of 'localStorage' is found at "FILE"

Local storage cannot be used in creatives. Please remove any local storage usages from code.

### Prohibited use of 'sessionStorage' is found  at "FILE"

Sessions storage cannot be used in creatives. Please remove any session storage usages from code.

### "ERROR" is found at "FILE"

Please review the javascript code for the found issue.

## Preview validator

Preview validator checks creative for javascript errors in console and usage of external resources.
It doesn't provide any guarantees and still require human to do code review for creatives.

### error happen at the page: ... / pageerror occurred: ...

Any javascript erros occured during test run in headless Google Chrome browser will be printed here.
Please use browser console for debugging. Make sure your manifest.json is valid.

### Detected request to disallowed domain: example.com

Only local resources (images, script, html pages, etc) can be used in creatives.
Also some domains related to Google Analytics, Google Fonts, Tactic brand data and others are allowed.