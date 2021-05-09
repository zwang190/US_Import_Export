"use strict";
export {
    create_monthly_line_chart
}

// line chart code: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// time series from: http://bl.ocks.org/mbostock/3883245
// https://www.kaggle.com/shenba/time-series-datasets
function create_monthly_line_chart(path, main_div, flag) {
    d3.csv(path, function (error, data) {
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            height = 500 - margin.top - margin.bottom;
        var maxWidth = 860 - margin.left - margin.right;
        var width = 860 - margin.left - margin.right;

        var parseTime = d3.timeParse("%m/%Y");
        var _x = d3.scaleTime().range([0, width]);
        var _y = d3.scaleLinear().range([height, 0]);

        var valueline = d3.line().x(function (d) {
            return _x(d.date);
        }).y(function (d) {
            return _y(d.trading_value);
        });

        if (error) throw error;

        var svg = d3.select("body").select(main_div).append("svg").attr("width", 960).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function (d) {
            d.date = parseTime(d.Month);
            d.trading_value = +d.Value;
        });
        console.log(data)

        _x.domain(d3.extent(data, function (d) {
            return d.date;
        }));

        var min_val = d3.min(data, function (d){
            return d.trading_value;
        })

        _y.domain([min_val, d3.max(data, function (d) {
            return d.trading_value;
        })]);

        svg.append("path").data([data]).attr("class", "line").attr("d", valueline);

        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(_x));

        svg.append("g").call(d3.axisLeft(_y));



        var ver_offset = 25;
        svg.append("text")
            .attr('x',width)
            .attr("y", height + ver_offset)
            .text("Time")
            .attr('font-family','sans-serif');

        svg.append("text")
            .attr('x',-35)
            .attr("y", -7)
            .text("Millions of Dollars")
            .attr('font-family','sans-serif');

        var labels;
        if(flag === 'i'){
            labels = [{
                data: { date: "5/2020", trading_value: 165774.3},
                dy: -20,
                dx: -142,
                subject: { text: 'A', y: "bottom" },
                id: "minimize-badge"
            }, {
                data: { date: "12/2020", trading_value: 216425.0},
                dy: 20,
                dx: -142,
                subject: { text: 'B', y: "bottom" },
                id: "minimize-badge"
            }].map(function (l) {
                l.note = Object.assign({}, l.note, { title: "Trading Value: " + l.data.trading_value,
                    label: "" + l.data.date });
                return l;
            });

            svg.append("text")
                .attr('x',140)
                .attr("y", -5)
                .text("Monthly Trading Value of U.S. Import")
                .style("font-size", '20px')
                .attr('font-family','sans-serif');

        } else {
            labels = [{
                data: { date: "5/2020", trading_value: 89750.9},
                dy: -20,
                dx: -142,
                subject: { text: 'A', y: "bottom" },
                id: "minimize-badge"
            }, {
                data: { date: "12/2020", trading_value: 133230.6},
                dy: 20,
                dx: -142,
                subject: { text: 'B', y: "bottom" },
                id: "minimize-badge"
            }].map(function (l) {
                l.note = Object.assign({}, l.note, { title: "Trading Value: " + l.data.trading_value,
                    label: "" + l.data.date });
                return l;
            });

            svg.append("text")
                .attr('x',140)
                .attr("y", -5)
                .text("Monthly Trading Value of U.S. Export")
                .style("font-size", '20px')
                .attr('font-family','sans-serif');
        }

        var resize = [{
            subject: {
                y1: 0,
                y2: height
            },
            x: width,
            dx: 10,
            dy: height / 2,
            disable: ["connector"],
            note: {
                title: "< >",
                label: "drag to resize",
                lineType: "none"
            }
        }];

        var timeFormat = d3.timeFormat("%b-%y");

        window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutElbow).accessors({ x: function x(d) {
                return _x(parseTime(d.date));
            },
            y: function y(d) {
                return _y(d.trading_value);
            }
        }).accessorsInverse({
            date: function date(d) {
                return timeFormat(_x.invert(d.x));
            },
            trading_value: function trading_value(d) {
                return _y.invert(d.y);
            }
        }).on('subjectover', function (annotation) {
            this.append('text').attr('class', 'hover').text(annotation.note.title).attr('text-anchor', 'middle').attr('y', 300).attr('x', -30);

            this.append('text').attr('class', 'hover').text(annotation.note.label).attr('text-anchor', 'middle').attr('y', 320).attr('x', -30);
        }).on('subjectout', function (annotation) {
            this.selectAll('text.hover').remove();
        });


        window.makeResize = d3.annotation().annotations(resize).type(d3.annotationXYThreshold);

        svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

        svg.append("g").attr("class", "annotation-resize").call(makeResize);

        svg.select(".annotation.xythreshold").call(d3.drag().on("drag", function (d) {
            var newWidth = Math.max(0, Math.min(maxWidth, d.x + d3.event.dx));
            d.x = newWidth;

            var threshold = 400;
            if (newWidth < threshold && width >= threshold) {
                makeAnnotations.type(d3.annotationBadge);
                svg.select("g.annotation-test").call(makeAnnotations);
            } else if (newWidth > threshold && width <= threshold) {
                makeAnnotations.type(d3.annotationCalloutElbow);
                svg.select("g.annotation-test").call(makeAnnotations);
            }

            width = newWidth;

            _x.range([0, width]);
            makeAnnotations.updatedAccessors();
            makeResize.updatedAccessors();

            svg.select("g.x-axis").call(d3.axisBottom(_x));

            svg.select("path.line").attr("d", valueline);
        }));
    });
}