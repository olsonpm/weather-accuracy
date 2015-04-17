'use strict';


//---------//
// Imports //
//---------//

// generated imports

var templateCache = require('gulp-angular-templatecache');
// end of generated imports

var bPromise = require('bluebird')
    , browserify = require('browserify')
    , http = require('http')
    , nh = require('node-helpers')
    , path = require('path')
    , ptr = require('promise-task-runner')
    , streamToPromise = require('stream-to-promise')
    , through2 = require('through2')
    , vFs = require('vinyl-fs')
    , vss = require('vinyl-source-stream')
    , VTransform = require('vinyl-transform')
    , bRimraf = bPromise.promisify(require('rimraf'))
    , bMkdirp = bPromise.promisify(require('mkdirp'));


//------//
// Init //
//------//

var PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , Environment = nh.Environment;

var srcApp = 'src/client/app';

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
                    , root: path.join(envInst.curEnv(), 'app')
                }))
                .pipe(vFs.dest(srcApp))
            )
            .then(function() { // then run everything through browserify
                var bundler = browserify(fileIn);

                if (envInst.isProd()) { // and if prod, uglify
                    bundler.transform({
                        global: true
                    }, 'uglifyify');
                }

                return streamToPromise(
                    bundler.bundle()
                    .pipe(vss(getJsOut(envInst)))
                    .pipe(replaceENV(envInst))
                    .pipe(vFs.dest(envInst.curEnv()))
                );
            });
    });

var jsWatch = new PromiseTask()
    .id('jsWatch')
    .task(function() {
        var self = this;
        var envInst = new Environment()
            .HardCoded(this.globalArgs().env);

        var watcher = vFs.watch(path.join(srcApp, "**/*"));

        var destJs = path.join(envInst.curEnv(), getJsOut(envInst));
        watcher.on('change', function(fpath) {
            jsBuild
                .globalArgs(self.globalArgs())
                .run()
                .then(function() {
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
    return new VTransform(function(filename) {
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
    return path.join(process.cwd(), getJsOut(env));
}


//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(jsClean, jsBuild, jsWatch);
