'use strict';
/* --execute=node-- */

var _ = require('lodash')
    , moment = require('moment')
    , fs = require('fs');

var dates = [];
var curDate = moment('20150101', 'YYYYMMDD');
var endDate = moment('20150301', 'YYYYMMDD');

while (!curDate.isSame(endDate)) {
    dates.push(curDate.format('YYYYMMDD'));
    curDate.add(1, 'day');
}

var theTemplate = fs.readFileSync('./weather-date.erb').toString();
var result = _.template(fs.readFileSync('./weather-date.erb'), {
    'imports': {
        'dates': dates
    }
})();
fs.writeFileSync('../test-data/weather_date.sql', result);
