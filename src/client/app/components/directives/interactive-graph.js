"use strict";


//---------//
// Imports //
//---------//

var nh = require('node-helpers');


//------//
// Init //
//------//

var envInst = new nh.Environment();


//------//
// Main //
//------//

module.exports = function(app, log) {
    app.directive('interactiveGraph', function() {
        function controllerFn($scope, $element) {
            var graphsDirective = $element.children('graphs').eq(0);
            var graphOptionsDirective = $element.children('graph-options').eq(0);

            this.updateGraphData = function updateGraphData(dataObj, sources, currentMeasurementName, currentType, moments) {
                var graphsScope = graphsDirective.isolateScope();
                log.debug("interactive-graph's updateGraphData called");
                graphsScope.updateGraphData(dataObj, sources, currentMeasurementName, currentType, moments);
            };
            this.setOptionsSubmitEnabled = function setOptionsSubmitEnabled(enabled) {
                graphOptionsDirective.isolateScope().setSubmitEnabled(enabled);
            };
        }

        return {
            restrict: 'E'
            , controller: ['$scope', '$element', '$attrs', controllerFn]
            , templateUrl: envInst.curEnv() + '/app/components/directives/interactive-graph.html'
        };
    });
};
