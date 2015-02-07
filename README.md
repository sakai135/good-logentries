# good-logentries

[![Codeship Status for sakai135/good-logentries](https://codeship.com/projects/30b05260-8d90-0132-b048-5691319bff63/status?branch=master)](https://codeship.com/projects/60719) [![Code Climate](https://codeclimate.com/github/sakai135/good-logentries/badges/gpa.svg)](https://codeclimate.com/github/sakai135/good-logentries) [![Test Coverage](https://codeclimate.com/github/sakai135/good-logentries/badges/coverage.svg)](https://codeclimate.com/github/sakai135/good-logentries) ![David](https://david-dm.org/sakai135/good-logentries.svg)


## Quick Start

```javascript

var logOptions = {
  
  // required
  token: 'your_logentries_token',
  
  // optional
  // these values are passed to le_node
  // see: https://github.com/logentries/le_node#configuration-options
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
  
  // optional
  // in le_node, sets minimum log level to send to logentries
  minLevel: 'info',
  
  // optional: transform the eventData before logging
  transform: function (event, eventData) {
    // do stuff before logging
    // return data to log
    return eventData;
  },
  
  // optional: default log levels for each event
  // values must match one of the levels
  defaultLevels: {
    log: 'info',
    request: 'info',
    response: 'info',
    error: 'err',
    ops: 'info'
  }
};

var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({port: 3000});
server.register([{
  register: require('good'),
  options: {
    reporters: [{
      reporter: require('good-le'),
      args: [
        {
          log: '*'
        },
        logOptions
      ]
    }]
  }
}], function (err) {
  if (err) {
    return console.error(err);
  }
  server.start(function (err) {
    if (err) {
      return console.error(err);
    }
    
    // if one of the tags matches the levels configured, the log will be sent at that level
    // if none of the tags match, the log will be sent at the default level
    server.log(['info'], 'server started');
  });
});
```
