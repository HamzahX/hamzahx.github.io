console.log(dataset)
let selectedNations = ["Spain", "Brazil", "England", "France", "Germany", "Argentina", "Portugal", "Italy"]
let playerData = [];


for (let player in dataset) {
    // console.log(dataset[player].nationality)
    if (selectedNations.includes(dataset[player].nationality)) {
        playerData.push({
            player: player,
            tackles: dataset[player].tackles,
            succDribbles: dataset[player].succDribbles,
            nationality: dataset[player].nationality
        });
    }
}

console.log(playerData)

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
x.domain(d3.extent(playerData, function(d) { return d.succDribbles; }));
y.domain([0, d3.max(playerData, function(d) { return d.tackles; })]);

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
};

svg.selectAll("dot")
    .data(playerData)
    .enter().append("circle")
    .attr("r", 3)
    .attr("cx", function(d) { return x(d.succDribbles); })
    .attr("cy", function(d) { return y(d.tackles); })
    .style("fill", function(data) {
        let dotColor = "";
        switch(data.nationality) {
            case "Spain":
                dotColor = "#003f5c";
                break;
            case "Brazil":
                dotColor = "#2f4b7c";
                break;
            case "England":
                dotColor = "#665191";
                break;
            case "France":
                dotColor = "#a05195";
                break;
            case "Germany":
                dotColor = "#d45087";
                break;
            case "Argentina":
                dotColor = "#f95d6a";
                break;
            case "Portugal":
                dotColor = "#ff7c43";
                break;
            case "Italy":
                dotColor = "#ffa600";
                break;
        }
        return dotColor;
    });
    // .on("mouseover", function(d) {
    //     tooltip.transition()
    //         .duration(200)
    //         .style("opacity", .9);
    //     tooltip.html(
    //         "<b>Player: </b>" + d.player +
    //         "<br/>" +
    //         "<b>Dribbles: </b>" + d.succDribbles +
    //         "<br/>" +
    //         "<b>Tackles: </b>" + d.tackles)
    //         .style("font-family", "sans-serif")
    //         .style("font-size", "10px")
    //         .style("left", (d3.event.pageX + 15) + "px")
    //         .style("top", (d3.event.pageY - 10) + "px");
    // })
    // .on("mousemove", function(d) {
    //     tooltip.html(
    //         "<b>Player: </b>" + d.player +
    //         "<br/>" +
    //         "<b>Dribbles: </b>" + d.succDribbles +
    //         "<br/>" +
    //         "<b>Tackles: </b>" + d.tackles)
    //         .style("font-family", "sans-serif")
    //         .style("font-size", "10px")
    //         .style("left", (d3.event.pageX + 15) + "px")
    //         .style("top", (d3.event.pageY - 10) + "px");
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
    .text("Successful Dribbles per90");

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
    .text("Tackles per90");

let colors = ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"]
// draw legend
var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", innerWidth - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) {
        return d;
    });

// draw legend text
legend.append("text")
    .attr("x", innerWidth - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-family", "sans-serif")
    .text(function(d) {
        let legendText = "";
        switch(d) {
            case "#003f5c":
                legendText = "Spain";
                break;
            case "#2f4b7c":
                legendText = "Brazil";
                break;
            case "#665191":
                legendText = "England";
                break;
            case "#a05195":
                legendText = "France";
                break;
            case "#d45087":
                legendText = "Germany";
                break;
            case "#f95d6a":
                legendText = "Argentina";
                break;
            case "#ff7c43":
                legendText = "Portugal";
                break;
            case "#ffa600":
                legendText = "Italy";
                break;
        }
        return legendText;
    });
