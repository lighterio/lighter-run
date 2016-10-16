'use strict'
/* global is */

var util = require('util')
var Emitter = require('events')

module.exports = Child

function Stream () {
  Emitter.call(this)
}

util.inherits(Stream, Emitter)
Stream.prototype.pipe = function (stream) {
  is(stream, process.stdout)
}

function Child () {
  Stream.call(this)
  this.stdout = new Stream()
  this.stderr = new Stream()
  this.stdin = new Stream()
}

util.inherits(Child, Stream)
Child.prototype.kill = function () {
  this.killed = true
}
Child.prototype.close = function () {
  this.emit('close')
}
