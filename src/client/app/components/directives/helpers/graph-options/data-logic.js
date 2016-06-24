"use strict";


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , $ = require('jquery')
    , bPromise = require('bluebird')
    , moment = require('moment')
    , TweenLite = require('TweenLite')
    , DataPoint = require('../../../../../../../db/models/extensions/data-point')
    , Location = require('../../../../../../../db/models/extensions/location')
    , Type = require('../../../../../../../db/models/extensions/type')
    , MeasurementName = require('../../../../../../../db/models/extensions/measurement-name')
    , Source = require('../../../../../../../db/models/extensions/source');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions
    , gsapd = nh.gsapDefaults(window);
var bRequest = new nh.BRequest()
    .BaseUrl(window.location.origin)
    .IsJSON(true);


//-------------//
// Constructor //
//-------------//

function DataLogic(state, handles, constants, scope) {
    this.state = state;
    this.handles = handles;
    this.constants = constants;
    this.scope = scope;
}


//--------------------//
// Prototyped Methods //
//--------------------//

DataLogic.prototype.updateGraphData = function updateGraphData() {
    var self = this;
    var log = self.handles.log
        , pickerFrom = self.handles.pickerFrom
        , pickerTo = self.handles.pickerTo
        , interactiveGraphCtrl = self.handles.interactiveGraphCtrl
        , state = self.state
        , API = self.constants.API;

    // validate input
    var daysDiff = Math.abs(pickerFrom.getMoment().diff(pickerTo.getMoment(), 'days'));
    if (daysDiff > 31) {
        self.scope.$applyAsync(function() {
            var from = pickerFrom.getMoment().format('YYYY-MM-DD')
                , to = pickerTo.getMoment().format('YYYY-MM-DD');

            self.scope.errorMsg = 'The chosen dates: ' + from + ' to ' + to + ' are more than 31 days apart.';
            $('#datepicker-from').addClass('error');
            $('#datepicker-to').addClass('error');
        });
        return;
    } else {
        // remove any previous errors
        $('#datepicker-from').removeClass('error');
        $('#datepicker-to').removeClass('error');

        // start loading gif
        $('graph-options input[type="submit"]').after('<img src="../img/loading.gif" class="status loading">');
    }

    // input is valid
    log.debug('updating graph data');
    var fromMoment = moment(pickerFrom.getDate());
    var fromDate = fromMoment.format('YYYYMMDD');
    var toMoment = moment(pickerTo.getDate());
    var toDate = toMoment.format('YYYYMMDD');
    var fetchNewGraphData = false
        , dateChanged = false
        , locationsChanged = false
        , typeChanged = false
        , measurementNameChanged = false;

    var currentLocationID = $('#choose-location').val();
    var currentTypeID = $('#choose-type').val();
    var currentMeasurementNameID = $('#choose-measurement-name').val();

    if (!(state.lastSubmittedFromDate === fromDate && state.lastSubmittedToDate === toDate)) {
        if (state.lastSubmittedFromDate === null
            || state.lastSubmittedToDate === null
            || moment(fromDate, 'YYYYMMDD').isBefore(moment(state.lastSubmittedFromDate, 'YYYYMMDD'))
            || moment(toDate, 'YYYYMMDD').isAfter(moment(state.lastSubmittedToDate, 'YYYYMMDD'))) {

            fetchNewGraphData = true;
        }
        state.lastSubmittedFromDate = fromDate;
        state.lastSubmittedToDate = toDate;
        dateChanged = true;
    }
    if (!lazy.Sequence.equals(state.lastSubmittedLocationIds, currentLocationID)) {
        locationsChanged = true;
        state.lastSubmittedLocationIds = currentLocationID;
    }
    if (state.lastSubmittedTypeID !== currentTypeID) {
        typeChanged = true;
        state.lastSubmittedTypeID = currentTypeID;
    }
    if (state.lastSubmittedMeasurementNameID !== currentMeasurementNameID) {
        measurementNameChanged = true;
        state.lastSubmittedMeasurementNameID = currentMeasurementNameID;
    }

    var bLazyDataPoints;

    if (fetchNewGraphData) {
        log.debug('fetching new graph data');

        bLazyDataPoints = bRequest.get(API.GRAPH_DATA + '?dateFrom=' + fromDate + '&dateTo=' + toDate)
            .then(function(res) {
                var resArray = [];
                return lazy(res)
                    .async()
                    .setNumElementsPerAsync(40)
                    .each(function(jsonDataPoint) {
                        if (jsonDataPoint) {
                            resArray.push(new DataPoint(jsonDataPoint));
                        }
                    })
                    .then(function() {
                        state.lazyDataPoints = lazy(resArray).memoize();
                        return state.lazyDataPoints;
                    });
            });
    } else {
        bLazyDataPoints = bPromise.resolve(state.lazyDataPoints);
    }

    bLazyDataPoints
        .then(function(res) {
            var graphData = {
                aggregate: []
                , tmpAggregate: {}
            };
            state.lazySources.each(function(aSource) {
                graphData[aSource.SourceID()] = [];
                graphData.tmpAggregate[aSource.SourceID()] = 0;
            });

            if (dateChanged || fetchNewGraphData) {
                log.debug('date has changed');
            }
            if (locationsChanged || fetchNewGraphData) {
                log.debug('locations have changed');
            }
            if (typeChanged) {
                log.debug('type has changed');
            }
            if (measurementNameChanged || fetchNewGraphData) {
                log.debug('measurement name has changed');
            }
            if (!dateChanged && !locationsChanged && !typeChanged && !measurementNameChanged) {
                log.debug('nothing has changed');
            }

            var filteredRes = [];

            var filterAsyncHandle = res.async()
                .setNumElementsPerAsync(40)
                .each(function byDateLocationTypeAndMeasurementName(aDataPoint) {
                    var dpMoment = aDataPoint.Data().YMD().getMoment();
                    if ((dpMoment.isSame(fromMoment) || dpMoment.isAfter(fromMoment))
                        && (dpMoment.isSame(toMoment) || dpMoment.isBefore(toMoment))
                        && aDataPoint.Data().Location().LocationID() === currentLocationID
                        && (
                            aDataPoint.Data().Type().TypeID() === currentTypeID
                            || aDataPoint.Data().Type().Name() === Type.NAMES.ACTUAL
                        ) && aDataPoint.MeasurementName().MeasurementNameID() === currentMeasurementNameID) {
                        filteredRes.push(aDataPoint);
                    }
                });

            filterAsyncHandle.onComplete(function() {
                filteredRes = lazy(filteredRes).memoize();
                return bPromise.resolve([
                        getForecastedDataPoints(filteredRes, currentTypeID)
                        , getActualDataPoints(filteredRes)
                        , state
                        , graphData
                    ])
                    .spread(function(forecastedArray, actualArray, state, graphData) {
                        graphData = setGraphData(forecastedArray, actualArray, state, graphData);

                        var currentMeasurementName = state.lazyMeasurementNames.find(function(aMeasurementName) {
                            return aMeasurementName.MeasurementNameID() === currentMeasurementNameID;
                        });
                        var currentType = state.lazyTypes.find(function(aType) {
                            return aType.TypeID() === currentTypeID;
                        });
                        var moments = {
                            from: fromMoment
                            , to: toMoment
                        };

                        // stop loading status, start finished status.  Not dealing with errors since this is just a side project
                        var status = $('graph-options .status.loading')
                            .removeClass('loading')
                            .addClass('finished')
                            .attr('src', '../img/check_mark.png');

                        TweenLite.to(status, 5, {
                            opacity: '0'
                            , delay: 1.2
                            , ease: gsapd.EASE
                            , onComplete: function() {
                                status.remove();
                            }
                        });

                        return bPromise.resolve([
                            graphData
                            , state
                            , currentMeasurementName
                            , currentType
                            , moments
                        ]);
                    })
                    .spread(function(graphData, state, currentMeasurementName, currentType, moments) {
                        interactiveGraphCtrl.updateGraphData(graphData, state.lazySources.toArray(), currentMeasurementName, currentType, moments);
                    });
            });
        })
        .finally(function() {
            log.debug('graph-data request completed');
        });
};

