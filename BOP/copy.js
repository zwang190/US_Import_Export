let data_array = [];
let data_map;

const margin = {top: 90, bottom: 30, left: 95, right: 135}
const width = 1000;
const height = 450;
const padding = 50;

let categories = ['Import', 'Export'];

d3.csv("historical_BOP1.csv", function (data) {

    for (var i = 0; i < data.length; i++) {
        if(categories.includes(data[i]['Category'])) {
            data_array.push({
                category: data[i]['Category'],
                year: data[i]['Year'],
                total: data[i]['Total'],
                goods: data[i]['Goods_BOP'],
                services: data[i]['Services']
            });
        }
    }
    console.log(data_array);
    data_map = new Map();
    data_map.set("Export", []);
    data_map.set("Import", []);
    for(let i = 0; i < data_array.length; i++){
        var inner_list = data_map.get(data_array[i].category);
        inner_list.push(data_array[i]);
    }
    // data_map = d3.group(data_array, d => d.category);
    console.log(data_map);

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var color = d3
        .scaleOrdinal(d3.schemeAccent)
        .domain(categories)

    var line_chart = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var k = 1;
    var j = 0;
    var y_const = 20;
    var x_const = 150;
    var offset = 25;
    for (let i = 0; i < categories.length; i++) {
        var country = categories[i];
        line_chart.append("text").attr("x", j * x_const + padding + offset).attr("y", 0 - y_const * k).style("font-size", "14px").attr("alignment-baseline", "middle").text(country);
        line_chart.append("circle").attr("cx", j * x_const + padding).attr("cy", 0 - y_const * k).attr("r", 6).style("fill", 'green');
        k++;
        if (k === 4) {
            k = 1;
            j++;
        }
    }

    inner_list = data_map.get("Export")
    var years = []
    for(let i = 0; i < inner_list.length; i++){
        years.push(inner_list[i].year);
    }
    console.log(years);

    var x_scale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

    var y_scale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 3500000]);

    var y_axis = d3.axisLeft()
        .scale(y_scale)
    var x_axis = d3.axisBottom()
        .scale(x_scale)

    line_chart.selectAll('path')
        .data(data_map)
        .enter()
        .append("path")
        .attr("stroke", function (d) {
            return "red"
        })
        .style("fill", "red")
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) {
                    return x_scale(d.year);
                })
                .y(function (d) {
                    return y_scale(d.total);
                })(d[1])
        })

    line_chart.append('g')
        .call(y_axis);
    line_chart.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x_axis);
})