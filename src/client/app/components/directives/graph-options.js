"use strict";


//---------//
// Imports //
//---------//

var bPromise = require('bluebird')
  , DateLogic = require('./helpers/graph-options/date-logic')
  , UILogic = require('./helpers/graph-options/ui-logic')
  , DataLogic = require('./helpers/graph-options/data-logic')
  , $ = require('jquery')
  ;


//------//
// Init //
//------//

require('gsapCssPlugin'); // initializes the gsap css plugin

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
    var linkFn = function linnkFn(scope, element, attrs, interactiveGraphCtrl) {
      var tmpDialog = element.find('.dialog');

      scope.setSubmitEnabled = setSubmitEnabled;

      function setSubmitEnabled(enabled) {
        var submit = element.find('input[type="submit"]');
        if (enabled) {
          submit.removeClass('disabled');
        } else {
          submit.addClass('disabled');
        }
      }

      element.find('input[type="submit"]').click(function() {
        if (!$(this).hasClass('disabled')) {
          $(this).addClass('disabled');
          dataLogicInst.updateGraphData();
        }
      });

      // preload images
      var imgs = [new Image(), new Image()];
      imgs[0].src = '../img/check_mark.png';
      imgs[1].src = '../img/loading.gif';

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
      var constants = { API: API };

      // instantiate helpers
      var dateLogicInst = new DateLogic(state, handles, constants)
        , uiLogicInst = new UILogic(state, handles, constants)
        , dataLogicInst = new DataLogic(state, handles, constants, scope)
        ;

      // run any initialization methods
      uiLogicInst.initiateTitleClick();

      // begin initializing ajax calls - possibly should belong in the interactive-graph directive
      bPromise.join(
        uiLogicInst
        , dataLogicInst.initializeLocations()
        , dataLogicInst.initializeTypes()
        , dataLogicInst.initializeMeasurementNames()
        , dataLogicInst.initializeSources()
        , dateLogicInst.initializeDates()
        , setFormElementWidths
      );

      // set up scope
      scope.dataLogicInst = dataLogicInst;
    };
    return {
      restrict: 'E'
      , require: '^^interactiveGraph'
      , link: linkFn
      , scope: { initialState: "@" }
      , templateUrl: 'app/components/directives/graph-options.html'
    };
  });
};


//---------//
// Helpers //
//---------//

function setFormElementWidths(uiLogicInst) {
  uiLogicInst.setFormElementWidths();
}
