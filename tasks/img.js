'use strict';


//---------//
// Imports //
//---------//

const ptr = require('promise-task-runner')
  , bPromise = require('bluebird')
  , path = require('path')
  , vFs = require('vinyl-fs')
  , http = require('http')
  , streamToPromise = require('stream-to-promise')
  , bRimraf = bPromise.promisify(require('rimraf'))
  , bMkdirp = bPromise.promisify(require('mkdirp'))
  ;


//------//
// Init //
//------//

var PromiseTask = ptr.PromiseTask
  , PromiseTaskContainer = ptr.PromiseTaskContainer
  , IMG_DIR = 'img'
  , srcImgs = 'src/client/assets/img'
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

var imgClean = new PromiseTask()
  .id('imgClean')
  .task(function() {
    var imgPath = path.join(__dirname, '..', staticDir, IMG_DIR);

    return bRimraf(imgPath)
      .then(() => bMkdirp(imgPath));
  });

var imgBuild = new PromiseTask()
  .id('imgBuild')
  .dependencies(imgClean)
  .task(function() {
    return streamToPromise(
      vFs.src(path.join(srcImgs, '*'))
      .pipe(vFs.dest(path.join(staticDir, IMG_DIR)))
    );
  });

var imgWatch = new PromiseTask()
  .id('imgWatch')
  .task(function() {
    var self = this
      , watcher = vFs.watch(path.join(srcImgs, "**/*"))
      , destImg = path.join(staticDir, IMG_DIR)
      ;

    watcher.on('change', function(fpath) {
      imgBuild
        .globalArgs(self.globalArgs())
        .run()
        .then(function() {
          lrOptions.path = '/changed?files=/' + path.join(destImg, path.basename(fpath));
          http.get(lrOptions);
        });
    });
  });


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(imgClean, imgBuild, imgWatch);
