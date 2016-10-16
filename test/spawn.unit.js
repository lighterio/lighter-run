'use strict'
/* global describe it is mock unmock beforeEach afterEach */

var config = require('lighter-config')
var cp = require('child_process')
var Child = require('./helpers/child.helper.js')
var cwd = process.cwd()
var stdout = process.stdout
var cache = require.cache
var runJs = cwd + '/run.js'

describe('spawn', function () {
  beforeEach(function () {
    mock(config, {
      lighterRun: {
        minRestartDelay: 1,
        maxRestartDelay: 4,
        restartDelayBackoff: 2,
        cleanTime: 20
      }
    })
    mock(stdout, {
      write: mock.ignore()
    })
  })

  afterEach(function () {
    unmock(config)
    unmock(cp)
    unmock(stdout)
  })

  it('spawns a child process', function (done) {
    mock(cp, {
      spawn: function (node, args) {
        is.string(node)
        is.array(args)
        setTimeout(done, 1)
        return new Child()
      }
    })
    delete cache[runJs]
    require('../run')
  })

  it('restarts the child process when it dies', function (done) {
    var spawnCount = 0
    mock(cp, {
      spawn: function (node, args) {
        var child = new Child()
        if (spawnCount++) {
          done()
        } else {
          setTimeout(function () {
            child.close()
          }, 1)
        }
        return child
      }
    })
    delete cache[runJs]
    require('../run')
  })

  it('writes output once the new child process runs cleanly', function (done) {
    var spawnCount = 0
    var child = new Child()
    mock(stdout, {
      write: mock.args()
    })
    mock(cp, {
      spawn: function (node, args) {
        ++spawnCount
        if (spawnCount < 4) {
          setTimeout(function () {
            stdout.write('Spawn ' + spawnCount + '.')
            child.close()
          }, spawnCount * 10)
        } else {
          setTimeout(done, 1)
        }
        child = new Child()
        return child
      }
    })
    delete cache[runJs]
    require('../run')
  })
})
