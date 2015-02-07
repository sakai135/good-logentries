var EventEmitter = require('events').EventEmitter;
var expect = require('code').expect;
var lab = exports.lab = require('lab').script();
var GoodLogentries = require('..');

lab.test('pass data', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      log: function (level, data) {
        expect(data.msg).to.equal('hi');
        done();
      },
      level: function () {}
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    ee.emit('report', 'request', {
      msg: 'hi'
    });
  });
});

lab.test('tag with level', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      log: function (level, data) {
        expect(level).to.equal('notice');
        done();
      },
      levels: {warning: 3, notice: 2},
      level: function () {}
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    ee.emit('report', 'request', {
      tags: ['notice']
    });
  });
});

lab.test('tag with non-level', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      log: function (level, data) {
        expect(level).to.equal('info');
        done();
      },
      level: function () {}
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    ee.emit('report', 'request', {
      tags: ['sometag']
    });
  });
});

lab.test('request no tags', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      log: function (level, data) {
        expect(level).to.equal('info');
        done();
      },
      level: function () {}
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    ee.emit('report', 'request', {});
  });
});

lab.test('stop', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      end: function () {
        done();
      },
      level: function () {}
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    reporter.stop();
  });
});

lab.test('transform', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'}, {
    logger: {
      log: function (level, data) {
        expect(data.extra).to.equal('extra');
        done();
      },
      level: function () {}
    },
    transform: function (event, data) {
      expect(event).to.equal('request');
      data.extra = 'extra';
      return data;
    }
  });
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    ee.emit('report', 'request', {
    });
  });
});

lab.test('default options', function (done) {
  var ee = new EventEmitter();
  var reporter = new GoodLogentries({request: '*'});
  reporter.start(ee, function (err) {
    expect(err).to.not.exist();
    done();
  });
});
