"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var logger = require('morgan');
var port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/ping', function(req, res, next) {
  console.log(req.body);
  res.send('pong');
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use('/', express.static('./src/client/'));
}
else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'build') {
  app.use(compress());
  app.use('/', express.static('./dist/'));
}

app.listen(port, function () {
  console.log('Server running at http://localhost:' + port + '/');
});

module.exports = app;
