# lighter-run
[![Chat](https://badges.gitter.im/chat.svg)](//gitter.im/lighterio/public)
[![Version](https://img.shields.io/npm/v/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Downloads](https://img.shields.io/npm/dm/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Build](https://img.shields.io/travis/lighterio/lighter-run.svg)](//travis-ci.org/lighterio/lighter-run)
[![Coverage](https://img.shields.io/coveralls/lighterio/lighter-run/master.svg)](//coveralls.io/r/lighterio/lighter-run)
[![Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](//www.npmjs.com/package/standard)

The `lighter-run` module combines speed and support by immediately loading a
basic set of MIME types, and lazily loading a full set.

## Installation
From your project directory, install and save as a dependency:
```bash
npm install --save lighter-run
```

## API
The `lighter-run` package exports an object whose keys are lowercase file
extensions and values are MIME types.

### mime
The basic mapping is pretty simple:
```js
var mime = require('lighter-run')
console.log(mime)

//> { css: 'text/css',
//    gif: 'image/gif',
//    html: 'text/html',
//    ico: 'image/x-icon',
//    jpg: 'image/jpg',
//    js: 'application/javascript',
//    json: 'application/json',
//    png: 'image/png',
//    svg: 'image/svg+xml',
//    txt: 'text/plain',
//    xml: 'application/xml' }
```

### mime.set(extension, type)
Set or overwrite a MIME type mapping for a given extension.
```js
var mime = require('lighter-run')
console.log(mime.js)
//> 'application/javascript'

// Let's consider JavaScript to be text.
mime.set('js', 'text/javascript')
console.log(mime.js)
//> 'text/javascript'
```

### mime.load()
Load the comprehensive list immediately (and return the mapping).
```js
var mime = require('lighter-run').load()
console.log(mime.docx)
//> 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
```

### mime.timeout(milliseconds)
Delay loading the comprehensive list for a specified number of milliseconds,
rather than the default 1 millisecond.


## More on lighter-run...
* [Contributing](//github.com/lighterio/lighter-run/blob/master/CONTRIBUTING.md)
* [License (ISC)](//github.com/lighterio/lighter-run/blob/master/LICENSE.md)
* [Change Log](//github.com/lighterio/lighter-run/blob/master/CHANGELOG.md)
* [Roadmap](//github.com/lighterio/lighter-run/blob/master/ROADMAP.md)
