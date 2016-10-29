'use strict';


//---------//
// Imports //
//---------//

const ptr = require('promise-task-runner')
  , bPromise = require('bluebird')
  , http = require('http')
  , path = require('path')
  , vFs = require('vinyl-fs')
  , streamToPromise = require('stream-to-promise')
  , bRimraf = bPromise.promisify(require('rimraf'))
  , bMkdirp = bPromise.promisify(require('mkdirp'))
  ;


//------//
// Init //
//------//

const PromiseTask = ptr.PromiseTask
  , PromiseTaskContainer = ptr.PromiseTaskContainer
  , FONTS_DIR = 'fonts'
  , srcFonts = 'src/client/assets/fonts'
  , staticDir = 'release/static'
  ;

const lrOptions = {
  host: 'localhost'
  , port: 35729
  , agent: false
};


//------//
// Main //
//------//

const fontsClean = new PromiseTask()
  .id('fontsClean')
  .task(function() {
    const fontsPath = path.join(__dirname, '..', staticDir, FONTS_DIR);

    return bRimraf(fontsPath)
      .then(function() {
        return bMkdirp(fontsPath);
      });
  });

const fontsBuild = new PromiseTask()
  .id('fontsBuild')
  .dependencies(fontsClean)
  .task(function() {
    return streamToPromise(
      vFs.src(path.join(srcFonts, '*'))
      .pipe(vFs.dest(path.join(staticDir, FONTS_DIR)))
    );
  });

const fontsWatch = new PromiseTask()
  .id('fontsWatch')
  .task(function() {
    const self = this
      , watcher = vFs.watch(srcFonts)
      ;

    watcher.on('change', fpath => {
      try {
        const changePath = path.join(staticDir, FONTS_DIR, path.basename(fpath));
        console.log('changed: ' + changePath);
        fontsBuild
          .globalArgs(self.globalArgs())
          .run()
          .then(function() {
            lrOptions.path = '/changed?files=/' + changePath;
            http.get(lrOptions);
          })
          .catch(err => { console.log('%j', err); })
          ;
      } catch (e) {
        console.log('error happened while building after change communicating to lr');
        console.log('%j', e);
      }
    });
  });


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(fontsClean, fontsBuild, fontsWatch);