DataLogic.prototype.initializeLocations = function initializeLocations() {
    var API = this.constants.API
        , state = this.state
        , log = this.handles.log;

    return bRequest.get(API.LOCATIONS)
        .then(function(res) {
            state.lazyLocations = lazy(res.map(function(jsonLocation) {
                    return new Location(jsonLocation);
                }))
                .sort(function(left, right) {
                    return left.LocationID() - right.LocationID();
                });

            state.lazyLocations.each(function(aLocation, i) {
                var optionText = ''
                    + '<option ' + ((i === 0) ? 'selected' : '') + ' value="' + aLocation.LocationID() + '">'
                    + aLocation.Name()
                    + '</option>';

                $('#choose-location').append(optionText);
            });
        })
        .finally(function() {
            log.debug('locations request completed');
        });
};

DataLogic.prototype.initializeTypes = function initializeTypes() {
    var API = this.constants.API
        , state = this.state
        , log = this.handles.log;

    return bRequest.get(API.TYPES)
        .then(function(res) {
            var selectType = $('#choose-type');
            state.lazyTypes = lazy(res.map(function(jsonType) {
                    return new Type(jsonType);
                }))
                .sort(function(left, right) {
                    return left.TypeID() - right.TypeID();
                });

            state.lazyTypes.each(function(aType, i) {
                var optionText = ''
                    + '<option ' + ((i === 0) ? 'selected' : '') + ' value="' + aType.TypeID() + '">'
                    + aType.Name().replace(/_/g, ' ')
                    + '</option>';

                selectType.append(optionText);
            });
        })
        .finally(function() {
            log.debug('types request completed');
        });
};

