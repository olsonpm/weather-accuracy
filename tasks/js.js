'use strict';


//---------//
// Imports //
//---------//

const bPromise = require('bluebird');

const bRimraf = bPromise.promisify(require('rimraf'))
  , browserify = require('browserify')
  , http = require('http')
  , nh = require('node-helpers')
  , path = require('path')
  , ptr = require('promise-task-runner')
  , streamToPromise = require('stream-to-promise')
  , templateCache = require('gulp-angular-templatecache')
  , through2 = require('through2')
  , vFs = require('vinyl-fs')
  , vss = require('vinyl-source-stream')
  , vTransform = require('vinyl-transform')
  ;


//------//
// Init //
//------//

const PromiseTask = ptr.PromiseTask
  , PromiseTaskContainer = ptr.PromiseTaskContainer
  , Environment = nh.Environment
  , srcApp = 'src/client/app'
  , staticDir = 'release/static'
  ;

var lrOptions = {
  host: 'localhost'
  , port: 35729
  , agent: false
};


//------//
// Main //
//------//

var jsClean = new PromiseTask()
  .id('jsClean')
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    return bRimraf(getJsOutFull(envInst));
  });

var jsBuild = new PromiseTask()
  .id('jsBuild')
  .dependencies(jsClean)
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    // ./ added explicitly to avoid browserify bug
    var fileIn = './' + path.join(srcApp, 'index.js');

    return streamToPromise( // first concatenate all the templates into the js cache file
        vFs.src(path.join(srcApp, '**/*.html'))
        .pipe(templateCache({
          moduleSystem: 'Browserify'
          , module: 'weatherAccuracy'
          , root: 'app'
        }))
        .pipe(vFs.dest(srcApp))
      )
      .then(() => { // then run everything through browserify
        var bundler = browserify({
          debug: true
        });

        bundler.add(fileIn);

        if (envInst.isProd()) { // and if prod, uglify
          bundler.plugin('minifyify', {
            output: path.join(staticDir, 'js', 'index.map.js')
            , map: 'index.map.js'
          });
        }

        return streamToPromise(
          bundler.bundle()
            .pipe(vss(getJsOut(envInst)))
            .pipe(replaceENV(envInst))
            .pipe(vFs.dest(path.join(staticDir, 'js')))
        );
      });
  });

var jsWatch = new PromiseTask()
  .id('jsWatch')
  .task(function() {
    var self = this;
    var envInst = new Environment()
      .HardCoded(self.globalArgs().env);

    var watcher = vFs.watch(path.join(srcApp, "**/*"));

    var destJs = path.join(staticDir, 'js', getJsOut(envInst));
    watcher.on('change', () => {
      jsBuild
        .globalArgs(self.globalArgs())
        .run()
        .then(() => {
          lrOptions.path = '/changed?files=/' + destJs;
          http.get(lrOptions);
        });
    });
  });


//---------//
// Helpers //
//---------//

// replaced ENV_NODE_ENV in order to have environment-specific behavior on the front-end
function replaceENV(env) {
  return new vTransform(function() {
    return through2.obj(function(chunk, enc, cb) {
      cb(null, chunk.toString().replace("ENV_NODE_ENV", env.curEnv()));
    });
  });
}

function getJsOut(envInst) {
  return (envInst.isProd())
    ? 'index.min.js'
    : 'index.js';
}

function getJsOutFull(env) {
  return path.join(__dirname, '..',  staticDir, 'js', getJsOut(env));
}


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(jsClean, jsBuild, jsWatch);
