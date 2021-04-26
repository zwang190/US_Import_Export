d3.csv("./BOP/historical_BOP1.csv", function(data) {
    var margin = {top: 100, right: 30, bottom: 30, left: 90},
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var padding = 50;

    var line_chart_ie = d3.select("body")
        .select("#my_dataviz_import_export_line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    line_chart_ie.append("text")
        .attr('x',-70)
        .attr("y", -10)
        .text("Money flow (millions of dollars)")
        .attr('font-family','sans-serif');

    line_chart_ie.append("text")
        .attr('x',400)
        .attr("y", -10)
        .text("National Balance of Payment (Import/Export)")
        .attr('font-family','sans-serif');

    var sumstat = d3.nest()
        .key(function(d) { return d.Category;})
        .entries(data);

    console.log(sumstat)
    var new_data_set = []
    for(let idx of sumstat.keys()){
        var inner_map = sumstat[idx];
        var inner_list = inner_map.values;
        var key = inner_map.key;
        inner_list = inner_list.slice(40);
        new_data_set.push({key: key, values: inner_list});
    }
    var years = new_data_set[0];

    var x = d3.scaleLinear()
        .domain(d3.extent(years.values, function(d) { return d.Year; }))
        .range([ 0, width ]);
    line_chart_ie.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15));

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Total; })])
        .range([ height, 0 ]);
    line_chart_ie.append("g")
        .call(d3.axisLeft(y).ticks(30));

    var res = sumstat.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8'])

    var k = 1;
    var j = 0;
    var y_const = 25;
    var x_const = 300;
    var offset = 1000;
    var y_offset = 90;
    for (let i = 0; i < res.length; i++) {
        var category = res[i];
        line_chart_ie.append("text").attr("x", j * x_const + padding + offset).attr("y", y_const * k - y_offset).style("font-size", "15px").attr("alignment-baseline", "middle").text(category);
        line_chart_ie.append("circle").attr("cx", j * x_const + padding + offset - 15).attr("cy", y_const * k - y_offset).attr("r", 6).style("fill", color(category));
        k++;
        if (k === 4) {
            k = 1;
            j++;
        }
    }

    let hover_on = function(d) {
        d3.selectAll(".line")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "blue")
            .style('stroke-width', '3px')
    }

    let hover_off = function(d) {
        d3.selectAll(".line")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", function (d) {
                return color(d.Category)
            })
    }

    var circle_dataset = []
    console.log(new_data_set)
    for(let i = 0; i < new_data_set.length; i++){
        circle_dataset.push(...new_data_set[i].values)
    }
    console.log(circle_dataset)
    line_chart_ie.selectAll(".line")
        .data(new_data_set)
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

    line_chart_ie.selectAll(".line")
        .append("g")
        .data(circle_dataset)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(+ d.Total))
        .style("fill", d => color(d.Category))
        .on("mouseover", hover_on)
        .on("mouseleave", hover_off)
        .append("title")
        .text(function(d) { return d.Category + ". Year: " + d.Year + "  Value: " + d.Total; });

    var ver_offset = 30
    line_chart_ie.append("text")
        .attr('x',1180 - margin.left - margin.right)
        .attr("y", height + ver_offset)
        .text("Year")
        .attr('font-family','sans-serif');
})