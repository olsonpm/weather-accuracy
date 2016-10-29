'use strict';


//---------//
// Imports //
//---------//


const bPromise = require('bluebird');

const ptr = require('promise-task-runner')
  , addRoutes = require('../src/server/routes.js')
  , bMkdirp = bPromise.promisify(require('mkdirp'))
  , bRimraf = bPromise.promisify(require('rimraf'))
  , compression = require('compression')
  , express = require('express')
  , http = require('http')
  , nh = require('node-helpers')
  , path = require('path')
  , streamToPromise = require('stream-to-promise')
  , through2 = require('through2')
  , tinyLr = require('tiny-lr')
  , vFs = require('vinyl-fs')
  , vTransform = require('vinyl-transform')
  , webpack = require('webpack')
  , getWebpackConfig = require('../get-webpack-config')
  ;

//------//
// Init //
//------//

const PromiseTask = ptr.PromiseTask
  , TaskDependency = ptr.TaskDependency
  , PromiseTaskContainer = ptr.PromiseTaskContainer
  , Environment = nh.Environment
  ;

const log = new(nh.LogProvider)()
  .EnvInst(new Environment().HardCoded('dev'))
  .getLogger();

const bWebpack = bPromise.promisify(webpack)
  , srcHtml = 'src/client/index.html'
  , srcFavicon = 'favicon.png'
  , ENVIRONMENT_VARIABLE_DEPENDENCIES = [
    'WEATHER_UNDERGROUND_API_KEY'
    , 'FORECAST_IO_API_KEY'
    , 'HAM_WEATHER_CONSUMER_ID'
    , 'HAM_WEATHER_CONSUMER_SECRET'
    , 'WEATHER_ACCURACY_NODE_ENV'
  ];

const lrOptions = {
  host: 'localhost'
  , port: 35729
  , path: '/changed?files=/index.html'
  , agent: false
};

//------//
//------//

// Main //
var allTasks = new PromiseTaskContainer()
  .gatherContainers(
    require('./fonts')
    , require('./img')
    , require('./js')
    , require('./scss')
  );

var clean = new PromiseTask()
  .id('clean')
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    var envPath = path.join(process.cwd(), envInst.curEnv());
    return bRimraf(envPath)
      .then(function() {
        return bMkdirp(envPath);
      });
  });

var cleanThenBuildAll = new TaskDependency()
  .id('cleanThenBuildAll')
  .task(function() {
    return clean.run()
      .then(function() {
        return bPromise.all([
          allTasks.getTask('fontsBuild').run()
          , allTasks.getTask('imgBuild').run()
          , allTasks.getTask('jsBuild').run()
          , allTasks.getTask('scssBuild').run()
        ]);
      });

  });

var build = new PromiseTask()
  .id('build')
  .dependencies(cleanThenBuildAll)
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    return bPromise.all([
      streamToPromise(
        vFs.src(srcHtml)
        .pipe(injector(envInst))
        .pipe(vFs.dest('release')))
      , streamToPromise(
        vFs.src(srcFavicon)
        .pipe(vFs.dest('release')))
      , bWebpack(getWebpackConfig(envInst.curEnv())).then(stats => {
          if (stats.hasErrors())
            throw new Error("Error during compile: " + JSON.stringify(stats.toJson(true), null, 2));
        })
    ]);
  });

var htmlWatch = new PromiseTask()
  .id('htmlWatch')
  .task(function() {
    var self = this;

    var watcher = vFs.watch(srcHtml);
    watcher.on('change', function() {
      try {
        build
          .globalArgs(self.globalArgs())
          .run()
          .then(function() {
            http.get(lrOptions);
          })
          .catch(function(err) {
            log.error(JSON.stringify(err, null, 4));
          });
      } catch (e) {
        log.error('error happened while building after change communicating to lr');
        log.error(JSON.stringify(e, null, 4));
      }
    });
  });

var watchAll = new PromiseTask()
  .id('watchAll')
  .task(function() {
    htmlWatch.run();
    allTasks.getTask('fontsWatch').run();
    allTasks.getTask('imgWatch').run();
    allTasks.getTask('jsWatch').run();
    allTasks.getTask('scssWatch').run();
  });

var startServer = new PromiseTask()
  .id('startServer')
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    checkEnvVars();

    var app = express();
    app.use(compression());

    app.use(express.static(path.join(envInst.curEnv())));

    addRoutes(app, envInst, process.cwd());

    var port = process.env.PORT || 5000;
    app.listen(port);
    log.info(envInst.curEnv() + " server listening on port " + port);
  });

var buildThenStartServer = new PromiseTask()
  .id('buildThenStartServer')
  .task(function() {
    var self = this;

    return build
      .globalArgs(self.globalArgs())
      .run()
      .then(function() {
        return startServer
          .globalArgs(self.globalArgs())
          .run();
      });
  });

var startLr = new PromiseTask()
  .id('startLr')
  .task(function() {
    var port = 35729;
    tinyLr().listen(port, function() {
      log.info('Listening on port: %s ', port);
    });
  });

//-------------//
// Helper Fxns //
//-------------//

function injector(env) {
  return new vTransform(function() {
    var cssInject = "<!-- inject:css -->";
    var jsInject = "<!-- inject:js -->";
    var endInject = "<!-- endinject -->";

    var indexCssRel = env.isDev()
      ? "css/index.css"
      : "css/index.min.css";

    var indexJsRel = env.isProd()
      ? "js/index.min.js"
      : "js/index.js";

    var injectedCss = '<link rel="stylesheet" type="text/css" href="' + indexCssRel + '">';
    var injectedJs = '<script src="' + indexJsRel + '"></script>';

    // (.|[\n\r])*? matches any character including newlines
    var css_regex = new RegExp(escapeRegExp(cssInject) + "(.|[\n\r])*?" + escapeRegExp(endInject));
    var js_regex = new RegExp(escapeRegExp(jsInject) + "(.|[\n\r])*?" + escapeRegExp(endInject));

    return through2.obj(function(chunk, enc, cb) {
      chunk = chunk.toString().replace(css_regex, injectedCss)
        .replace(js_regex, injectedJs);
      cb(null, chunk);
    });
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^()|[\]\\]/g, "\\$&");
}

function checkEnvVars() {
  var undefinedEnvVars = [];
  ENVIRONMENT_VARIABLE_DEPENDENCIES.forEach(function(e) {
    if (typeof process.env[e] === 'undefined') {
      undefinedEnvVars.push(e);
    }
  });
  if (undefinedEnvVars.length > 0) {
    throw new Error("Invalid State: The following environment variable must be declared\n" + undefinedEnvVars);
  }
}


//---------//
// Exports //
//---------//


module.exports = (new PromiseTaskContainer()).addTasks(clean, build, htmlWatch, watchAll, startLr, startServer, buildThenStartServer);
