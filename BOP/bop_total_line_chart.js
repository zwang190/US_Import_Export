d3.csv("BOP/historical_bop_total.csv", function(data) {
    const num_yaers = 40;

    var margin = {top: 80, right: 30, bottom: 30, left: 110},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;


    var total_line_chart_svg = d3.select("body")
        .select("#my_dataviz_total")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    total_line_chart_svg.append("text")
        .attr('x',-50)
        .attr("y", -10)
        .text("Millions of Dollars")
        .attr('font-family','sans-serif');

    total_line_chart_svg.append("text")
        .attr('x',400)
        .attr("y", -10)
        .text("Balance of Payments")
        .attr('font-family','sans-serif');

    data = data.slice(num_yaers);
    var sumstat = d3.nest()
        .key(function(d) { return d.Category;})
        .entries(data);

    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ]);
    total_line_chart_svg.append("g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x).ticks(20).tickFormat(x => x));

    var y = d3.scaleLinear()
        .domain([0 - d3.max(data, function(d) { return Math.abs(+ d.Total); }), d3.max(data, function(d) { return Math.abs(+ d.Total); })])
        .range([ height, 0 ]);
    total_line_chart_svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(15));

    var res = sumstat.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    total_line_chart_svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.Year); })
                .y(function(d) { return y(+d.Total); })
                (d.values)
        })

    let hover_on = function(d) {
        d3.selectAll(".bar")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "blue")
            .style('stroke-width', '3px')
    }

    let hover_off = function(d) {
        d3.selectAll(".bar")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", function (d) {
                return color(d.Category)
            })
    }

    total_line_chart_svg.selectAll(".line")
        .append("g")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(+ d.Total))
        .style("fill", d => color(d.Category))
        .on("mouseover", hover_on)
        .on("mouseleave", hover_off)
        .append("title")
        .text(function(d) { return d3.format("$,")(d.Total); });

    total_line_chart_svg.append("text")
        .attr('x',1180 - margin.left - margin.right)
        .attr("y", 490 - margin.top - margin.bottom)
        .text("Year")
        .attr('font-family','sans-serif');
})