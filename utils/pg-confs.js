'use strict';

var PGConf = require('node-helpers').psqlWrapper.PGConf;
var e = process.env;

module.exports.dev = new PGConf({
    user: 'weather_accuracy_test'
    , database: 'weather_accuracy_test'
    , password: e.PGPASS_WEATHER_ACCURACY_TEST
    , port: 5432
    , host: 'localhost'
    , ssl: true
});

module.exports.test = new PGConf({
    user: 'weather_accuracy'
    , database: 'weather_accuracy'
    , password: e.PGPASS_WEATHER_ACCURACY
    , port: 5432
    , host: 'localhost'
    , ssl: true
});

if (e.DATABASE_URL) {
    module.exports.prod = new PGConf({
        connString: e.DATABASE_URL
    });
}
