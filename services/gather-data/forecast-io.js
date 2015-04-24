'use strict';

//---------//
// Imports //
//---------//

var DataPoint = require('../../db/models/extensions/data-point')
    , Data = require('../../db/models/extensions/data')
    , Type = require('../../db/models/extensions/type')
    , MeasurementName = require('../../db/models/extensions/measurement-name')
    , Location = require('../../db/models/extensions/location')
    , DALDataPoint = require('../../db/models/dal/data-point')
    , DALData = require('../../db/models/dal/data')
    , DALSource = require('../../db/models/dal/source')
    , DALType = require('../../db/models/dal/type')
    , DALymd = require('../../db/models/dal/ymd')
    , DALMeasurementName = require('../../db/models/dal/measurement-name')
    , bFs = require('fs-bluebird')
    , nh = require('node-helpers')
    , bRequest = require('request-promise')
    , bPromise = require('bluebird')
    , moment = require('moment-timezone')
    , pconf = require('../../package.json');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions
    , log = new nh.LogProvider().getLogger();

bPromise.longStackTraces();
var CURRENT_SOURCE = 'forecast_io';

//-------------//
// Constructor //
//-------------//

function GatherFioData(aPgWrapper) {
    this.pgWrapperInst = aPgWrapper;
}


//-----------------------//
// Prototyped Extensions //
//-----------------------//

GatherFioData.prototype.bInit = function bInit() {
    var self = this;

    return bPromise.resolve([
            (new DALSource(self.pgWrapperInst)).getAllSources()
            , (new DALMeasurementName(self.pgWrapperInst)).getAllMeasurementNames()
            , (new DALType(self.pgWrapperInst)).getAllTypes()
            , (new DALymd(self.pgWrapperInst)).getYmdsFromDate(moment(0, 'H').subtract(1, 'day').format('YYYYMMDD'))
        ])
        .spread(function(resSources, resMeasurementNames, resTypes, resYmds) {
            self.lazySources = resSources;
            self.lazyMeasurementNames = resMeasurementNames;
            self.lazyTypes = resTypes;
            self.lazyYmds = resYmds;

            var date1 = moment().subtract(1, 'day').format('YYYYMMDD')
                , date2 = moment().add(5, 'days').format('YYYYMMDD');

            self.curSource = self.lazySources.mustFind(function(src) {
                return src.Name() === CURRENT_SOURCE;
            });

            self.dalDataInst = new DALData(self.pgWrapperInst);

            self.lazyForecastYmdValues = self.lazyYmds
                .filter(function(aYmd) {
                    var daysDiff = moment(aYmd.Value(), 'YYYYMMDD').diff(moment(0, "H"), 'days');
                    return daysDiff > 0 && daysDiff < 6;
                })
                .map(function(aYmd) {
                    return aYmd.Value();
                });

            return self.dalDataInst
                .getDataBetweenDatesFromSource(date1, date2, self.curSource);
        })
        .then(function(lazyData) {
            self.relevantData = lazyData;

            self.dalDataPointInst = new DALDataPoint(self.pgWrapperInst);

            return self;
        });
};

