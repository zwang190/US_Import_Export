let grand_data;
let data_array = []

const m = new Map([["California", "CA"], ["Texas", "TX"], ["New York", "NY"], ["Massachusetts", "MA"], ["Oregon", "OR"], ["Louisiana", "LA"], ["New Mexico", "NM"],
    ["New Jersey", "NJ"], ["Pennsylvania", "PA"], ["North Dakota", "ND"]]);
const states = ["California", "Texas", "New York", "Massachusetts", "Oregon", "Louisiana"];
const years = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001'];
const y_labels = [];
grand_data = new Map();

d3.csv("state_crime.csv", function (file) {
    return {
        state: file['State'],
        year: file['Year'],
        rate: file['Data.Rates.Violent.All'],
    };
}).then(function (data) {
    data.forEach(elem => {
        var state = elem.state;

        if (states.includes(state)) {
            var state_abb = m.get(state);
            if (!grand_data.has(state_abb)) {
                grand_data.set(state_abb, new Map());
            }

            let inner_map = grand_data.get(state_abb);
            var year = elem.year;
            if (years.includes(year)) {
                inner_map.set(year, elem.rate);
            }
        }
    });

    for (let state of grand_data.keys()) {
        y_labels.push(state);
        var inner_map = grand_data.get(state);
        for (let year of inner_map.keys()) {
            data_array.push({state: state, year: year, rate: inner_map.get(year)});
        }
    }
    console.log(data_array);
    console.log(y_labels);

    const margins = {top: 250, bottom: 40, left: 60, right: 0};
    var width = 700;
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
        .domain([0, 1350])
        .range(["red", "blue"]);

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
        .cells(10)
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
            return y_scale(d.state);
        })
        .attr('fill', function (d) {
            return color_scale(d.rate)
        });
})