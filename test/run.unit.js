'use strict'
/* global describe it is mock unmock */

var cp = require('child_process')

describe('run', function () {
  it('spawns', function (done) {
    mock(cp, {
      spawn: function (node, args) {
        is.string(node)
        is.array(args)
        unmock(cp)
        unmock(require)
        setTimeout(done, 100)
        return {
          _events: {},
          on: function (type, fn) {
            this._events[type] = fn
          },
          stdout: {
            pipe: function () {}
          },
          stderr: {
            pipe: function () {}
          }
        }
      }
    })
    mock(require, {
      cache: {}
    })
    require('../run')
  })
})
