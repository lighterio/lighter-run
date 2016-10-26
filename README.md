# lighter-run
[![Chat](https://badges.gitter.im/chat.svg)](//gitter.im/lighterio/public)
[![Version](https://img.shields.io/npm/v/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Downloads](https://img.shields.io/npm/dm/lighter-run.svg)](//www.npmjs.com/package/lighter-run)
[![Build](https://img.shields.io/travis/lighterio/lighter-run.svg)](//travis-ci.org/lighterio/lighter-run)
[![Coverage](https://img.shields.io/coveralls/lighterio/lighter-run/master.svg)](//coveralls.io/r/lighterio/lighter-run)
[![Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](//www.npmjs.com/package/standard)

With `lighter-run`, you can run the node application that's in your current
directory, and it will restart when files change.

## Quick Start
1. Install globally (using sudo if necessary).
```bash
npm install --global lighter-run
```
2. Ensure that the `"main"` property in your `package.json` points to your
application's entry point file.

3. Run!
```bash
lighter-run
```

## Configuration
`lighter-run` uses `lighter-config` for its configuration. Just create a
`"config/base.json"` file in your project, and add some options under a
property called `"lighterRun"`. The following options are the default values:
```json
{
  "lighterRun": {
    "minRestartDelay": 500,
    "maxRestartDelay": 50000,
    "restartDelayBackoff": 2,
    "cleanTime": 2000,
    "live": [
      ".cache",
      "coverage",
      "data",
      "log",
      "public",
      "views"
    ]
  }
}
```

## More on lighter-run...
* [Contributing](//github.com/lighterio/lighter-run/blob/master/CONTRIBUTING.md)
* [License (ISC)](//github.com/lighterio/lighter-run/blob/master/LICENSE.md)
* [Change Log](//github.com/lighterio/lighter-run/blob/master/CHANGELOG.md)
* [Roadmap](//github.com/lighterio/lighter-run/blob/master/ROADMAP.md)
