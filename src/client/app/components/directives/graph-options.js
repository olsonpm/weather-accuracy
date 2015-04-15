"use strict";


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , bPromise = require('bluebird')
    , DateLogic = require('./helpers/graph-options/date-logic')
    , UILogic = require('./helpers/graph-options/ui-logic')
    , DataLogic = require('./helpers/graph-options/data-logic');


//------//
// Init //
//------//

require('gsapCssPlugin'); // initializes the gsap css plugin
var envInst = new nh.Environment();

var API = {
    GRAPH_DATA: "api/graph-data"
    , LOCATIONS: "api/locations"
    , TYPES: "api/types"
    , YMDS: "api/ymd-range"
    , MEASUREMENT_NAMES: "api/measurement-names"
    , SOURCES: "api/sources"
};


//------//
// Main //
//------//

module.exports = function(app, log) {
    app.directive('graphOptions', function() {
        var linkFn = function(scope, element, attrs, interactiveGraphCtrl) {
            var tmpDialog = element.find('.dialog');

            // these two handles are modified in the UILogic constructor.  If the pikaday
            //   api were better (by allowing settings to be modified after construction)
            //   then this small hack wouldn't be necessary.
            var tmpPickerFrom = tmpDialog.find('#datepicker-from');
            var tmpPickerTo = tmpDialog.find('#datepicker-to');

            var state = {
                minMoment: null
                , maxMoment: null
                , lastSubmittedFromDate: null
                , lastSubmittedToDate: null
                , lastSubmittedLocationIds: null
                , lastSubmittedTypeID: null
                , lastSubmittedMeasurementNameID: null
                , lazyDataPoints: null
                , lazyLocations: null
                , lazyTypes: null
                , lazyMeasurementNames: null
                , lazySources: null
            };
            var handles = {
                dialog: tmpDialog
                , pickerFrom: tmpPickerFrom
                , pickerTo: tmpPickerTo
                , log: log
                , interactiveGraphCtrl: interactiveGraphCtrl
            };
            var constants = {
                API: API
            };

            // instantiate helpers
            var dateLogicInst = new DateLogic(state, handles, constants);
            var uiLogicInst = new UILogic(state, handles, constants);
            var dataLogicInst = new DataLogic(state, handles, constants);

            // run any initialization methods
            uiLogicInst.initiateTitleClick();

            // begin initializing ajax calls - possibly should belong in the interactive-graph directive
            bPromise.join(
                dataLogicInst
                , uiLogicInst
                , dataLogicInst.initializeLocations()
                , dataLogicInst.initializeTypes()
                , dataLogicInst.initializeMeasurementNames()
                , dataLogicInst.initializeSources()
                , dateLogicInst.initializeDates()
                , updateGraphData
            );

            // set up scope
            scope.dataLogicInst = dataLogicInst;
        };
        return {
            restrict: 'E'
            , require: '^^interactiveGraph'
            , link: {
                post: linkFn
            }
            , scope: {
                initialState: "@"
            }
            , templateUrl: envInst.curEnv() + '/app/components/directives/graph-options.html'
        };
    });
};


//---------//
// Helpers //
//---------//

function updateGraphData(dataLogicInst, uiLogicInst) {
    dataLogicInst.updateGraphData();
    uiLogicInst.setFormElementWidths();
}