GatherFioData.prototype.downloadThenInsertData = function downloadThenInsertData(locationsArray, envInst) {
    var self = this;

    var bInserts = [];

    locationsArray.forEach(function(aLocation) {
        var forecastUrl = 'https://api.forecast.io/forecast/' + process.env.FORECAST_IO_API_KEY + '/' + aLocation.Latitude() + ',' + aLocation.Longitude() + '?units=ca';
        var actualUrl = 'https://api.forecast.io/forecast/' + process.env.FORECAST_IO_API_KEY + '/' + aLocation.Latitude() + ',' + aLocation.Longitude() + ',' + moment(0, 'H').subtract(1, 'day').format('X') + '?units=ca';

        var bForecastData
            , bActualData;

        if (envInst.isDev()) {
            bForecastData = bPromise.resolve(JSON.stringify(require('../../tests/services/gather-data/example/fio-forecast.json')));
            bActualData = bPromise.resolve(JSON.stringify(require('../../tests/services/gather-data/example/fio-actual.json')));
        } else {
            bForecastData = bRequest(forecastUrl);
            bActualData = bRequest(actualUrl);
        }

        // get the promises of their data
        bInserts.push(
            bPromise.all(sanitize5DayForecastData(bForecastData, aLocation, self))
            .catch(function(err) {
                bPromise.reject(err.stack);
            })
            .then(function(forecastDataPoints) {
                var res = forecastDataPoints.map(function(aDataPoint) {
                    return self.dalDataPointInst.insert(aDataPoint);
                });

                return bPromise.settle(res);
            }));

        // sanitize the promise data, then push the promise inserts into an array
        bInserts.push(
            bPromise.all(sanitizeActualData(bActualData, aLocation, self))
            .catch(function(err) {
                bPromise.reject(err.stack);
            })
            .then(function(actualDataPoints) {
                var res = actualDataPoints.map(function(aDataPoint) {
                    return self.dalDataPointInst.insert(aDataPoint);
                });

                return bPromise.settle(res);
            })
        );
    });

    // return the array of insert promises for logging
    return bPromise.settle(bInserts);
};


//---------//
// Helpers //
//---------//

function sanitize5DayForecastData(bForecastData, curLocation, gatherInst) {
    return bForecastData
        .then(function(forecastData) {
            forecastData = JSON.parse(forecastData);
            var bResult = [];
            var forecastDays = forecastData.daily.data;
            lazy(forecastDays)
                .filter(function(aForecastDay) {
                    return filterDaysForecasted(aForecastDay, gatherInst);
                })
                .each(function(aForecastDay) {
                    // for each day, push the sanitized data into the result
                    var bData = getForecastDataPointDataPromise(aForecastDay, curLocation, gatherInst);

                    for (var i = 0; i < 3; i++) {
                        bResult.push(getDataPointPromise(bData, aForecastDay, i, gatherInst));
                    }
                });

            return bResult;
        });
}

function filterDaysForecasted(aForecastDay, gatherInst) {
    var dayYmd = moment(aForecastDay.time, 'X').format('YYYYMMDD');
    return gatherInst.lazyForecastYmdValues.contains(dayYmd);
}

function getForecastDataPointDataPromise(aForecastDay, curLocation, gatherInst) {
    var forecastMoment = moment(aForecastDay.time, 'X');
    var curYmd = getYmd(forecastMoment, gatherInst);
    var curType = getType(forecastMoment, gatherInst);
    var curData = gatherInst.relevantData.find(function(aData) {
        return aData.Location().equals(curLocation)
            && aData.YMD().equals(curYmd)
            && aData.Type().equals(curType)
            && aData.Source().equals(gatherInst.curSource);
    });

    var bData;
    if (typeof curData === 'undefined') {
        bData = gatherInst.dalDataInst.insert(
            new Data()
            .Type(curType)
            .Source(gatherInst.curSource)
            .YMD(curYmd)
            .Location(curLocation)
        );
    } else {
        bData = bPromise.resolve(curData);
    }

    return bData;
}

function getYmd(aMoment, gatherInst) {
    var dayYmd = aMoment.format('YYYYMMDD');
    log.debug("forecast-io's dayYmd: " + dayYmd);

    return gatherInst.lazyYmds.mustFind(function(aYmd) {
        return aYmd.Value() === dayYmd;
    });
}

