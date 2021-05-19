export {
    create_line_chart
}

/**
 * This method will create the line charts
 * @param path: path to the input file
 * @param div: primary div
 * @param title: title of the graph
 */
function create_line_chart(path, div, title) {
    d3.csv(path, function (data) {
        let categories = ['Industrial Supplies', 'Capital Goods', 'Automotive Vehicles', 'Consumer Goods', 'Foods', 'Other Goods'];

        var margin = {top: 140, right: 50, bottom: 60, left: 150},
            width = 1300 - margin.left - margin.right,
            padding = 50;
        var choropleth_map_height = 800 - margin.top - margin.bottom;

        var sumstat = d3.nest()
            .key(function (d) {
                return d.Categories;
            })
            .entries(data);

        var svg = d3.select("body")
            .select("#line_chart2")
            .select(div)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", choropleth_map_height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.Period;
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + choropleth_map_height + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x).ticks(20).tickFormat(x => x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return +d.Value;
            })])
            .range([choropleth_map_height, 0]);
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(10));

        var res = sumstat.map(function (d) {
            return d.key
        }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#f781bf'])

        svg.append("text")
            .attr('x', -150)
            .attr("y", -10)
            .text("Money flow (millions of dollars)")
            .attr('font-family', 'sans-serif');

        var k = 1;
        var j = 0;
        var y_const = 25;
        var x_const = 170;
        var offset = 420;
        var y_offset = 90;
        for (let i = 0; i < categories.length; i++) {
            var country = categories[i];
            svg.append("text").attr("x", j * x_const + padding + offset + 15).attr("y", y_const * k - y_offset).style("font-size", "15px").attr("alignment-baseline", "middle").text(country);
            svg.append("circle").attr("cx", j * x_const + padding + offset).attr("cy", y_const * k - y_offset).attr("r", 5).style("fill", color(country));
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
            .attr("stroke", function (d) {
                return color(d.key)
            })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) {
                        return x(d.Period);
                    })
                    .y(function (d) {
                        return y(+d.Value);
                    })
                    (d.values)
            })

        let hover_on = function (d) {
            d3.selectAll(".line")
                .transition()
                .duration(200);

            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "blue");
        }

        let hover_off = function (d) {
            d3.selectAll(".line")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", function (d) {
                    return color(d.Categories)
                })
        }

        svg.selectAll(".line")
            .append("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 6)
            .attr("cx", d => x(d.Period))
            .attr("cy", d => y(+d.Value))
            .style("fill", d => color(d.Categories))
            .on("mouseover", hover_on)
            .on("mouseleave", hover_off)
            .append("title")
            .text(function (d) {
                return d.Categories + ". Year: " + d.Period + "  Value: " + d3.format("$,")(d.Value);
            });

        var ver_offset = 40;
        svg.append("text")
            .attr('x', 1280 - margin.left - margin.right)
            .attr("y", choropleth_map_height + ver_offset)
            .text("Year")
            .attr('font-family', 'sans-serif');

        svg.append("text")
            .attr('x', 440 - margin.left - margin.right)
            .attr("y", -100)
            .style("font-size", '20px')
            .text(title)
            .attr('font-family', 'sans-serif');

    })
}

//https://www.d3-graph-gallery.com/graph/heatmap_basic.html
//http://bl.ocks.org/PBrockmann/5e7b2ce5edf2e326c88800d4303da0dd
//https://blockbuilder.org/achebrol/31833ec3fb7554d2b8e01e1ab32a09d1
//http://bl.ocks.org/tjdecke/5558084
//https://www.d3-graph-gallery.com/graph/heatmap_style.html
//https://stackoverflow.com/questions/40246490/d3-legend-not-appearing-due-to-legendcolor
//http://using-d3js.com/04_08_legends.html