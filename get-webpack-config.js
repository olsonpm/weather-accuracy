'use strict';


//---------//
// Imports //
//---------//

const path = require('path')
  , webpack = require('webpack')
  ;


//------//
// Main //
//------//

const getConfig = env => {
  return {
    target: 'node'
    , context: __dirname
    , entry: './src/server/routes.js'
    , output: {
      path: path.join(__dirname, 'release')
      , filename: 'index.pack.js'
      , pathinfo: true
      , libraryTarget: 'commonjs2'
    }
    , module: {
      loaders: [{
        test: /\.json$/
        , loader: 'json'
      }]
    }
    , externals: [{ vertx: true, 'pg-native': true }, /\.ts$/]
    , node: { __dirname: false }
    , plugins: [
      new webpack.DefinePlugin({
        'global.env': JSON.stringify(env)
      })
    ]
  };
};


//---------//
// Exports //
//---------//

module.exports = getConfig;
