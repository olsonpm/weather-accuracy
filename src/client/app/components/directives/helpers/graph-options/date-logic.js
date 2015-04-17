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


//-------------//
// Constructor //
//-------------//

function DateLogic(state, handles, constants) {
    var self = this;
    self.state = state;
    self.constants = constants;
    self.handles = handles;

    self.pickerFrom = handles.pickerFrom = new Pikaday({
        field: handles.pickerFrom[0]
        , onSelect: dateFromSelect
    });
    self.pickerTo = handles.pickerTo = new Pikaday({
        field: handles.pickerTo[0]
        , onSelect: dateToSelect
    });

    function dateFromSelect(date) {
        var fromMoment = moment(date);
        var toMoment = moment(self.pickerTo.getDate());

        if (fromMoment.isAfter(toMoment)) {
            self.pickerTo.setDate(moment(fromMoment).add(1, 'day').toDate());
        }
    }

    function dateToSelect(date) {
        var fromMoment = moment(self.pickerFrom.getDate());
        var toMoment = moment(date);

        if (toMoment.isBefore(fromMoment)) {
            self.pickerFrom.setDate(moment(toMoment).subtract(1, 'day').toDate());
        }
    }
}


//--------------------//
// Prototyped Methods //
//--------------------//

DateLogic.prototype.initializeDates = function initializeDates() {
    var self = this;
    var state = self.state
        , log = self.handles.log;

    return bRequest.get(self.constants.API.YMDS)
        .then(function(res) {
            state.minMoment = moment(res.min.Value, 'YYYYMMDD');
            state.maxMoment = moment(res.max.Value, 'YYYYMMDD');

            self.pickerFrom.setDate(state.minMoment.toDate(), true);
            self.pickerFrom.setMinDate(state.minMoment.toDate());
            self.pickerFrom.setMaxDate(moment(state.maxMoment).subtract(1, 'day').toDate());

            self.pickerTo.setDate(moment(state.minMoment).add(13, 'days').toDate(), true);
            self.pickerTo.setMinDate(moment(state.minMoment).add(1, 'day').toDate());
            self.pickerTo.setMaxDate(state.maxMoment.toDate());
        })
        .finally(function() {
            log.debug('date range request completed');
        });
};


//---------//
// Exports //
//---------//

module.exports = DateLogic;
