const NUM_EXAMPLES = 10;

let svg_1 = d3.select('#graph1')
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef = svg_1.append("g");
let y_axis_label = svg_1.append("g");

let x_axis_text = svg_1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
        ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Global Sales");

let y_axis_text = svg_1.append("text")
    .attr("transform", `translate(-100, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title = svg_1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData_1(year) {
    console.log('setting_data_graph_1')
    d3.csv(filename).then(function(data) {
        data = graph_1_cleanup(data, year, function (a, b) {
            if (a['rank'] < b['rank']) {
                return -1
            } else if (a['rank'] > b['rank']) {
                return 1
            } else {
                return 0
            }
        }, NUM_EXAMPLES);
        
        x.domain([0, d3.max(data, function(d) { return parseInt(d['Global_Sales'], 10) })]);
        y.domain(data.map(d => d['Name']));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg_1.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", function(d) { return y(d['Name']) })
            .attr("width", function(d) { return x(d['Global_Sales']) })
            .attr("height",  y.bandwidth());

        let sales = countRef.selectAll("text").data(data);

        sales.enter()
            .append("text")
            .merge(sales)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d['Global_Sales']) + 10 })
            .attr("y", function(d) { return y(d['Name']) + 10 })
            .style("text-anchor", "start")
            .text(function(d) { return d['Global_Sales'] });

        //y_axis_text.text('Name');

        if (!(year == null) && !(year.trim() == "")) {
            title.text("Top 10 Games of ".concat(year));
        } else {
            title.text("Top 10 Games of All Time");
        }

        bars.exit().remove();
        sales.exit().remove();
    });
}

function graph_1_cleanup(data, year, comparator, num_examples) {
    if (!(year == null) && !(year.trim() == "")) {
        data = data.filter(function(d) { return (d['Year'] == year) })
    }
    data = data.sort(comparator)
    return data.splice(0, num_examples)
}

setData_1(null);