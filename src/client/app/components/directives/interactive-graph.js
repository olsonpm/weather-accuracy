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
        function controllerFn($scope, $element, $attrs) {
            var graphsDirective = $element.children('graphs').eq(0);

            this.updateGraphData = function updateGraphData(dataObj, sources, currentMeasurementName, currentType, moments) {
                var graphsScope = graphsDirective.isolateScope();
                log.debug("interactive-graph's updateGraphData called");
                graphsScope.updateGraphData(dataObj, sources, currentMeasurementName, currentType, moments);
            };
        }

        return {
            restrict: 'E'
            , controller: controllerFn
            , templateUrl: envInst.curEnv() + '/app/components/directives/interactive-graph.html'
        };
    });
};