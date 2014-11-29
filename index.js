var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var util = require('util');

var filepath = path.join(process.cwd(), '.gitignore');

function GitIgnoreEnsure () {
  EventEmitter.call(this);
}

util.inherits(GitIgnoreEnsure, EventEmitter);

GitIgnoreEnsure.prototype.ensure = function (pattern) {
  var self = this;
  if (process.env.NODE_ENV !== 'development') {
    return this.emit('done');
  }
  fs.exists(filepath, function (exists) {
    if ( ! exists) return self.emit('done');
    var command = util.format('grep %s %s', pattern, filepath);
    exec(command, function (err, results) {
      if (err) {
        fs.appendFile(filepath, '.queues*', function (err) {
          if (err) return self.emit('error', err);
          return self.emit('done');
        });
      } else {
        return self.emit('done');
      }
    });
  });
};

module.exports = new GitIgnoreEnsure();