d3.csv("state_level_goods_bar_chart/export_tx.csv", function (data) {
    let grand_data = new Map()
    let x_labels = ['2017', '2018', '2019', '2020'];
    let y_labels = [];
    let tmp = -1;

    for(let i = 0; i < data.length; i++) {
        if(data[i]['rank'] == -1 || data[i]['rank'] == 0) {
            continue;
        }

        var name = data[i]['abbreviatn'];
        var list = []

        list.push({val2017: data[i]['val2017'], share17: data[i]['share17']});
        list.push({val2018: data[i]['val2018'], share18: data[i]['share18']});
        list.push({val2019: data[i]['val2019'], share19: data[i]['share19']});
        list.push({val2020: data[i]['val2020'], share20: data[i]['share20']});

        grand_data.set(name, list);
        if (data[i]['rank'] > 5) {
            break;
        }
    }

    const margins = {top: 40, bottom: 40, left: 60, right: 70}
    var width = 400;
    var height = 800;
    var bar_padding = 7;
    var bar_width = (width / 4);

    var bar_svg = d3.select('body').select("#bar_chart")
        .append('svg')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom);

    var bar_chart = bar_svg.append('g')
        .attr('transform', 'translate(' + margins.right + ',' + margins.top + ')');

    bar_svg.append("text")
        .attr('x',0)
        .attr("y", 30)
        .text("Money flow (millions of dollars)")
        .attr('font-family','sans-serif');

    var inner_list = grand_data.get('PROCESSORS AND CONTROLLERS, ELECTRONIC INTEGRATED');

    y_labels.push(inner_list[0].val2017);
    y_labels.push(inner_list[1].val2018);
    y_labels.push(inner_list[2].val2019);
    y_labels.push(inner_list[3].val2020);

    var bar_color_scale =
        d3.scaleOrdinal(d3.schemeCategory10).domain(['2017', '2018', '2019', '2020']);

    var x_scale = d3.scaleBand()
        .rangeRound([0, width])
        .domain(x_labels);

    var y_scale = d3.scaleLinear()
        .domain([0, 12000])
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

    let hover_on = function(d) {
        d3.selectAll(".bar")
            .transition()
            .duration(200)

        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "black")
            .style('stroke-width', '3px')
    }

    let hover_off = function(d, i) {
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
        .attr('fill', function (d, i) {
            if (i === 0) {
                return bar_color_scale('2017');
            } else if(i === 1) {
                return bar_color_scale('2018');
            } else if (i === 2) {
                return bar_color_scale('2019');
            } else if(i === 3){
                return bar_color_scale('2020');
            }
        })
        .on("mouseover", hover_on)
        .on("mouseleave", hover_off)
        .append("title")
        .text(function(d) { return d3.format("$,")(d); });

    var ver_offset = 60;
    var hor_offset = 60;
    bar_svg.append("text")
        .attr('x',width + hor_offset)
        .attr("y", height + ver_offset)
        .text("Year")
        .attr('font-family','sans-serif');
})