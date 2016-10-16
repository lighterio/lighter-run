# lighter-run
[![Chat](https://badges.gitter.im/chat.svg)](//gitter.im/lighterio/public)
[![Version](https://img.shields.io/npm/v/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Downloads](https://img.shields.io/npm/dm/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Build](https://img.shields.io/travis/lighterio/lighter-run.svg)](//travis-ci.org/lighterio/lighter-run)
[![Coverage](https://img.shields.io/coveralls/lighterio/lighter-run/master.svg)](//coveralls.io/r/lighterio/lighter-run)
[![Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](//www.npmjs.com/package/standard)

With `lighter-run`, you can the node package in your current directory, and it
will restart when files change.

## Installation
From your project directory, install and save as a dependency:
```bash
npm install --save lighter-run
```

Then add to your scripts block in `package.json`.
```json
{
  ...
  "scripts": {
    ...
    "run": "./node_modules/.bin/lighter-run",
    ...
  }
  ...
}
```

Run your process with:
```bash
npm run run
```

## Configuration
`lighter-run` uses `lighter-config` for its configuration.

## More on lighter-run...
* [Contributing](//github.com/lighterio/lighter-run/blob/master/CONTRIBUTING.md)
* [License (ISC)](//github.com/lighterio/lighter-run/blob/master/LICENSE.md)
* [Change Log](//github.com/lighterio/lighter-run/blob/master/CHANGELOG.md)
* [Roadmap](//github.com/lighterio/lighter-run/blob/master/ROADMAP.md)