function getType(forecastMoment, gatherInst) {
    var dayType;
    switch (forecastMoment.diff(moment(0, "H"), 'days')) {
        case -1:
            dayType = Type.NAMES.ACTUAL;
            break;
        case 1:
            dayType = Type.NAMES.FORECAST_DAY_1;
            break;
        case 2:
            dayType = Type.NAMES.FORECAST_DAY_2;
            break;
        case 3:
            dayType = Type.NAMES.FORECAST_DAY_3;
            break;
        case 4:
            dayType = Type.NAMES.FORECAST_DAY_4;
            break;
        case 5:
            dayType = Type.NAMES.FORECAST_DAY_5;
            break;
    }

    return gatherInst.lazyTypes.mustFind(function(aType) {
        return aType.Name() === dayType;
    });
}

function getDataPointPromise(bData, aDay, i, gatherInst) {
    return bData
        .then(function(resData) {
            var tmp = getValueAndMeasurementName(aDay, i, resData.Type(), gatherInst);

            var resDataPoint = new DataPoint()
                .Data(resData)
                .MeasurementName(tmp.curMeasurementName)
                .Value(tmp.curValue);

            return resDataPoint;
        });
}

function getValueAndMeasurementName(aDay, i, aType, gatherInst) {
    var res = {};

    switch (i) {
        case 0:
            res.curMeasurementName = gatherInst.lazyMeasurementNames
                .mustFind(function(mn) {
                    return mn.Value() === MeasurementName.VALUES.HIGH_TEMP;
                });
            res.curValue = aDay.temperatureMax;
            break;
        case 1:
            res.curMeasurementName = gatherInst.lazyMeasurementNames
                .mustFind(function(mn) {
                    return mn.Value() === MeasurementName.VALUES.LOW_TEMP;
                });
            res.curValue = aDay.temperatureMin;
            break;
        case 2:
            res.curMeasurementName = gatherInst.lazyMeasurementNames
                .mustFind(function(mn) {
                    return mn.Value() === MeasurementName.VALUES.MEAN_WIND_SPEED;
                });
            res.curValue = aDay.windSpeed;
            break;
    }

    return res;
}

function sanitizeActualData(bActualData, curLocation, gatherInst) {
    return bActualData
        .then(function(actualData) {
            actualData = JSON.parse(actualData);
            var bResult = [];
            var actualDay = actualData.daily.data[0];
            // for each day, push the sanitized data into the result
            var bData = getActualDataPointDataPromise(actualDay, curLocation, gatherInst);

            for (var i = 0; i < 3; i++) {
                bResult.push(getDataPointPromise(bData, actualDay, i, gatherInst));
            }

            return bResult;
        });
}

function getActualDataPointDataPromise(actualDay, curLocation, gatherInst) {
    var actualMoment = moment(actualDay.time, 'X').tz(curLocation.TZ()).hour(0);
    var curYmd = getYmd(actualMoment, gatherInst);
    var curType = getType(actualMoment, gatherInst);
    var curData = gatherInst.relevantData.find(function(aData) {
        return aData.Location().equals(curLocation)
            && aData.YMD().equals(curYmd)
            && aData.Type().equals(curType)
            && aData.Source().equals(gatherInst.curSource);
    });

    var bData;
    if (typeof curData === 'undefined') {
        bData = gatherInst.dalDataInst.insert(
            new Data()
            .Type(curType)
            .Source(gatherInst.curSource)
            .YMD(curYmd)
            .Location(curLocation)
        );
    } else {
        bData = bPromise.resolve(curData);
    }

    return bData;
}


//---------//
// Exports //
//---------//

module.exports = GatherFioData;
module.exports._sanitize5DayForecastData = sanitize5DayForecastData;
module.exports._filterDaysForecasted = filterDaysForecasted;
module.exports._getForecastDataPointDataPromise = getForecastDataPointDataPromise;
module.exports._getYmd = getYmd;
module.exports._getType = getType;
module.exports._getDataPointPromise = getDataPointPromise;
module.exports._getValueAndMeasurementName = getValueAndMeasurementName;
module.exports._sanitizeActualData = sanitizeActualData;
module.exports._getActualDataPointDataPromise = getActualDataPointDataPromise;
