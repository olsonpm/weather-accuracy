'use strict';


//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
  , bPromise = require('bluebird')
  , nh = require('node-helpers')
  , path = require('path')
  , vFs = require('vinyl-fs')
  , sass = require('node-sass')
  , http = require('http')
  , bFs = require('fs-bluebird')
  , bRimraf = bPromise.promisify(require('rimraf'))
  , bMkdirp = bPromise.promisify(require('mkdirp'))
  , bNcp = bPromise.promisifyAll(require('ncp')).ncp
  ;


//------//
// Init //
//------//

const PromiseTask = ptr.PromiseTask
  , PromiseTaskContainer = ptr.PromiseTaskContainer
  , Environment = nh.Environment
  , CSS_DIR = 'css'
  , srcScss = 'src/client/assets/scss'
  , staticDir = 'release/static'
  ;

sass.renderAsync = bPromise.promisify(sass.render);


//------//
// Main //
//------//

var scssClean = new PromiseTask()
  .id('scssClean')
  .task(function() {
    var cssPath = path.join(__dirname, '..', staticDir, CSS_DIR);

    return bRimraf(cssPath)
      .then(function() {
        return bMkdirp(cssPath);
      });
  });

var scssBuild = new PromiseTask()
  .id('scssBuild')
  .dependencies(scssClean)
  .task(function() {
    var res;

    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    var cssOut = (envInst.isDev())
      ? 'index.css'
      : 'index.min.css';

    var destCss = path.join(staticDir, CSS_DIR, cssOut);

    var nodeSassOpts = {
      file: path.join(srcScss, 'index.scss')
    };

    if (!envInst.isProd()) {
      nodeSassOpts.sourceMap = true;
      nodeSassOpts.outFile = cssOut;
    } else {
      nodeSassOpts.outputStyle = 'compressed';
    }

    var bCompileAndCopySass = sass.renderAsync(nodeSassOpts)
      .then(function(successObj) {
        return bMkdirp(path.join(staticDir, CSS_DIR))
          .thenReturn(successObj);
      })
      .then(function(successObj) {
        var pRes;

        if (envInst.isProd()) {
          pRes = bFs.writeFileAsync(destCss, successObj.css);
        } else {
          pRes = bPromise.join(
            bFs.writeFileAsync(destCss, successObj.css)
            , bFs.writeFileAsync(destCss + '.map', successObj.map)
          );
        }

        return pRes;
      });

    if (envInst.isProd()) {
      res = bCompileAndCopySass;
    } else {
      res = bPromise.join(
        bCompileAndCopySass
        , bNcp(srcScss, path.join(staticDir, CSS_DIR))
      );
    }

    return res;
  });

var scssWatch = new PromiseTask()
  .id('scssWatch')
  .task(function() {
    var envInst = new Environment()
      .HardCoded(this.globalArgs().env);

    var watcher = vFs.watch(path.join(srcScss, "**/*"));
    var cssOut = (envInst.isDev())
      ? 'index.css'
      : 'index.min.css';

    var destCss = path.join(staticDir, CSS_DIR, cssOut);
    watcher.on('change', function() {
      scssBuild.globalArgs({
          env: envInst.curEnv()
        })
        .run()
        .then(function() {
          var options = {
            host: 'localhost'
            , port: 35729
            , path: '/changed?files=/' + destCss
            , agent: false
          };
          http.get(options);
        });
    });
  });

//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(scssClean, scssBuild, scssWatch);
