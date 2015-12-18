'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var proxyMiddleware = require('http-proxy-middleware');
var util = require('util');
var $ = require('gulp-load-plugins')();
var port = process.env.PORT || 9000;

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.client || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.client) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes,
    middleware: proxyMiddleware('http://localhost:' + port + conf.paths.api)
  };

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('nodemon', function (cb) {
  var started = false;

  return $.nodemon({
    script: path.join(conf.paths.server, '/server.js'),
    env: {
      'NODE_ENV': 'development',
      'PORT': port
    }
  }).on('start', function () {
    if(!started) {
      cb();
      started = true;
    }
  }).on('restart', function () {
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 500);
  });
});

gulp.task('serve', ['nodemon', 'watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.client]);
});

gulp.task('serve:dist', ['build'], function () {
  return $.nodemon({
    script: path.join(conf.paths.server, '/server.js'),
    env: {
      'NODE_ENV': 'build',
      'PORT': port
    }
  });
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.client], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});

