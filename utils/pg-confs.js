'use strict';

var nh = require('node-helpers');
var PGConf = nh.psqlWrapper.PGConf;
var log = new(nh.LogProvider)().getLogger();
var e = process.env;

// if on heroku, then always use the DATABASE_URL environment variable
if (e.DATABASE_URL) {
    module.exports.prod = module.exports.test = module.exports.dev = new PGConf({
        connString: e.DATABASE_URL
    });
} else {
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
}
