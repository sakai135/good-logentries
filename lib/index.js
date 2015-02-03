'use strict';

var GoodReporter = require('good-reporter');
var util = require('util');
var logentries = require('le_node');
var _ = require('lodash');

var internals = {
  defaults: {
    logger: null,
    token: null,
    secure: false,
    levels: {
      debug: 0,
      info: 1,
      notice: 2,
      warning: 3,
      err: 4,
      crit: 5,
      alert: 6,
      emerg: 7
    },
    timestamp: true,
    minLevel: 'info',

    transform: null,
    defaultLevels: {
      log: 'info',
      request: 'info',
      response: 'info',
      error: 'err',
      ops: 'info'
    }
  }
};

function getLevel(event, tags) {
  if (tags) {
    var i = 0;
    for (; i < internals.levelCount; i++) {
      if (tags.indexOf(internals.levels[i]) !== -1) {
        return internals.levels[i];
      }
    }
  }
  return internals.defaultLevels[event];
}

internals.GoodLogentries = function (events, options) {
  var settings = _.defaults(options || {}, internals.defaults);
  var levels = settings.logger ? settings.logger.levels : settings.levels;

  internals.logentriesConfig = {
    token: settings.token,
    secure: settings.secure,
    levels: settings.levels,
    timestamp: settings.timestamp
  };

  internals.logger = settings.logger;
  internals.levels = _.sortBy(_.invert(levels), function(value, key) {
    return -key;
  });
  internals.levelCount = internals.levels.length;
  internals.transform = settings.transform;
  internals.defaultLevels = settings.defaultLevels;
  internals.minLevel = settings.minLevel;

  GoodReporter.call(this, events);
};

util.inherits(internals.GoodLogentries, GoodReporter);

internals.GoodLogentries.prototype.start = function (emitter, callback) {
  emitter.on('report', this._handleEvent.bind(this));
  internals.logger = internals.logger || logentries.logger(internals.logentriesConfig);
  internals.logger.level(internals.minLevel);
  callback();
};

internals.GoodLogentries.prototype.stop = function() {
  internals.logger.end();
};

internals.GoodLogentries.prototype._report = function (event, eventData) {
  var level = getLevel(event, eventData.tags);
  var data = internals.transform ? internals.transform(event, eventData) : eventData;
  internals.logger.log(level, data);
};

module.exports = internals.GoodLogentries;
