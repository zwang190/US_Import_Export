export {
    create_bar_chart
}

function create_bar_chart(input_state, input_year, input_category, div, item_idx) {
    d3.csv("pie_chart/state_import_export_items.csv", function (data) {
        console.log("bar chart has bee changed")
        let grand_data = new Map()
        let x_labels = ['2017', '2018', '2019', '2020'];
        let y_labels = [];
        let tmp = -1;

        for (let i = 0; i < data.length; i++) {
            var inner_map;
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
        }

        console.log(grand_data)
        var new_data = [];
        inner_map = grand_data.get(input_state);
        inner_list = inner_map.get(input_category);
        console.log(inner_list)
        for (let i = 0; i < inner_list.length; i++) {
            // new_data.push({name: inner_list[i].name, value: +inner_list[i].value2017})
            // if(input_year === '2017'){
            //     new_data.push({name: inner_list[i].name, value: inner_list[i].value2017})
            // } else if(input_year === '2018'){
            //     new_data.push({name: inner_list[i].name, value: inner_list[i].value2018})
            // } else if(input_year === '2019'){
            //     new_data.push({name: inner_list[i].name, value: inner_list[i].value2019})
            // } else if(input_year === '2020'){
            //     new_data.push({name: inner_list[i].name, value: inner_list[i].value2020})
            // }
            new_data.push({name: inner_list[i].name, value2017: +inner_list[i].value2017, value2018: +inner_list[i].value2018,
                value2019: +inner_list[i].value2019, value2020: +inner_list[i].value2020});
        }

        new_data.sort(function (a, b) {
            return b.value2017 - a.value2017;
        });

        new_data = new_data.slice(0, 4);
        console.log(new_data)

        const margins = {top: 40, bottom: 40, left: 60, right: 70}
        var width = 400;
        var height = 800;
        var bar_padding = 7;
        var bar_width = (width / 4);

        var bar_svg = d3.select('body').select("#dropdown_menu").select("#bar_chart").select(div)
            .append('svg')
            .attr('width', width + margins.left + margins.right)
            .attr('height', height + margins.top + margins.bottom);

        var bar_chart = bar_svg.append('g')
            .attr('transform', 'translate(' + margins.right + ',' + margins.top + ')');

        bar_svg.append("text")
            .attr('x', 0)
            .attr("y", 30)
            .text("Money flow (millions of dollars)")
            .attr('font-family', 'sans-serif');

        var elem = new_data[item_idx];

        y_labels.push(elem.value2017);
        y_labels.push(elem.value2018);
        y_labels.push(elem.value2019);
        y_labels.push(elem.value2020);

        var bar_color_scale =
            d3.scaleOrdinal(d3.schemeCategory10).domain(['2017', '2018', '2019', '2020']);

        var x_scale = d3.scaleBand()
            .rangeRound([0, width])
            .domain(x_labels);

        var y_scale = d3.scaleLinear()
            .domain([0, d3.max(y_labels)])
            .range([height, 0]);

        let x_axis = d3.axisBottom(x_scale);
        let y_axis = d3.axisLeft(y_scale);

        var legend = d3.legendColor()
            .shapeHeight(25)
            .shapeWidth(50)
            .shape(40)
            .orient('horizontal')
            .scale(bar_color_scale);

        bar_svg.append("g")
            .attr("class", "legend")
            .attr('font-size', '10px')
            .attr('transform', 'translate(200,15)');

        bar_chart.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(x_axis);

        bar_chart.append('g')
            .call(y_axis);

        let hover_on = function (d) {
            d3.selectAll(".bar")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "black")
                .style('stroke-width', '3px')
        }

        let hover_off = function (d, i) {
            d3.selectAll(".bar")
                .transition()
                .duration(200)

            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "white")
        }

        bar_chart.selectAll('.bar')
            .data(y_labels)
            .enter()
            .append('rect')
            .attr('y', function (d) {
                return y_scale(d);
            })
            .attr('width', x_scale.bandwidth() - bar_padding)
            .attr('height', function (d) {
                return height - y_scale(d);
            })
            .attr('transform', function (d, i) {
                var bar = [bar_width * i + 2, 0];
                return 'translate(' + bar + ')';
            })
            .attr('fill', 'blue')
            .on("mouseover", hover_on)
            .on("mouseleave", hover_off)
            .append("title")
            .text(function (d) {
                return d3.format("$,")(d);
            });

        var ver_offset = 60;
        var hor_offset = 60;
        bar_svg.append("text")
            .attr('x', width + hor_offset)
            .attr("y", height + ver_offset)
            .text("Year")
            .attr('font-family', 'sans-serif');
    })
}