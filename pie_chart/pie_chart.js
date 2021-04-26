
d3.csv("pie_chart/ca_export_csv.csv", function(error, data) {
    var pie_svg = d3.select("body").select("#pie_chart").select("svg"),
        width = pie_svg.attr("width"),
        height = pie_svg.attr("height"),
        radius = 250;

    var pie_g = pie_svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie_color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c', '#0FCCCB']);

    var pie = d3.pie().value(function(d) {
        return d.share;
    });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 80);

    if (error) {
        throw error;
    }

    var new_data = [];
    var total_2020 = 0;
    for(let i = 0; i < data.length; i++){
        if(data[i].Rank !== "-1") {
            new_data.push({name: data[i]['Description'], value: + data[i]['Value2020']})
        } else {
            total_2020 = parseInt(data[i].Value2020);
        }
    }
    console.log(new_data);
    console.log(total_2020);
    new_data.sort(function (a, b) {
        return b.value - a.value;
    })

    new_data = new_data.slice(0, 5);
    console.log(new_data);

    var data_set = [];
    for(let i = 0; i < new_data.length; i++){
        var share2020 = new_data[i].value / total_2020;
        data_set.push({name: data[i]['Description'], share: share2020})
    }

    console.log(data_set);

    var total_share = 0;
    for(let i = 0 ; i < data_set.length; i++){
        total_share += + data_set[i].share;
    }
    data_set.push({name: 'Other Goods', share:  1 - total_share});
    // console.log(new_data);

    let hover_on = function(d) {
        d3.selectAll(".arc")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", "yellow")
    }

    let hover_off = function(d) {
        d3.selectAll(".arc")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", function (d) {
                return pie_color(d.data.name);
            })
    }

    var arc = pie_g.selectAll(".arc")
        .data(pie(data_set))
        .enter().append("g")
        .attr("class", "arc")


    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return pie_color(d.data.name); }).on("mouseover", hover_on)
        .on("mouseleave", hover_off)
        .append("title")
        .text(function(d) { return "Name: " + d.data.name + " " + " Share: " + d.data.share; });

    var legendRectSize = (radius * 0.06);
    var legendSpacing = radius * 0.05;
    var prefectureData = []

    for(let i = 0; i < data_set.length; i++){
        prefectureData.push({name: data_set[i].name, share: data_set[i].share})
    }

    var offset_legend_text = 160;
    var offset_legend_text_ver = 30;
    var offset_tmp = -100;
    var offset_tmp_ver = -350;
    var pie_chart_legend = arc.selectAll('.legend')
        .data(prefectureData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * pie_color.domain().length / 2;
            var horz = -3 * legendRectSize + offset_tmp;
            var vert = i * height - offset + offset_tmp_ver + offset_legend_text_ver;
            return 'translate(' + horz + ',' + vert + ')';
        });

    pie_chart_legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function(d) { return pie_color(d.name) })
        .style('stroke', function(d) { return pie_color(d.name) });


    pie_chart_legend.append('text')
        .attr('x', legendRectSize + legendSpacing + 10 + offset_legend_text)
        .attr('y', legendRectSize)
        .style("font-size", 11.5)
        .text(function(d) { return d.name; });

    pie_svg.append("g")
        .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
        .append("text")
        .text("Top Five Exported Items in California in 2020")
        .attr("class", "title")

});