DataLogic.prototype.initializeMeasurementNames = function initializeMeasurementNames() {
    var API = this.constants.API
        , state = this.state
        , log = this.handles.log;

    return bRequest.get(API.MEASUREMENT_NAMES)
        .then(function(res) {
            var selectMeasurementName = $('#choose-measurement-name');
            state.lazyMeasurementNames = lazy(res.map(function(jsonMeasurementName) {
                    return new MeasurementName(jsonMeasurementName);
                }))
                .sort(function(left, right) {
                    return left.MeasurementNameID() - right.MeasurementNameID();
                });

            state.lazyMeasurementNames.each(function(aMeasurementName, i) {
                var optionText = ''
                    + '<option ' + ((i === 0) ? 'selected' : '') + ' data-name="' + aMeasurementName.Value() + '" value="' + aMeasurementName.MeasurementNameID() + '">'
                    + aMeasurementName.NiceValue()
                    + '</option>';

                selectMeasurementName.append(optionText);
            });
        })
        .finally(function() {
            log.debug('measurement names request completed');
        });
};

DataLogic.prototype.initializeSources = function initializeSources() {
    var API = this.constants.API
        , state = this.state
        , log = this.handles.log;

    return bRequest.get(API.SOURCES)
        .then(function(res) {
            state.lazySources = lazy(res.map(function(jsonSource) {
                    return new Source(jsonSource);
                }))
                .sort(function(left, right) {
                    return left.SourceID() - right.SourceID();
                });
        })
        .finally(function() {
            log.debug('sources request completed');
        });
};


//---------//
// Helpers //
//---------//

function getForecastedDataPoints(lazyDataPoints, currentTypeID) {
    return lazyDataPoints
        .filter(function specificLocation(aDataPoint) {
            return currentTypeID === aDataPoint.Data().Type().TypeID();
        })
        .sort(function(left, right) {
            return left.Data().YMD().Value() - right.Data().YMD().Value();
        })
        .toArray();
}

function getActualDataPoints(lazyDataPoints) {
    return lazyDataPoints
        .filter(function specificLocation(aDataPoint) {
            return aDataPoint.Data().Type().Name() === Type.NAMES.ACTUAL;
        })
        .sort(function(left, right) {
            return left.Data().YMD().Value() - right.Data().YMD().Value();
        })
        .toArray();
}

function setGraphData(forecastedArray, actualArray, state, graphData) {
    // locationForecasted and locationActual should have matching index per ymd values
    forecastedArray.forEach(function(aDataPoint, i) {
        graphData[aDataPoint.Data().Source().SourceID()].push({
            ymd: aDataPoint.Data().YMD().Value()
            , forecasted: aDataPoint.Value()
            , actual: actualArray[i].Value()
            , source: aDataPoint.Data().Source().SourceID()
            , location: aDataPoint.Data().Location().Name()
        });
        var totalForecastedDifference = +graphData.tmpAggregate[aDataPoint.Data().Source().SourceID()];
        graphData.tmpAggregate[aDataPoint.Data().Source().SourceID()] = totalForecastedDifference + Math.abs(actualArray[i].Value() - aDataPoint.Value());
    });

    // i is the 1-indexed location within the array for use with the x-axis
    state.lazySources.each(function(aSource, i) {
        graphData.aggregate.push({
            i: i + 1
            , sourceID: aSource.SourceID()
            , degrees: graphData.tmpAggregate[aSource.SourceID()]
        });
    });
    graphData.tmpAggregate = undefined;

    return graphData;
}


//---------//
// Exports //
//---------//

module.exports = DataLogic;
