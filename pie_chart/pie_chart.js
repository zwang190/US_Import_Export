let default_state = 'CA';
d3.select('#dropdown_menu').select("#menu")
    .on('change', function () {
        default_state = this.value;
        console.log(default_state);
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2017").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2018").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2019").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2020").select("svg").remove();
        create_pie_chart("2017", default_category, "#pie_chart_2017", "#pie1");
        create_pie_chart("2018", default_category, "#pie_chart_2018", "#pie2");
        create_pie_chart("2019", default_category, "#pie_chart_2019", "#pie3");
        create_pie_chart("2020", default_category, "#pie_chart_2020", "#pie4");
    });

let default_category = 'Import';
d3.select('#dropdown_menu').select("#category_menu")
    .on('change', function () {
        default_category = this.value;
        console.log(default_category);
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2017").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2018").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2019").select("svg").remove();
        d3.select("body").select("#dropdown_menu").select("#pie_chart").select("#pie_chart_2020").select("svg").remove();
        create_pie_chart("2017", default_category, "#pie_chart_2017", "#pie1");
        create_pie_chart("2018", default_category, "#pie_chart_2018", "#pie2");
        create_pie_chart("2019", default_category, "#pie_chart_2019", "#pie3");
        create_pie_chart("2020", default_category, "#pie_chart_2020", "#pie4");
    });

function create_pie_chart(input_year, input_category, div, svg_id) {
    d3.csv("pie_chart/ca_export_csv.csv", function (error, data) {

       var pie_svg = d3.select("body").select("#dropdown_menu").select("#pie_chart").select(div).append("svg");
       pie_svg.attr('width', 900)
            .attr('height', 900)

       var width = pie_svg.attr("width"),
        height = pie_svg.attr("height"),
        radius = 250;

        var pie_g = pie_svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var pie_color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#0FCCCB']);

        var pie = d3.pie().value(function (d) {
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

        var grand_data = new Map();
        var grand_data_total = new Map();
        for (let i = 0; i < data.length; i++) {
            var inner_map;
            var inner_map_total;
            var category;

            var state = data[i]['State'];
            var rank = +data[i]['Rank'];
            if (rank !== -1) {
                if (!grand_data.has(state)) {
                    inner_map = new Map();
                    inner_map.set("Import", []);
                    inner_map.set("Export", []);
                    grand_data.set(state, inner_map);
                }

                inner_map = grand_data.get(state);
                category = data[i]['Category'];
                var inner_list = inner_map.get(category);
                inner_list.push({
                    name: data[i]['Description'],
                    value2017: +data[i]['Value2017'],
                    value2018: +data[i]['Value2018'],
                    value2019: +data[i]['Value2019'],
                    value2020: +data[i]['Value2020']
                })
            }

            if (rank === -1) {
                if (!grand_data_total.has(state)) {
                    inner_map_total = new Map();
                    inner_map_total.set("Import", new Map());
                    inner_map_total.set("Export", new Map());
                    grand_data_total.set(state, inner_map_total);
                }
                inner_map_total = grand_data_total.get(state);
                category = data[i]['Category'];
                var inner_inner_map_total = inner_map_total.get(category);
                inner_inner_map_total.set("2017", data[i]['Value2017']);
                inner_inner_map_total.set("2018", data[i]['Value2018']);
                inner_inner_map_total.set("2019", data[i]['Value2019']);
                inner_inner_map_total.set("2020", data[i]['Value2020']);
            }
        }
        // console.log("pie chart data: ")
        console.log(grand_data)
        console.log(grand_data_total)

        var new_data = [];
        var total_value = 0;

        inner_map = grand_data.get(default_state);
        inner_list = inner_map.get(input_category);
        console.log("pie chart")
        console.log(inner_list)
        for (let i = 0; i < inner_list.length; i++) {
            // new_data.push({name: inner_list[i].name, value: +inner_list[i].value2017})
            if(input_year === '2017'){
                new_data.push({name: inner_list[i].name, value: inner_list[i].value2017})
            } else if(input_year === '2018'){
                new_data.push({name: inner_list[i].name, value: inner_list[i].value2018})
            } else if(input_year === '2019'){
                new_data.push({name: inner_list[i].name, value: inner_list[i].value2019})
            } else if(input_year === '2020'){
                new_data.push({name: inner_list[i].name, value: inner_list[i].value2020})
            }
        }

        new_data.sort(function (a, b) {
            return b.value - a.value;
        })

        total_value = grand_data_total.get(default_state).get(input_category).get(input_year);
        console.log("total vlaue " + total_value)

        new_data = new_data.slice(0, 5);
        console.log(new_data);
        var data_set = [];
        for (let i = 0; i < new_data.length; i++) {
            var cur_share = new_data[i].value / total_value;
            data_set.push({name: new_data[i].name, share: cur_share})
        }
        console.log(data_set);

        var total_share = 0;
        for (let i = 0; i < data_set.length; i++) {
            total_share += +data_set[i].share;
        }
        data_set.push({name: 'Other Goods', share: 1 - total_share});
        console.log(data_set);

        let hover_on = function (d) {
            d3.selectAll(".arc")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "yellow")
        }

        let hover_off = function (d) {
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
            .attr("fill", function (d) {
                return pie_color(d.data.name);
            }).on("mouseover", hover_on)
            .on("mouseleave", hover_off)
            .append("title")
            .text(function (d) {
                return "Name: " + d.data.name + " " + " Share: " + d3.format(".0%")(d.data.share);
            });

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) {
                return d3.format(".0%")(d.data.share);
            });

        var legendRectSize = (radius * 0.06);
        var legendSpacing = radius * 0.05;
        var prefectureData = []

        for (let i = 0; i < data_set.length; i++) {
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
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * pie_color.domain().length / 2;
                var horz = -3 * legendRectSize + offset_tmp;
                var vert = i * height - offset + offset_tmp_ver + offset_legend_text_ver;
                return 'translate(' + horz + ',' + vert + ')';
            });

        pie_chart_legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function (d) {
                return pie_color(d.name)
            })
            .style('stroke', function (d) {
                return pie_color(d.name)
            });


        pie_chart_legend.append('text')
            .attr('x', legendRectSize + legendSpacing + 10 + offset_legend_text)
            .attr('y', legendRectSize)
            .style("font-size", 11.5)
            .text(function (d) {
                return d.name;
            });

        pie_svg.append("g")
            .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
            .append("text")
            .text("Top Five " + input_category + " Items in " + default_state + " in " + input_year)
            .attr("class", "title")
    });
}