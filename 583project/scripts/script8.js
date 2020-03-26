console.log(forwards);
console.log(attackingMids);
console.log(centralMids);
console.log(fullBacks);
console.log(centerBacks);

let playerData = [];
gatherData(dataset);

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
        switch(data.position) {
            case "FW":
                dotColor = "#003f5c";
                break;
            case "AM":
                dotColor = "#444e86";
                break;
            case "CM":
                dotColor = "#955196";
                break;
            case "DM":
                dotColor = "#dd5182";
                break;
            case "FB":
                dotColor = "#ff6e54";
                break;
            case "CB":
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

let colors = ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"]
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
                legendText = "Forward";
                break;
            case "#444e86":
                legendText = "Attacking Midfielder";
                break;
            case "#955196":
                legendText = "Central Midfielder";
                break;
            case "#dd5182":
                legendText = "Defensive Midfielder";
                break;
            case "#ff6e54":
                legendText = "Full Back";
                break;
            case "#ffa600":
                legendText = "Centre Back";
                break;
        }
        return legendText;
    });


function gatherData(positionGroup) {
    for (let player in positionGroup) {
        playerData.push({
            player: player,
            tackles: positionGroup[player].tackles,
            succDribbles: positionGroup[player].succDribbles,
            position: positionGroup[player].position
        })
    }
}
