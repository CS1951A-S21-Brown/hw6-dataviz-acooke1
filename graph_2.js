let svg_2 = d3.select('#graph2')
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleLinear()
    .range([0, graph_2_width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef = svg_2.append("g");
let y_axis_label = svg_2.append("g");

let x_axis_text = svg_2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
        ${(graph_2_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Game");

let y_axis_text = svg_2.append("text")
    .attr("transform", `translate(-110, ${(graph_2_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title = svg_2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setData_2(region) {
    d3.csv(filename).then(function(data) {
        data = graph_2_cleanup(data, region);

        x.domain([0, d3.max(data, function(d) { return d[region] })]);
        y.domain(data.map(d => d['Name']));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let bars = svg_2.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", function(d) { return y(d['Name']) })
            .attr("width", function(d) { return x(d[region]) })
            .attr("height",  y.bandwidth());

        let sales = countRef.selectAll("text").data(data);

        sales.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d[region]) + 10 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) { return y(d['Name']) + 10 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) { return d[region] });           // HINT: Get the count of the artist

        y_axis_text.text(region);
        title.text("Top 10 Genres");

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
}

function graph_2_cleanup(data, region) {

    const regionComparator = (a, b) => {
        if (a[region] < b[region]) {
            return -1
        } else if (a[region] > b[region]) {
            return 1
        } else {
            return 0
        }
    }

    const reduced_data = {}

    data.map(function(d) {
        reduced_data[d["Genre"]] = reduced_data[d["Genre"]] + d[region]
    })

    console.log(reduced_data)

    data = data.sort(regionComparator)
    return data
}