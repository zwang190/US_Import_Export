export {
    create_choropleth_map
}

function create_choropleth_map(path, title, div, year) {
    d3.csv(path, function (data) {
        var choropleth_map_width = 960;
        var choropleth_map_height = 500;

        var lowColor = 'lightgrey'
        var highColor = '#bc2a66'


        var projection = d3.geoAlbersUsa()
            .translate([choropleth_map_width / 2, choropleth_map_height / 2])
            .scale([1000]);

        var choropleth_map_path = d3.geoPath()
            .projection(projection);

        var choropleth_map_svg = d3.select("body").select("#choropleth_map")
            .select(div)
            .append("svg")
            .attr("width", choropleth_map_width)
            .attr("height", choropleth_map_height);

        choropleth_map_svg.append("text")
            .attr('x', 300)
            .attr("y", 20)
            .text(title)
            .attr('font-family', 'sans-serif');

        var dataArray = [];
        var grand_data = new Map();

        grand_data.set(2017, []);
        grand_data.set(2018, []);
        grand_data.set(2019, []);
        grand_data.set(2020, []);

        var inner_list;
        for (var d = 0; d < data.length; d++) {
            inner_list = grand_data.get(2017);
            inner_list.push({name: data[d]['State'], value: +data[d]['Value_2017']})

            inner_list = grand_data.get(2018);
            inner_list.push({name: data[d]['State'], value: +data[d]['Value_2018']})

            inner_list = grand_data.get(2019);
            inner_list.push({name: data[d]['State'], value: +data[d]['Value_2019']})

            inner_list = grand_data.get(2020);
            inner_list.push({name: data[d]['State'], value: +data[d]['Value_2020']})
        }
        inner_list = grand_data.get(parseInt(year));
        for(let i = 0; i < inner_list.length; i++){
            dataArray.push(inner_list[i].value);
        }

        var minVal = d3.min(dataArray)
        var maxVal = d3.max(dataArray)
        var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])

        d3.json("state_import_export/us-all.json", function (json) {
            for (var i = 0; i < inner_list.length; i++) {
                var dataState = inner_list[i].name;
                var dataValue = inner_list[i].value;

                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {

                        // Copy the data value into the JSON
                        json.features[j].properties.value = dataValue;

                        // Stop looking through the JSON
                        break;
                    }
                }
            }

            let hover_on = function (d) {
                d3.selectAll(".path")
                    .transition()
                    .duration(200)

                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#3182bd")
            }

            let hover_off = function (d) {
                d3.selectAll(".path")
                    .transition()
                    .duration(200)

                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", function (d){
                        return ramp(d.properties.value);
                    })
            }

            choropleth_map_svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", choropleth_map_path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .on("mouseover", hover_on)
                .on("mouseleave", hover_off)
                .style("fill", function (d) {
                    return ramp(d.properties.value)
                })
                .append("title")
                .text(function (d) {
                    return d.properties.name + ': ' + d3.format("$,")(d.properties.value);
                });

            var w = 140, h = 300;

            var choropleth_map_key = d3.select("body").select("#choropleth_map").select(div)
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "legend");

            var choropleth_map_legend = choropleth_map_key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            choropleth_map_legend.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", highColor)
                .attr("stop-opacity", 1);

            choropleth_map_legend.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", lowColor)
                .attr("stop-opacity", 1);

            choropleth_map_key.append("rect")
                .attr("width", w - 100)
                .attr("height", h)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0,10)");

            var y = d3.scaleLinear()
                .range([h, 0])
                .domain([minVal, maxVal]);

            var yAxis = d3.axisRight(y);

            choropleth_map_key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41,10)")
                .call(yAxis)
        });
    });
}