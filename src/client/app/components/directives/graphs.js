"use strict";


//---------//
// Imports //
//---------//

var d3 = require('d3')
    , nh = require('node-helpers')
    , moment = require('moment')
    , roundn = require('compute-roundn')
    , $ = require('jquery');


//------//
// Init //
//------//

var envInst = new nh.Environment();
require('fancybox')($);

// (should correspond to sass variable)
var MAX_SIZE = 525;
var MIN_GRAPH_MARGIN = 100;
var GRAPH_HEIGHT = 70;

//------//
// Main //
//------//

module.exports = function(app, log) {
    app.directive('graphs', function() {
        var linkFn = function(scope, element, attrs) {
            log.debug('graph linked');
            initiateHelpers();

            // data comes in the following format
            // newData{SourceID}
            //   - ymd: YMD
            //   - forecasted: Value
            //   - actual: Value
            //   - source: SourceID

            // start with a line graph yo!
            var svg = {};
            var viewportWidth = window.innerWidth;
            var leftMargin = calculateResponsiveLength(25);
            var commonMargin = calculateResponsiveLength(10);
            var translateX = roundn((leftMargin + commonMargin) / 2, 0);
            var translateY = roundn(commonMargin / 3, 0);
            var aggregateBarWidth = calculateResponsiveLength(10);

            var width = parseInt(element.css('width'), 10) - (leftMargin + commonMargin);
            var height = calculateResponsiveLength(GRAPH_HEIGHT) - (commonMargin * 2);

            var parseDate = d3.time.format("%Y%m%d").parse;
            var dateOutputFormat = d3.time.format('%_d');

            var x = d3.time.scale()
                .range([0, width]);
            var y = d3.scale.linear()
                .range([height, 0]);
            var xAggregate = d3.scale.linear()
                .range([0, width]);
            var yAggregate = y;

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .tickFormat(dateOutputFormat);
            var xAxisAggregate = d3.svg.axis()
                .scale(xAggregate)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');
            var yAxisAggregate = yAxis;

            var xPos = function(d) {
                return x(d.ymd);
            };
            var actualY = function(d) {
                return y(d.actual);
            };
            var forecastedY = function(d) {
                return y(d.forecasted);
            };

            var line = d3.svg.line()
                .interpolate('linear')
                .x(xPos)
                .y(actualY);

            scope.updateGraphData = function updateGraphData(newData, sources, currentMeasurementName, currentType, moments) {
                log.debug("graph's updateGraphData called");
                scope.$applyAsync(function() {
                    scope.measurement = currentMeasurementName.NiceValue();
                    scope.from = moments.from.format('MMMM Do');
                    scope.to = moments.to.format('MMMM Do');
                });

                var hackWidth
                    , tmpSvg
                    , data;

                var sourcesObj = {};
                sources.forEach(function(aSource) {
                    sourcesObj[aSource.SourceID()] = aSource.NiceName();
                });
                var sourcesShortObj = {};
                sources.forEach(function(aSource) {
                    sourcesShortObj[aSource.SourceID()] = aSource.ShortName();
                });
                var iToSourceID = {};
                newData.aggregate.forEach(function(aData) {
                    iToSourceID[aData.i] = aData.sourceID;
                });

                // if no graphs have been created yet, then do so
                if (element.find('.sources > ul').children().length === 0) {

                    // first create the legend

                    // line actual
                    var row = element.find('.sources > .legend > .content')
                        .append('<div class="row"></div>')
                        .children('.row').eq(0)
                        .append('<span class="label line-actual">Actual ' + currentMeasurementName.NiceValue() + ' in ' + currentMeasurementName.Symbol() + '</span>');

                    var tmpHeight = row.css('height');
                    tmpSvg = d3.select(row[0])
                        .append('svg')
                        .attr('height', tmpHeight)
                        .attr('width', '40px')
                        .append('g')
                        .attr('transform', 'translate(0, ' + roundn(parseInt(tmpHeight, 10) / 2, 0) + ')');

                    tmpSvg.append('line')
                        .attr('class', 'line-actual')
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 40)
                        .attr('y2', 0);

                    // forecasted dot
                    row = element.find('.sources > .legend > .content')
                        .append('<div class="row"></div>')
                        .children('.row').eq(1)
                        .append('<span class="label circle-forecasted">Forecasted ' + currentMeasurementName.NiceValue() + ' in ' + currentMeasurementName.Symbol() + '</span>');

                    tmpSvg = d3.select(row[0])
                        .append('svg')
                        .attr('height', tmpHeight)
                        .attr('width', '40px')
                        .append('g')
                        .attr('transform', 'translate(18, ' + roundn(parseInt(tmpHeight, 10) / 2, 0) + ')');

                    tmpSvg.append('circle')
                        .attr('class', 'circle-forecasted')
                        .attr('r', 3.5)
                        .attr('cx', 0)
                        .attr('cy', 0);

                    // forecasted line
                    row = element.find('.sources > .legend > .content')
                        .append('<div class="row"></div>')
                        .children('.row').eq(2)
                        .append('<span class="label line-forecasted">Distance between forecasted and actual</span>');

                    tmpSvg = d3.select(row[0])
                        .append('svg')
                        .attr('height', tmpHeight)
                        .attr('width', '40px')
                        .append('g')
                        .attr('transform', 'translate(0, ' + roundn(parseInt(tmpHeight, 10) / 2, 0) + ')');

                    tmpSvg.append('line')
                        .attr('class', 'line-forecasted')
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 40)
                        .attr('y2', 0);

                    // find the maximum label width and return half of it (visually appealing label/value)
                    hackWidth = roundn(parseInt(element.find('.sources > .legend > .content .label').sort(function(a, b) {
                        return $(a).css('width') < $(b).css('width');
                    }).eq(0).css('width'), 10) / 2, 0);

                    // even out the widths - the following is a hack until I modify the jquery plugin
                    element.find('.sources > .legend > .content').setChildWidths('.row');

                    element.find('.sources > .legend > .content svg')
                        .attr('width', hackWidth + 'px')
                        .css('width', hackWidth + 'px');

                    // now create the graphs
                    var tmpGraphContainer;

                    sources.forEach(function(aSource) {
                        tmpGraphContainer = d3.select(element.find('.sources > ul')[0])
                            .append('li')
                            .attr('data-source-id', aSource.SourceID());

                        tmpGraphContainer.append('h3')
                            .text(aSource.NiceName());

                        tmpSvg = tmpGraphContainer
                            .append('svg')
                            .attr('width', width + (leftMargin + commonMargin))
                            .attr('height', height + (commonMargin * 2))
                            .append('g')
                            .attr('transform', 'translate(' + translateX + ', ' + translateY + ')');

                        tmpSvg.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .append('text')
                            .attr('class', 'x-axis-label');
                        tmpSvg.append('g')
                            .attr('class', 'y axis')
                            .append('text')
                            .attr('class', 'y-axis-label')
                            .attr('transform', 'rotate(-90)');

                        tmpSvg.append('path')
                            .attr('class', 'line-actual');

                        svg[aSource.SourceID()] = tmpSvg;
                    });

                    // and the aggregate graph
                    tmpSvg = d3.select(element.find('.aggregate > ul')[0])
                        .append('li')
                        .append('svg')
                        .attr('width', width + (leftMargin + commonMargin))
                        .attr('height', height + (commonMargin * 2))
                        .append('g')
                        .attr('transform', 'translate(' + translateX + ', ' + translateY + ')');

                    tmpSvg.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + height + ')')
                        .append('text')
                        .attr('class', 'x-axis-label');
                    tmpSvg.append('g')
                        .attr('class', 'y axis')
                        .append('text')
                        .attr('class', 'y-axis-label')
                        .attr('transform', 'rotate(-90)');

                    svg.aggregate = tmpSvg;

                } else {
                    var labels = element.find('.sources > .legend > .content .label');
                    labels.filter('.line-actual')
                        .text('Actual ' + currentMeasurementName.NiceValue() + ' in ' + currentMeasurementName.Symbol());
                    labels.filter('.circle-forecasted')
                        .text('Forecasted ' + currentMeasurementName.NiceValue() + ' in ' + currentMeasurementName.Symbol());

                    // find the minimum label width
                    hackWidth = roundn(parseInt(element.find('.sources > .legend > .content .label').sort(function(a, b) {
                        return $(a).css('width') > $(b).css('width');
                    }).eq(0).css('width'), 10) / 2, 0);

                    // even out the widths - the following is a hack until I modify the jquery plugin
                    element.find('.sources > .legend > .content').setChildWidths('.row');

                    element.find('.sources > .legend > .content svg')
                        .attr('width', hackWidth + 'px')
                        .css('width', hackWidth + 'px');
                }

                // y-axis should be the same for all sources
                var allData = [];
                sources.forEach(function(aSource) {
                    allData = allData.concat(newData[aSource.SourceID()]);
                });

                // subtract one so the forecasted dots don't run into the x-axis
                var yMin = d3.min(allData, function(d) {
                    return Math.min(d.actual, d.forecasted);
                }) - 1;
                var yMax = d3.max(allData, function(d) {
                    return Math.max(d.actual, d.forecasted);
                });
                y.domain([yMin, yMax]);
                var numYTicks = roundn(yMax - yMin, 0);
                var yAxisTickResolution = numYTicks / height * 100;
                while (yAxisTickResolution > 5) {
                    numYTicks = roundn(numYTicks / 2, 0);
                    yAxisTickResolution = numYTicks / height * 100;
                }
                yAxis.ticks(numYTicks);

                var numXTicks = Math.abs(moments.from.diff(moments.to, 'days')) + 1;
                var xAxisTickResolution = numXTicks / width * 100;
                xAxis.ticks(Math.min(numXTicks, roundn(3 * width / 100, 0)));
                xAxis.tickFormat(dateOutputFormat);

                var oneDayBeforeMin = moment(moments.from).subtract(1, 'day').toDate();
                var maxDay = moments.to.toDate();
                x.domain([oneDayBeforeMin, maxDay]);

                sources.forEach(function(aSource) {
                    tmpSvg = svg[aSource.SourceID()];
                    data = newData[aSource.SourceID()];
                    data.forEach(function(aGraphDataPoint) {
                        aGraphDataPoint.ymd = parseDate(aGraphDataPoint.ymd);
                        aGraphDataPoint.forecasted = +aGraphDataPoint.forecasted;
                        aGraphDataPoint.actual = +aGraphDataPoint.actual;
                    });

                    tmpSvg.selectAll('.x.axis')
                        .call(xAxis);
                    tmpSvg.selectAll('.y.axis')
                        .call(yAxis);

                    tmpSvg.selectAll('.y.axis .tick')
                        .append('line')
                        .attr('class', 'grid-line')
                        .attr('x1', 0)
                        .attr('xy', 0)
                        .attr('x2', width)
                        .attr('y2', 0);

                    var xAxisLabel = 'Days';
                    if (moments.from.month() === moments.to.month()) {
                        xAxisLabel += ' in ' + moment.months()[moments.to.month()];
                    } else {
                        xAxisLabel += ': ' + moment.months()[moments.from.month()] + ' into ' + moment.months()[moments.to.month()];
                    }
                    tmpSvg.selectAll('.x-axis-label')
                        .attr('x', roundn((parseInt(element.css('width'), 10) / 2) - translateX, 0))
                        .attr('y', roundn(commonMargin * 1.3, 0))
                        .text(xAxisLabel);
                    tmpSvg.selectAll('.y-axis-label')
                        .attr('x',-roundn(height / 2, 0))
                        .attr('y',-roundn(leftMargin / 2, 0))
                        .text(currentMeasurementName.NiceValue() + ' in ' + currentMeasurementName.Symbol());

                    tmpSvg.selectAll('.line-actual')
                        .datum(data)
                        .attr('d', line);

                    var forecastCircle = tmpSvg.selectAll('.circle-forecasted')
                        .data(data);
                    forecastCircle.exit().remove();
                    forecastCircle.enter().append('circle')
                        .attr('class', 'circle-forecasted')
                        .attr('r', 3.5);

                    forecastCircle.attr('cx', xPos)
                        .attr('cy', forecastedY);

                    var forecastLine = tmpSvg.selectAll('.line-forecasted')
                        .data(data);
                    forecastLine.exit().remove();
                    forecastLine.enter().append('line')
                        .attr('class', 'line-forecasted');

                    forecastLine.attr('x1', xPos)
                        .attr('y1', actualY)
                        .attr('x2', xPos)
                        .attr('y2', forecastedY);
                });

                // fill aggregate graph
                tmpSvg = svg.aggregate;
                data = newData.aggregate;
                xAggregate.domain([0, sources.length + 1]);
                data.forEach(function(aggregatePoint) {
                    aggregatePoint.i = +aggregatePoint.i;
                    aggregatePoint.degrees = +aggregatePoint.degrees;
                });
                yMax = d3.max(data, function(aData) {
                    return aData.degrees;
                });
                yAggregate.domain([0, yMax]);

                xAxisAggregate
                    .ticks(sources.length + 1)
                    .tickFormat(function(d) {
                        var res;
                        if (sources.length / width * 100 > 0.5) {
                            res = sourcesShortObj[iToSourceID[d]];
                        } else {
                            res = sourcesObj[iToSourceID[d]];
                        }
                        return res || '';
                    });
                tmpSvg.selectAll('.x.axis')
                    .call(xAxisAggregate);
                tmpSvg.selectAll('.y.axis')
                    .call(yAxisAggregate);

                tmpSvg.selectAll('.y.axis .tick')
                    .append('line')
                    .attr('class', 'grid-line')
                    .attr('x1', 0)
                    .attr('xy', 0)
                    .attr('x2', width)
                    .attr('y2', 0);

                tmpSvg.selectAll('.x.axis .tick text')
                    .attr('dy', '1em');

                var aggregateBar = tmpSvg.selectAll('aggregate-bar')
                    .data(data);
                aggregateBar.exit().remove();
                aggregateBar.enter().append('rect')
                    .attr('x', function(d) {
                        return xAggregate(d.i) - roundn(aggregateBarWidth / 2, 0);
                    })
                    .attr('y', function(d) {
                        return yAggregate(d.degrees);
                    })
                    .attr('height', function(d) {
                        return height - yAggregate(d.degrees);
                    })
                    .attr('width', aggregateBarWidth);

                tmpSvg.selectAll('.x-axis-label')
                    .attr('x', roundn((parseInt(element.css('width'), 10) / 2) - translateX, 0))
                    .attr('y', roundn(commonMargin * 1.3, 0))
                    .text('Sources');
                tmpSvg.selectAll('.y-axis-label')
                    .attr('x',-roundn(height / 2, 0))
                    .attr('y',-roundn(leftMargin / 2, 0))
                    .text('Total Difference in ' + currentMeasurementName.Symbol());
            };
        };

        return {
            restrict: 'E'
            , require: '^^interactiveGraph'
            , link: linkFn
            , scope: {}
            , templateUrl: envInst.curEnv() + '/app/components/directives/graphs.html'
        };
    });
};


//------------------//
// Helper Functions //
//------------------//

function calculateResponsiveLength(len) {
    var vmin = Math.min(Math.min(window.innerHeight, window.innerWidth), MAX_SIZE);

    return roundn(vmin * len / 100, 0);
}

function initiateHelpers() {
    var sourcesFancyBox = $('graphs > .sources > .fancybox').eq(0);
    sourcesFancyBox.fancybox({
        autoSize: false, autoHeight: true
    });
    $('graphs > .sources > h2 > .help').click(function() {
        sourcesFancyBox.click();
    });

    var aggregateFancyBox = $('graphs > .aggregate > .fancybox').eq(0);
    aggregateFancyBox.fancybox({
        autoSize: false, autoHeight: true
    });
    $('graphs > .aggregate > h2 > .help').click(function() {
        aggregateFancyBox.click();
    });
}
