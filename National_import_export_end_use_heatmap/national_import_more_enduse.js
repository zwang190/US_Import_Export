let grand_data;
let data_array = []
let y_labels = [];

const data_nums = 10;
const years = ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];

d3.csv("National_import_end_use_csv.csv", function (data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].Name === 'TOTAL') {
            break;
        }
        data_array.push({
            name: data[i].Name,
            val2011: data[i].Value2011,
            val2012: data[i].Value2012,
            val2013: data[i].Value2013,
            val2014: data[i].Value2014,
            val2015: data[i].Value2015,
            val2016: data[i].Value2016,
            val2017: data[i].Value2017,
            val2018: data[i].Value2018,
            val2019: data[i].Value2019,
            val2020: data[i].Value2020
        })
    }
    console.log(data_array);

    data_array.sort(function (a, b) {
        return (b.val2011 + b.val2012 + b.val2013 + b.val2014 + b.val2015 + b.val2016 + b.val2017 + b.val2018 + b.val2019 + b.val2020) -
            (a.val2011 + a.val2012 + a.val2013 + a.val2014 + a.val2015 + a.val2016 + a.val2017 + a.val2018 + a.val2019 + a.val2020)
    })
    console.log(data_array);

    grand_data = new Map();
    for (let i = 0; i < data_nums; i++) {
        var elem = data_array[i];
        var inner_list = [];
        inner_list.push({category: elem.name, year: 2011, value: elem.val2011 / 1000});
        inner_list.push({category: elem.name, year: 2012, value: elem.val2012 / 1000});
        inner_list.push({category: elem.name, year: 2013, value: elem.val2013 / 1000});
        inner_list.push({category: elem.name, year: 2014, value: elem.val2014 / 1000});
        inner_list.push({category: elem.name, year: 2015, value: elem.val2015 / 1000});
        inner_list.push({category: elem.name, year: 2016, value: elem.val2016 / 1000});
        inner_list.push({category: elem.name, year: 2017, value: elem.val2017 / 1000});
        inner_list.push({category: elem.name, year: 2018, value: elem.val2018 / 1000});
        inner_list.push({category: elem.name, year: 2019, value: elem.val2019 / 1000});
        inner_list.push({category: elem.name, year: 2020, value: elem.val2020 / 1000});
        grand_data.set(elem.name, inner_list);
    }

    console.log(grand_data);

    data_array = []
    for (let category of grand_data.keys()) {
        y_labels.push(category);
        var inner_list = grand_data.get(category);
        data_array.push(...inner_list);
    }
    console.log("data_array " + data_array);

    const margins = {top: 250, bottom: 40, left: 110, right: 0};
    var width = 900;
    var height = 400;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom);

    var heatmap = svg.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    var x_scale = d3.scaleBand()
        .range([0, width])
        .domain(years)
        .padding(0.02);

    var y_scale = d3.scaleBand()
        .domain(y_labels)
        .range([0, height])
        .padding(0.02);

    var color_scale = d3.scaleLinear()
        .domain([0, 200000])
        .range(["blue", "red"]);

    let x_axis = d3.axisBottom().scale(x_scale);
    let y_axis = d3.axisLeft().scale(y_scale);

    svg.append("g")
        .attr("class", "legend")
        .attr('font-size', '10px')
        .attr('transform', 'translate(150,150)');

    var legend = d3.legendColor()
        .shapeHeight(50)
        .shapeWidth(50)
        .shape(40)
        .cells(15)
        .orient('horizontal')
        .scale(color_scale);

    svg.select(".legend")
        .call(legend);

    heatmap.append('g')
        .call(y_axis);

    heatmap.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x_axis);

    heatmap.selectAll('rect')
        .data(data_array, function (d) {
            return d;
        })
        .enter()
        .append('rect')
        .attr('height', y_scale.bandwidth())
        .attr('width', x_scale.bandwidth())
        .attr('x', function (d) {
            return x_scale(d.year);
        })
        .attr('y', function (d) {
            return y_scale(d.category);
        })
        .attr('fill', function (d) {
            return color_scale(d.value)
        });
})

//https://www.d3-graph-gallery.com/graph/heatmap_basic.html
//http://bl.ocks.org/PBrockmann/5e7b2ce5edf2e326c88800d4303da0dd
//https://blockbuilder.org/achebrol/31833ec3fb7554d2b8e01e1ab32a09d1
//http://bl.ocks.org/tjdecke/5558084
//https://www.d3-graph-gallery.com/graph/heatmap_style.html
//https://stackoverflow.com/questions/40246490/d3-legend-not-appearing-due-to-legendcolor
//http://using-d3js.com/04_08_legends.html