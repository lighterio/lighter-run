#!/usr/bin/env node

var spawn = require('child_process').spawn
var config = require('lighter-config').run || {}
var stdout = process.stdout
var node = process.execPath
var args = process.argv.slice(3)
var cwd = process.cwd()
var env = process.env

// Find the "main" file in "package.json".
try {
  var main = require.resolve(cwd)
  args.unshift(main)
} catch (ignore) {
  console.log(ignore)
  console.log('The current directory does not contain a node application.')
  console.log('Please run "npm init" and create an entry point file.')
  process.exit()
}

// Try to restart in half a second.
var minRestartTime = config.minRestartTime || 500

// Wait 5 seconds at most.
var maxRestartTime = config.maxRestartTime || 5e4

// Wait twice as long each time.
var restartTimeBackoff = config.restartTimeBackoff || 2

// Call a restart "ok" after 2 seconds without failing.
var cleanTime = config.cleanTime || 2e3

// The first time we restart, do it quickly.
var restartTime = 0

// Keep a reference to the child process.
var child

// Watch for changes.
var fsevents = require('fsevents')
var watcher = fsevents(cwd)
watcher.on('change', changed)
watcher.start()

// Remember when we last started.
var previousStart = new Date(0)
var failureOutput
var startTimer

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
  if (child) {
    if (/is-hot-reloadable/.test(path)) {
      child.stdin.write(info)
    } else {
      child.kill()
      child = undefined
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
  var output
  var now = new Date()
  var elapsed = now - previousStart

  // If it's been a while since we restarted, call this a clean start.
  var isCleanStart = elapsed > cleanTime
  previousStart = now

  child = spawn(node, args, {cwd: cwd, env: env})

  // When we've started cleanly, pipe child process output directly to stdout.
  if (isCleanStart) {
    pipe()
    restartTime = 0

  // After a fast failure, buffer the output in case we fail again.
  } else {
    output = ''
    var append = function (chunk) {
      output += chunk
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)

    // When we've started cleanly, write output to stdout and start piping.
    startTimer = setTimeout(function () {
      write(output + '\n')
      child.stdout.removeListener('output', append)
      child.stderr.removeListener('output', append)
      pipe()
      output = ''
      restartTime = 0
    }, cleanTime)
  }

  // When a child process dies, restart it.
  child.on('close', function () {
    // If we failed differently, log the new output.
    if (failureOutput && (munge(output) !== munge(failureOutput))) {
      write(output)

    // If we failed the same way, just show another red dot.
    } else if (child) {
      write('\u001b[31m.\u001b[39m')
    }
    failureOutput = output
    clearTimeout(startTimer)
    startTimer = setTimeout(start, restartTime)
    restartTime = Math.min(restartTime * restartTimeBackoff, maxRestartTime) || minRestartTime
  })
}

/**
 * Start piping output data to stdout.
 */
function pipe () {
  child.stdout.pipe(stdout)
  child.stderr.pipe(stdout)
}

/**
 * Try writing to `stdout`, and ignore failures.
 *
 * @param  {Buffer} data  Data to write to stdout.
 */
function write (data) {
  if (data) {
    try {
      stdout.write(data)
    } catch (e) {
      // TODO: Debug "TypeError: invalid data" at WriteStream.Socket.write
    }
  }
}
