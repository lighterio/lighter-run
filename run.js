#!/usr/bin/env node

var spawn = require('child_process').spawn
var config = require('lighter-config').lighterRun || {}
var fsevents = require('fsevents')
var stdout = process.stdout
var write = stdout.write
var node = process.execPath
var args = process.argv.slice(3)
var cwd = process.cwd()
var env = process.env
var child = null
var output = ''
var previousStart = 0
var failureOutput

// Try to restart in half a second.
var minRestartDelay = config.minRestartDelay || 500

// Wait 5 seconds at most.
var maxRestartDelay = config.maxRestartDelay || 5e4

// Wait twice as long each time.
var restartDelayBackoff = config.restartDelayBackoff || 2

// Call a restart "ok" after 2 seconds without failing.
var cleanTime = config.cleanTime || 2e3

// The first time we restart, do it quickly.
var restartDelay = 0

// Live-reloadable (or ignorable) globs.
var live = config.live || ['.cache', 'coverage', 'data', 'log', 'public', 'views']
if (typeof live === 'string') {
  live = [live]
}
live.forEach(function (pattern, index) {
  live[index] = pattern
    .replace(/([\W])/g, function (c) {
      switch (c) {
        case '*':
          return '.+'
        default:
          return '\\' + c
      }
    })
    .replace(/^\\\//g, '^')
})
live = '(' + live.join('|') + ')'
live = new RegExp(live, 'i')

// Watch for changes.
var watcher = fsevents(cwd)
watcher.on('change', changed)
watcher.start()

// Find the "main" file in "package.json".
try {
  var main = require.resolve(cwd)
  args.unshift(main)
} catch (ignore) {
  console.error('The current directory does not have a node application.\n' +
    'Please use "npm init", then create an entry point file such as "index.js".')
  process.exit()
}

// Start the application!
start()

/**
 * Respond to a change event.
 *
 * @param  {String} path  Path of the file in which the change occurred.
 * @param  {Object} info  Information about the change from `fsevents`.
 */
function changed (path, info) {
  var time = (new Date()).toTimeString()
  if (path.indexOf(cwd + '/') === 0) {
    path = path.slice(cwd.length + 1)
  }
  var what = info.event.replace(/^\w/, function (c) { return c.toUpperCase() })
  var when = '\u001b[90m at ' + time + '\u001b[39m'
  console.log('\n\u001b[33m' + what + ' "' + path + '"' + when)
  if (!child.killed) {
    if (live.test(path)) {
      info = JSON.stringify(info)
      child.stdin.write(info)
    } else {
      child.kill()
    }
  }
}

/**
 * Get a string of numberless ordered lines for deduping logs.
 *
 * @param  {String} text  Text received from the child's stdout.
 * @return {String}       Numberless ordered lines.
 */
function munge (text) {
  var lines = ('' + text).split('\n')
  lines.forEach(function (line, index) {
    lines[index] = lines[index].replace(/\d+/, '')
  })
  lines.sort()
  text = lines.join('\n')
  return text
}

/**
 * Start an application.
 */
function start () {
  var now = Date.now()
  var elapsed = now - previousStart

  // If it's been a while since we restarted, call this a clean start.
  var isCleanStart = elapsed >= cleanTime
  previousStart = now

  // Spawn the child process, and pipe output to stdout.
  child = spawn(node, args, {cwd: cwd, env: env})
  child.stdout.pipe(stdout)
  child.stderr.pipe(stdout)

  // When we've started cleanly, pipe child process output directly to stdout.
  if (isCleanStart) {
    restartDelay = 0

  // After a fast failure, buffer the output in case we fail again.
  } else {
    stdout.write = function (chunk) {
      output += chunk
    }

    // When we've started cleanly, write output to stdout and start piping.
    this.cleanTimer = setTimeout(function () {
      stdout.write = write
      stdout.write(output)
      output = ''
      restartDelay = 0
    }, cleanTime)
  }

  // When a child process dies, restart it.
  child.on('close', function () {
    // Restore stdout.write
    stdout.write = write

    // If we failed differently, log the new output.
    if (failureOutput && (munge(output) !== munge(failureOutput))) {
      stdout.write(output)

    // If we failed the same way, just show another red dot.
    } else {
      stdout.write('\u001b[31m.\u001b[39m')
    }
    failureOutput = output
    output = ''
    clearTimeout(this.cleanTimer)
    this.cleanTimer = setTimeout(start, restartDelay)
    restartDelay = Math.min(restartDelay * restartDelayBackoff, maxRestartDelay) || minRestartDelay
  })
}
