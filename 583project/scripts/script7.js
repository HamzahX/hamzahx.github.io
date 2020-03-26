let forwardData = [];
let forwardStats = ['npg', 'assists'];
let forwardLabels = ['Non-Penalty Goals per90', 'Assists per90'];
console.log(forwards);
let tempData = [];
//construct array of forwards and their NPG (Non-Penalty Goal) statistics
for (let forward in forwards) {
    tempData.push({
        player: forward,
        goals: forwards[forward].npg,
        assists: forwards[forward].assists
    })
}
console.log(tempData);
tempData.sort((a, b) => a.assists - b.assists);
let colorScale = d3.scaleLinear()
    .domain(d3.extent(tempData, function(data){ return data.assists}))
    .range([0, 1]);

let margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};
let totalWidth = 960;
let totalHeight = 500;
let innerWidth = totalWidth - margin.left - margin.right;
let innerHeight = totalHeight - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, innerWidth]);
var y = d3.scaleLinear().range([innerHeight, 0]);

var svg = d3.select("#npg").append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data
x.domain(d3.extent(tempData, function(d) { return d.goals; }));
y.domain([0, d3.max(tempData, function(d) { return d.assists; })]);

// tool tip for hover
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// tooltip mouseover event handler
var mouseover = function(d) {
    tooltip
        .style("opacity", 1)
};

// removes tooltip
var mouseleave = function(d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}


svg.selectAll("dot")
    .data(tempData)
    .enter().append("circle")
    .attr("r", 3)
    .attr("cx", function(d) { return x(d.goals); })
    .attr("cy", function(d) { return y(d.assists); })
    .style("fill", function(data) {
        let base_color = colorScale(data.assists)
        return d3.interpolateInferno(base_color)
    });
    // .on("mouseover", function(d) {
    //     tooltip.transition()
    //         .duration(200)
    //         .style("opacity", .9);
    //     tooltip.html("testing")
    //         .style("left", (d3.event.pageX + 5) + "px")
    //         .style("top", (d3.event.pageY - 28) + "px");
    // })
    // .on("mouseleave", mouseleave);


// x axis
svg.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("class", "label")
    .attr("x", innerWidth)
    .attr("y", -6)
    .style("text-anchor", "end")
    .style("fill", "black")
    .style("font-family", "sans-serif")
    .style("font-weight", "bold")
    .text("Non-Penalty Goals per90");

// y axis
svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .style("font-family", "sans-serif")
    .style("font-weight", "bold")
    .text("Assists per90");



