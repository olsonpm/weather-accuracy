'use strict';


//---------//
// Imports //
//---------//

const compression = require('compression')
  , express = require('express')
  , initApi = require('./init-api')
  , Routes = require('../shared/routes')
  ;


//------//
// Init //
//------//

const app = express()
  , path = require('path')
  , routesInst = new Routes()
  ;


//------//
// Main //
//------//

const getRequestListener = letsencryptDir => {
  const routeSeq = routesInst.routeSeq()
    , singlePage = path.join(__dirname, 'index.html')
    ;

  app.use(compression());

  if (letsencryptDir) {
    app.use(express.static(letsencryptDir, {
      dotfiles: 'allow'
    }));
  }

  app.use(express.static(path.join(__dirname, 'static')));

  routeSeq
    .where(r => r.name !== "otherwise")
    .each(r => {
      app.get(
        r.url
        , (req, res) => { res.sendFile(singlePage); }
      );
    });

  initApi(app);

  // special cases
  app.get('/', (req, res) => {
    res.sendFile(singlePage);
  });
  app.get("*", (req, res) => {
    res.status(404);
    res.sendFile(singlePage);
  });

  return app;
};


//---------//
// Exports //
//---------//

module.exports = { getRequestListener };
