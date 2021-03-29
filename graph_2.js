const salesComparator = (a, b) => {
    if (a["Sales"] > b["Sales"]) {
        return -1
    } else if (a["Sales"] < b["Sales"]) {
        return 1
    } else {
        return 0
    }
}

let svg_2 = d3.select('#graph2')
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${graph_2_width/2 - 100}, ${graph_2_height/2})`);

let pie_pieces_2 = svg_2.append("g");

let countRef_2 = svg_2.append("g");

let arc_2 = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(graph_2_width, graph_2_height) / 2 - 1)

const radius_2 = Math.min(graph_2_width, graph_2_height) / 2 * 0.8;

const arcLabel_2 = d3.arc().innerRadius(radius_2).outerRadius(radius_2);

let title_2 = svg_2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2 + 75}, ${-50})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

var pie = d3.pie()
    .sort(null)
    .value(d => {
        return d.Sales
    });

function setData_2(region) {
    d3.csv(filename).then(function(data) {
        data = graph_2_cleanup(data, region);

        data_ready = pie(data);

        let total = data.reduce(function(acc, d) { return acc + d.Sales }, 0);

        let color_2 = d3.scaleOrdinal()
            .domain(data.map(d => d.Genre))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        let pieces_2 = pie_pieces_2.selectAll("path").data(data_ready);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        pieces_2.enter().append("g")
            .append("path")
            .attr("stroke", "white")
            .merge(pieces_2)
            .attr("d", arc_2)
            .attr('fill', d => color_2(d.data.Genre))
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.85');
                div.transition()
                     .duration(50)
                     .style("opacity", 1);
                let num = d.data.Genre + " (" + ((d.value / total) * 100).toFixed(1) + '%)';
                div.html(num)
                     .style("left", (d3.event.pageX + 10) + "px")
                     .style("top", (d3.event.pageY - 15) + "px");
            })
           .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
            div.transition()
                 .duration('50')
                 .style("opacity", 0);
            });

        let labels_2 = countRef_2.selectAll("text").data(data_ready);

        let legend_boxes = countRef_2.selectAll("rect").data(data_ready);
        
        legend_boxes.enter().append("rect").merge(legend_boxes)
            .attr("transform", function(d,i){
                return `translate(` + (graph_2_width/2 - 110) + "," + (i * 15 - 90) + `)`;
            })
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d) {
              return color_2(d.data.Genre);
            });
        
        labels_2.enter().append("text").merge(labels_2)
            .attr("transform", function(d,i){
                return `translate(` + (graph_2_width/2 - 110) + "," + (i * 15 - 90) + `)`;
            })
            .text((d) => {
                return d.data.Genre
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);
            

        pieces_2.exit().remove();
        labels_2.exit().remove();
        legend_boxes.exit().remove();
    });
}

function graph_2_cleanup(data, region) {

    data = data.reduce(function(acc, d) {
        if (acc[d["Genre"]] == null) {
            acc[d["Genre"]] = parseFloat(d[region])
        } else {
            acc[d["Genre"]] = acc[d["Genre"]] + parseFloat(d[region])
        }
        return acc
    }, {})

    const reduced_data = []

    Object.keys(data).map(function(d) {
        reduced_data.push({"Genre" : d, "Sales" : data[d]})
    })

    return reduced_data.sort(salesComparator)
}

setData_2("Global_Sales")