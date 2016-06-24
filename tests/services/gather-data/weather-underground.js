'use strict';
/* --execute=mocha-- */

//---------//
// Imports //
//---------//

var GatherWundergroundData = require('../../../services/gather-data/weather-underground')
    , MeasurementName = require('../../../db/models/extensions/measurement-name')
    , Location = require('../../../db/models/extensions/location')
    , Data = require('../../../db/models/extensions/data')
    , Type = require('../../../db/models/extensions/type')
    , Source = require('../../../db/models/extensions/source')
    , Unit = require('../../../db/models/extensions/unit')
    , DALData = require('../../../db/models/dal/data')
    , DALDataPoint = require('../../../db/models/dal/data-point')
    , DALLocation = require('../../../db/models/dal/location')
    , testForecast = require('./example/wunderground-forecast')
    , testActual = require('./example/wunderground-actual')
    , chai = require('chai')
    , nh = require('node-helpers')
    , bPromise = require('bluebird')
    , moment = require('moment')
    , confs = require('../../../utils/pg-confs');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions
    , Utils = nh.utils
    , assert = chai.assert;

bPromise.longStackTraces();
chai.config.includeStack = true;
var envInst = new nh.Environment({
    hardCoded: 'dev'
});


//------//
// Main //
//------//

suite("gather_wunderground_data", function gather_wunderground_data() {
    var pgWrapInst = confs[envInst.curEnv()].GeneratePGWrapper();
    var dalDataPointInst = new DALDataPoint(pgWrapInst);
    var dalDataInst = new DALData(pgWrapInst);
    var dalLocationInst = new DALLocation(pgWrapInst);
    var tomorrowMoment = moment(0, 'H').add(1, 'day');
    var tomorrowForecast = lazy(testForecast.forecast.simpleforecast.forecastday)
        .mustFind(function(aForecastDay) {
            var tmpMoment = moment(aForecastDay.date.year + '-' + aForecastDay.date.month + '-' + aForecastDay.date.day, 'YYYY-M-D');
            return tmpMoment.format('YYYYMMDD') === tomorrowMoment.format('YYYYMMDD');
        });
    var actualData = testActual.history.dailysummary[0];
    var actualMoment = moment(0, 'H').subtract(1, 'day');

    var gatherInst
        , richmond
        , allLocations;

    setup(function() {
        return bPromise.resolve([
                new GatherWundergroundData(pgWrapInst).bInit()
                , dalLocationInst.getAllLocations()
            ])
            .spread(function(res, lazyLocations) {
                allLocations = lazyLocations;
                gatherInst = res;
                richmond = allLocations.find(function(aLocation) {
                    return aLocation.Name() === Location.NAMES.RICHMOND;
                });
            });
    });

    test("download_then_insert_data", function download_then_insert_data() {
        return gatherInst.downloadThenInsertData(allLocations.toArray(), envInst)
            .then(function(res) {
                var rejected = lazy(res).find(function(p) {
                    return p.isRejected();
                });
                if (rejected) {
                    throw new Error("rejected: " + rejected.reason());
                }

                var date1 = moment().subtract(1, 'day').format('YYYYMMDD');
                var date2 = moment().add(5, 'days').format('YYYYMMDD');
                return [
                    dalDataPointInst.getDataPointsBetweenDates(date1, date2)
                    , dalDataInst.getDataBetweenDates(date1, date2)
                ];
            })
            .spread(function(lazyDataPoints, lazyData) {
                assert.strictEqual(lazyDataPoints.length(), 54);
                assert.strictEqual(lazyData.length(), 18);
            })
            .finally(function() {
                return pgWrapInst.RunQuery('delete from weather_data_point where weather_data_point_id > 972');
            });
    });

    test("sanitize_5_day_forecast", function sanitize_5_day_forecast() {
        return bPromise.all(GatherWundergroundData._sanitize5DayForecastData(bPromise.resolve(JSON.stringify(testForecast)), richmond, gatherInst))
            .then(function(forecastArray) {
                assert.strictEqual(forecastArray.length, 15);
                for (var i = 0; i < 15; i++) {
                    var expectedType = Type.NAMES['FORECAST_DAY_' + (Math.floor(i / 3) + 1)];
                    var expectedMeasurementNameVal
                        , expectedUnitName;
                    switch (i % 3) {
                        case 0:
                            expectedMeasurementNameVal = MeasurementName.VALUES.HIGH_TEMP;
                            expectedUnitName = Unit.NAMES.CELSIUS;
                            break;
                        case 1:
                            expectedMeasurementNameVal = MeasurementName.VALUES.LOW_TEMP;
                            expectedUnitName = Unit.NAMES.CELSIUS;
                            break;
                        case 2:
                            expectedMeasurementNameVal = MeasurementName.VALUES.MEAN_WIND_SPEED;
                            expectedUnitName = Unit.NAMES.KPH;
                            break;
                    }

                    var tmpData = forecastArray[i].Data();
                    assert.strictEqual(tmpData.Type().Name(), expectedType);
                    assert.strictEqual(tmpData.Source().Name(), Source.NAMES.WUNDERGROUND);
                    assert.strictEqual(tmpData.YMD().Value(), moment().add(Math.floor(i / 3) + 1, 'days').format('YYYYMMDD'));
                    assert.strictEqual(tmpData.Location().Name(), richmond.Name());
                    assert.strictEqual(forecastArray[i].MeasurementName().Value(), expectedMeasurementNameVal);
                    assert.strictEqual(forecastArray[i].MeasurementName().Unit().Name(), expectedUnitName);
                }
            });
    });

    test("get_value_and_measurement_name", function get_value_and_measurement_name() {
        var curType = gatherInst.lazyTypes.mustFind(function(aType) {
            return aType.Name() === Type.NAMES.FORECAST_DAY_1;
        });
        var res = GatherWundergroundData._getValueAndMeasurementName(tomorrowForecast, 0, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.HIGH_TEMP);
        assert.isTrue(Utils.isNumeric(res.curValue));
        res = GatherWundergroundData._getValueAndMeasurementName(tomorrowForecast, 1, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.LOW_TEMP);
        assert.isTrue(Utils.isNumeric(res.curValue));
        res = GatherWundergroundData._getValueAndMeasurementName(tomorrowForecast, 2, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.MEAN_WIND_SPEED);
        assert.isTrue(Utils.isNumeric(res.curValue));

        curType = gatherInst.lazyTypes.mustFind(function(aType) {
            return aType.Name() === Type.NAMES.ACTUAL;
        });
        res = GatherWundergroundData._getValueAndMeasurementName(actualData, 0, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.HIGH_TEMP);
        assert.isTrue(Utils.isNumeric(res.curValue));
        res = GatherWundergroundData._getValueAndMeasurementName(actualData, 1, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.LOW_TEMP);
        assert.isTrue(Utils.isNumeric(res.curValue));
        res = GatherWundergroundData._getValueAndMeasurementName(actualData, 2, curType, gatherInst);
        assert.strictEqual(res.curMeasurementName.Value(), MeasurementName.VALUES.MEAN_WIND_SPEED);
        assert.isTrue(Utils.isNumeric(res.curValue));
    });

    test("get_data_point_promise", function get_data_point_promise() {
        var forecastType = gatherInst.lazyTypes.find(function(aType) {
            return aType.Name() === Type.NAMES.FORECAST_DAY_1;
        });
        var actualType = gatherInst.lazyTypes.find(function(aType) {
            return aType.Name() === Type.NAMES.ACTUAL;
        });
        var bTestForecastData = bPromise.resolve(new Data().DataID('1').Type(forecastType));
        var bTestActualData = bPromise.resolve(new Data().DataID('1').Type(actualType));
        return bPromise.join(
            GatherWundergroundData._getDataPointPromise(bTestForecastData, tomorrowForecast, 0, gatherInst)
            , GatherWundergroundData._getDataPointPromise(bTestActualData, actualData, 0, gatherInst)
            , assertDataPoints
        );

        function assertDataPoints(forecastDataPoint, actualDataPoint) {
            assert.isTrue(forecastDataPoint.Data().DataID() === '1');
            assert.strictEqual(forecastDataPoint.MeasurementName().Value(), MeasurementName.VALUES.HIGH_TEMP);
            assert.isTrue(Utils.isNumeric(forecastDataPoint.Value()));

            assert.isTrue(actualDataPoint.Data().DataID() === '1');
            assert.strictEqual(actualDataPoint.MeasurementName().Value(), MeasurementName.VALUES.HIGH_TEMP);
            assert.isTrue(Utils.isNumeric(actualDataPoint.Value()));
        }
    });

    test("get_type", function get_forecast_type() {
        var testType = GatherWundergroundData._getType(tomorrowMoment, gatherInst);
        assert.strictEqual(testType.Name(), Type.NAMES.FORECAST_DAY_1);

        testType = GatherWundergroundData._getType(actualMoment, gatherInst);
        assert.strictEqual(testType.Name(), Type.NAMES.ACTUAL);
    });

    test("get_ymd", function get_ymd() {
        var testYmd = GatherWundergroundData._getYmd(tomorrowMoment, gatherInst);
        assert.strictEqual(testYmd.Value(), tomorrowMoment.format('YYYYMMDD'));

        testYmd = GatherWundergroundData._getYmd(actualMoment, gatherInst);
        assert.strictEqual(testYmd.Value(), actualMoment.format('YYYYMMDD'));
    });

    test("get_forecast_data_point_data_promise", function get_forecast_data_point_data_promise() {
        return GatherWundergroundData._getForecastDataPointDataPromise(tomorrowForecast, richmond, gatherInst)
            .then(function(aData) {
                assert.strictEqual(aData.Location().Name(), Location.NAMES.RICHMOND);
                assert.strictEqual(aData.YMD().Value(), tomorrowMoment.format('YYYYMMDD'));
                assert.strictEqual(aData.Source().Name(), Source.NAMES.WUNDERGROUND);
                assert.strictEqual(aData.Type().Name(), Type.NAMES.FORECAST_DAY_1);
            })
            .finally(function() {
                return pgWrapInst.RunQuery('delete from weather_data where weather_data_id > 324');
            });
    });

    test("filter_days_forecasted", function filter_days_forecasted() {
        var filteredForecastDays = lazy(testForecast.forecast.simpleforecast.forecastday)
            .filter(function(aForecastDay) {
                return GatherWundergroundData._filterDaysForecasted(aForecastDay, gatherInst);
            })
            .sort(function(left, right) {
                var leftMoment = moment(left.date.year + '-' + left.date.month + '-' + left.date.day, 'YYYY-M-D');
                var rightMoment = moment(right.date.year + '-' + right.date.month + '-' + right.date.day, 'YYYY-M-D');
                return leftMoment.format('YYYYMMDD').localeCompare(rightMoment.format('YYYYMMDD'));
            })
            .toArray();

        var tmpFDay
            , tmpMoment;

        assert.strictEqual(filteredForecastDays.length, 5);

        for (var i = 0; i < 5; i++) {
            tmpFDay = filteredForecastDays[i];
            tmpMoment = moment(tmpFDay.date.year + '-' + tmpFDay.date.month + '-' + tmpFDay.date.day, 'YYYY-M-D');
            assert.strictEqual(tmpMoment.format('YYYYMMDD'), moment().add(1 + i, 'days').format('YYYYMMDD'));
        }
    });

    test("sanitize_actual_data", function sanitize_actual_data() {
        return bPromise.all(GatherWundergroundData._sanitizeActualData(bPromise.resolve(JSON.stringify(testActual)), richmond, gatherInst))
            .then(function(actualDataArray) {
                assert.strictEqual(actualDataArray.length, 3);
                for (var i = 0; i < 3; i++) {
                    var expectedType = Type.NAMES.ACTUAL;
                    var expectedMeasurementNameVal
                        , expectedUnitName;
                    switch (i) {
                        case 0:
                            expectedMeasurementNameVal = MeasurementName.VALUES.HIGH_TEMP;
                            expectedUnitName = Unit.NAMES.CELSIUS;
                            break;
                        case 1:
                            expectedMeasurementNameVal = MeasurementName.VALUES.LOW_TEMP;
                            expectedUnitName = Unit.NAMES.CELSIUS;
                            break;
                        case 2:
                            expectedMeasurementNameVal = MeasurementName.VALUES.MEAN_WIND_SPEED;
                            expectedUnitName = Unit.NAMES.KPH;
                            break;
                    }

                    var tmpData = actualDataArray[i].Data();
                    assert.strictEqual(tmpData.Type().Name(), expectedType);
                    assert.strictEqual(tmpData.Source().Name(), Source.NAMES.WUNDERGROUND);
                    assert.strictEqual(tmpData.YMD().Value(), moment().subtract(1, 'day').format('YYYYMMDD'));
                    assert.strictEqual(tmpData.Location().Name(), richmond.Name());
                    assert.strictEqual(actualDataArray[i].MeasurementName().Value(), expectedMeasurementNameVal);
                    assert.strictEqual(actualDataArray[i].MeasurementName().Unit().Name(), expectedUnitName);
                }
            });
    });

    test("get_actual_data_point_data_promise", function get_actual_data_point_data_promise() {
        return GatherWundergroundData._getActualDataPointDataPromise(actualData, richmond, gatherInst)
            .then(function(aData) {
                assert.strictEqual(aData.Location().Name(), Location.NAMES.RICHMOND);
                assert.strictEqual(aData.YMD().Value(), actualMoment.format('YYYYMMDD'));
                assert.strictEqual(aData.Source().Name(), Source.NAMES.WUNDERGROUND);
                assert.strictEqual(aData.Type().Name(), Type.NAMES.ACTUAL);
            })
            .catch(function(err) {
                throw err;
            })
            .finally(function() {
                return pgWrapInst.RunQuery('delete from weather_data where weather_data_id > 324');
            });
    });
});
