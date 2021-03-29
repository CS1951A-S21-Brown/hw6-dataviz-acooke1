const NUM_EXAMPLES = 10;

let svg_1 = d3.select('#graph1')
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x_1 = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y_1 = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef_1 = svg_1.append("g");
let y_axis_label_1 = svg_1.append("g");

let x_axis_text_1 = svg_1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
        ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Global Sales");

let y_axis_text_1 = svg_1.append("text")
    .attr("transform", `translate(-100, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title_1 = svg_1.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData_1(year) {
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

        let color_1 = d3.scaleOrdinal()
            .domain(data.map(function(d) {
                return d["Name"]
            }))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
        
        x_1.domain([0, d3.max(data, function(d) { return parseFloat(d['Global_Sales'], 10) })]);
        y_1.domain(data.map(d => d['Name']));

        y_axis_label_1.call(d3.axisLeft(y_1).tickSize(0).tickPadding(10));

        let bars_1 = svg_1.selectAll("rect").data(data);

        bars_1.enter()
            .append("rect")
            .merge(bars_1)
            .transition()
            .duration(1000)
            .attr("x", x_1(0))
            .attr("y", function(d) { return y_1(d['Name']) })
            .attr("width", function(d) { return x_1(d['Global_Sales']) })
            .attr("height",  y_1.bandwidth())
            .attr('fill', function(d){
                return(color_1(d["Global_Sales"])) 
            });

        let sales_1 = countRef_1.selectAll("text").data(data);

        sales_1.enter()
            .append("text")
            .merge(sales_1)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x_1(d['Global_Sales']) + 10 })
            .attr("y", function(d) { return y_1(d['Name']) + 10 })
            .style("text-anchor", "start")
            .text(function(d) { return d['Global_Sales'] });

        //y_axis_text.text('Name');

        if (!(year == null) && !(year.trim() == "")) {
            title_1.text("Top 10 Games of ".concat(year));
        } else {
            title_1.text("Top 10 Games of All Time");
        }

        bars_1.exit().remove();
        sales_1.exit().remove();
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