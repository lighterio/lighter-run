'use strict'
/* global describe it is mock unmock */

var cp = require('child_process')
var cwd = process.cwd()
var cache = require.cache
var runJs = cwd + '/run.js'
var fseventsJs = cwd + '/node_modules/fsevents/fsevents.js'
var noop = function () {}
var fakeStream = {pipe: noop}

describe('run', function () {
  it('spawns a child process', function (done) {
    mock(cp, {
      spawn: function (node, args) {
        is.string(node)
        is.array(args)
        unmock(cp)
        setTimeout(done, 1)
        return {
          on: noop,
          stdout: fakeStream,
          stderr: fakeStream
        }
      }
    })
    delete cache[runJs]
    require('../run')
  })

  it('logs an error if there is no package.json', function (done) {
    mock(console, {
      error: mock.count()
    })
    mock(process, {
      exit: function () {
        is(console.error.value, 1)
        unmock(console)
        unmock(process)
        process.chdir(cwd)
        done()
      }
    })
    process.chdir(__dirname)
    delete cache[runJs]
    require('../run')
  })

  it('listens for changes', function (done) {
    var fsevents = cache[fseventsJs]
    var changed
    mock(console, {
      log: mock.args()
    })
    mock(cp, {
      spawn: function (node, args) {
        return {
          on: noop,
          stdout: fakeStream,
          stderr: fakeStream,
          kill: function () {
            unmock(cp)
            unmock(fsevents)
            unmock(console)
            done()
          }
        }
      }
    })
    mock(fsevents, {
      exports: function () {
        return {
          on: function (type, fn) {
            changed = fn
          },
          start: mock.count()
        }
      }
    })
    delete cache[runJs]
    require('../run')
    changed(__filename, {
      path: __filename,
      event: 'modified'
    })
  })
})
