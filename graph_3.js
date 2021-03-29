let svg_3 = d3.select('#graph3')
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x_3 = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

let y_3 = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef_3 = svg_3.append("g");
let y_axis_label_3 = svg_3.append("g");

let x_axis_text_3 = svg_3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
        ${(graph_3_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Global Sales");

let y_axis_text_3 = svg_3.append("text")
    .attr("transform", `translate(-100, ${(graph_3_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title_3 = svg_3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData_3(genre) {
    d3.csv(filename).then(function(data) {
        data = graph_3_cleanup(data, genre, NUM_EXAMPLES);

        let color_3 = d3.scaleOrdinal()
            .domain(data.map(function(d) {
                return d["Publisher"]
            }))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
        
        x_3.domain([0, d3.max(data, function(d) { return parseFloat(d['Sales'], 10) })]);
        y_3.domain(data.map(d => d['Publisher']));

        y_axis_label_3.call(d3.axisLeft(y_3).tickSize(0).tickPadding(10));

        let bars_3 = svg_3.selectAll("rect").data(data);

        bars_3.enter()
            .append("rect")
            .merge(bars_3)
            .transition()
            .duration(1000)
            .attr("x", x_3(0))
            .attr("y", function(d) { return y_3(d['Publisher']) })
            .attr("width", function(d) { return x_3(d['Sales']) })
            .attr("height",  y_3.bandwidth())
            .attr('fill', function(d){
                return(color_3(d["Sales"])) 
            });

        let sales_3 = countRef_3.selectAll("text").data(data);

        sales_3.enter()
            .append("text")
            .merge(sales_3)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x_3(d['Sales']) + 10 })
            .attr("y", function(d) { return y_3(d['Publisher']) + 10 })
            .style("text-anchor", "start")
            .text(function(d) { return d['Sales'].toFixed(2) });

        title_3.text("Top 10 Publishers of ".concat(genre));

        bars_3.exit().remove();
        sales_3.exit().remove();
    });
}

function graph_3_cleanup(data, genre, num_examples) {
    data = data.filter(function(d) { return (d['Genre'] == genre) })

    data = data.reduce(function(acc, d) {
        if (acc[d["Publisher"]] == null) {
            acc[d["Publisher"]] = parseFloat(d["Global_Sales"])
        } else {
            acc[d["Publisher"]] = acc[d["Publisher"]] + parseFloat(d["Global_Sales"])
        }
        return acc
    }, {})

    let reduced_data = []

    Object.keys(data).map(function(d) {
        reduced_data.push({"Publisher" : d, "Sales" : data[d]})
    })

    reduced_data = reduced_data.sort(salesComparator)
    return reduced_data.splice(0, num_examples)
}

setData_3("Action");