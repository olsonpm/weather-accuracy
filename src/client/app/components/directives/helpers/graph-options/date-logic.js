"use strict";


//---------//
// Imports //
//---------//

var moment = require('moment')
    , nh = require('node-helpers')
    , Pikaday = require('pikaday');


//------//
// Init //
//------//

var bRequest = new nh.BRequest()
    .BaseUrl(window.location.origin)
    .IsJSON(true);

var pickerFrom
    , pickerTo;


//-------------//
// Constructor //
//-------------//

function DateLogic(state, handles, constants) {
    this.state = state;
    this.constants = constants;
    this.handles = handles;

    pickerFrom = handles.pickerFrom = new Pikaday({
        field: handles.pickerFrom[0]
        , onSelect: dateFromSelect
    });
    pickerTo = handles.pickerTo = new Pikaday({
        field: handles.pickerTo[0]
        , onSelect: dateToSelect
    });
}


//--------------------//
// Prototyped Methods //
//--------------------//

DateLogic.prototype.initializeDates = function initializeDates() {
    var state = this.state
        , log = this.handles.log;

    return bRequest.get(this.constants.API.YMDS)
        .then(function(res) {
            state.minMoment = moment(res.min.Value, 'YYYYMMDD');
            state.maxMoment = moment(res.max.Value, 'YYYYMMDD');

            pickerFrom.setDate(state.minMoment.toDate(), true);
            pickerFrom.setMinDate(state.minMoment.toDate());
            pickerFrom.setMaxDate(moment(state.maxMoment).subtract(1, 'day').toDate());

            pickerTo.setDate(moment(state.minMoment).add(13, 'days').toDate(), true);
            pickerTo.setMinDate(moment(state.minMoment).add(1, 'day').toDate());
            pickerTo.setMaxDate(state.maxMoment.toDate());
        })
        .finally(function() {
            log.debug('date range request completed');
        });
};

function dateFromSelect(date) {
    var fromMoment = moment(date);
    var toMoment = moment(pickerTo.getDate());

    if (fromMoment.isAfter(toMoment)) {
        pickerTo.setDate(moment(fromMoment).add(1, 'day').toDate());
    }
};

function dateToSelect(date) {
    var fromMoment = moment(pickerFrom.getDate());
    var toMoment = moment(date);

    if (toMoment.isBefore(fromMoment)) {
        pickerFrom.setDate(moment(toMoment).subtract(1, 'day').toDate());
    }
};


//---------//
// Exports //
//---------//

module.exports = DateLogic;
