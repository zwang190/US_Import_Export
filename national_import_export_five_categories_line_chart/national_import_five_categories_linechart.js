let grand_data;
let data_array = []

const m = new Map([["California", "CA"], ["Texas", "TX"], ["New York", "NY"], ["Massachusetts", "MA"], ["Oregon", "OR"], ["Louisiana", "LA"], ["New Mexico", "NM"],
    ["New Jersey", "NJ"], ["Pennsylvania", "PA"], ["North Dakota", "ND"]]);
const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
const y_labels = [];
grand_data = new Map();

let categories = ['Industrial Supplies', 'Capital Goods', 'Automotive Vehicles', 'Consumer Goods', 'Foods'];

var margin = {top: 100, right: 30, bottom: 30, left: 100},
    width = 800 - margin.left - margin.right,
    padding = 50;
    height = 600 - margin.top - margin.bottom;

d3.csv("Import_five_end_use.csv", function (data) {
    var sumstat = d3.nest()
        .key(function(d) { return d.Categories;})
        .entries(data);

    console.log(sumstat);

    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Period; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20));


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return + d.Value; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(50));

    var res = sumstat.map(function(d){ return d.key }) // list of group names
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#f781bf'])

    var k = 1;
    var j = 0;
    var y_const = 25;
    var x_const = 150;
    var offset = 400;
    var y_offset = 50;
    for (let i = 0; i < categories.length; i++) {
        var country = categories[i];
        svg.append("text").attr("x", j * x_const + padding + offset).attr("y", y_const * k - y_offset).style("font-size", "12px").attr("alignment-baseline", "middle").text(country);
        svg.append("circle").attr("cx", j * x_const + padding + offset - 15).attr("cy", y_const * k - y_offset).attr("r", 4).style("fill", color(country));
        k++;
        if (k === 4) {
            k = 1;
            j++;
        }
    }

    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.Period); })
                .y(function(d) { return y(+d.Value); })
                (d.values)
        })

})

//https://www.d3-graph-gallery.com/graph/heatmap_basic.html
//http://bl.ocks.org/PBrockmann/5e7b2ce5edf2e326c88800d4303da0dd
//https://blockbuilder.org/achebrol/31833ec3fb7554d2b8e01e1ab32a09d1
//http://bl.ocks.org/tjdecke/5558084
//https://www.d3-graph-gallery.com/graph/heatmap_style.html
//https://stackoverflow.com/questions/40246490/d3-legend-not-appearing-due-to-legendcolor
//http://using-d3js.com/04_08_legends.html