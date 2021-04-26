

// Load in my states data!
d3.csv("state_import_export/state_import_csv.csv", function(data) {
    var choropleth_map_width = 960;
    var choropleth_map_height = 500;

    var lowColor = 'lightgrey'
    var highColor = '#bc2a66'

// D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([choropleth_map_width / 2, choropleth_map_height / 2])
        .scale([1000]);


    var choropleth_map_path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
        .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
    var choropleth_map_svg = d3.select("body")
        .select("#choropleth_map")
        .append("svg")
        .attr("width", choropleth_map_width)
        .attr("height", choropleth_map_height);

    choropleth_map_svg.append("text")
        .attr('x', 300)
        .attr("y", 20)
        .text("Foreign Trade Stat. of Import at State Level in Year 2017 (Millions of Dollars)")
        .attr('font-family','sans-serif');

    var dataArray = [];
    for (var d = 0; d < data.length; d++) {
        dataArray.push(parseFloat(data[d]['Value_2017']))
    }
    console.log(dataArray)
    var minVal = d3.min(dataArray)
    var maxVal = d3.max(dataArray)
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])

    // Load GeoJSON data and merge with states data
    d3.json("state_import_export/us-all.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataState = data[i].State;

            // Grab data value
            var dataValue = data[i].Value_2017;

            // Find the corresponding state inside the GeoJSON
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

        let hover_on = function(d) {
            d3.selectAll(".path")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "black")
        }

        let hover_off = function(d) {
            d3.selectAll(".path")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "white")
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        choropleth_map_svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", choropleth_map_path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .on("mouseover", hover_on)
            .on("mouseleave", hover_off)

            .style("fill", function(d) { return ramp(d.properties.value) })
            .append("title")
            .text(function(d) { return d.properties.name + ': ' + d3.format("$,")(d.properties.value); });

        // add a legend
        var w = 140, h = 300;

        var choropleth_map_key = d3.select("body").select("#choropleth_map")
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