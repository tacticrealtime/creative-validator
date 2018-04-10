# Possible validation errors and warnings

## Formats validator

Formats validator checks manifest.json for correct "sizes" (also called "formats") configuration.
Minimal valid manifest.json example:

```
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
```

Please refer to this structure in case of errors in format validation.
Please also make sure that opening/closing braces and quotes match and manifest.json is valid [JSON document](http://json.org/).
Paths for "index" and fallback "static" are relative from manifest.json location.
Width and height values are specified in pixels.

### "manifest.json" is not found!

Please check path to creative in command line arguments - it must be a folder with manifest.json inside.
If you are working with boilerplate creative and running `npm run validate` this should not happen, please report a bug in this case.

### Sizes are not found!

Please check "sizes" field in manifest.json - it must be an array.

### One or more sizes are empty or not objects!

Please check "sizes" field in manifest.json - it must contain only objects.

### One or more sizes has empty or missing names!

Each object in "sizes" array must have "name" string field. It is recommended to use unique names for making more convenient advert editor.

### Type of size "NNN" is invalid!

Each object in "sizes" array must have "type" string field.

### Size "NNN" has type "XYZ" which is not supported!

Currently only values "STATIC" and "ADAPTIVE" for "type" field are supported.

### Dimensions for size "NNN" are missing!

Each object in "sizes" must contain "width" and "height" number properties. Please make sure numbers are without quotes ("width": 580, not "width": "580").

### Index path of size "NNN" is invalid!

Each object in "sizes" must contain "index" string property with relative path to html of this specific size.

### Index file of size "NNN" is not found!

Please check that html file specified in "index" property exists.

### Fallback path of size "NNN" is invalid!

Each object in "sizes" must contain "fallback" property.
This property is an object with string property "static" with relative path to html of this specific size.

### Fallback for size "NNN" is not found!

Please check that fallback image specified in "static" property exists.

### Fallback for size "NNN" doesn't match specified dimensions (NNNxKKK)!

For any static size fallback image size must match width and height of size itself.
For example for 300x600 size properties must be
```
"width": 300,
"height": 600,
```
And fallback image must be
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

### Unexpected use of "document.cookie".

Cookies cannot be used in creatives. Please remove any cookies usages from code.

### localStorage can be unsafe

Local storage cannot be used in creatives. Please remove any local storage usages from code.

### sessionStorage can be unsafe

Sessions storage cannot be used in creatives. Please remove any session storage usages from code.

## Preview validator

Preview validator checks creative for javascript errors in console and usage of external resources.
It doesn't provide any guarantees and still require human to do code review for creatives.

### error happen at the page: ... / pageerror occurred: ...

Any javascript erros occured during test run in headless Google Chrome browser will be printed here.
Please use browser console for debugging.

### Detected request to disallowed domain: example.com

Only local resources (images, script, html pages, etc) can be used in creatives.
Also some domains related to Google Analytics, Google Fonts, Tactic brand data and others are allowed.