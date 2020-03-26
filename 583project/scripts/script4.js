let forwardStats = ['npg', 'shots', 'conversionRate', 'assists', 'keyPasses', 'succDribbles', 'dribbleSuccRate'];
let forwardLabels = ['Non-Penalty Goals per90', 'Shots per90', 'Conversion Rate', 'Assists per90', 'Key Passes per90', 'Successful Dribbles per90', 'Dribble Success Rate'];

//array of arrays, one for each stat
let leftVRightData = [];
let forwardData = [];

for (let i=0; i<forwardStats.length; i++){ //for all 7 forward stats

    //initialize an array for the left and right footed averages
    leftVRightData[i] = [];

    //retrieve the values for left footed forwards
    let leftFootedValues = [];
    for (let player in leftFootedPlayers){
        if (player in forwards){
            leftFootedValues.push(leftFootedPlayers[player][forwardStats[i]])
        }
    }
    //retrieve the values for right footed forwards
    let rightFootedValues = [];
    for (let player in rightFootedPlayers){
        if (player in forwards){
            rightFootedValues.push(rightFootedPlayers[player][forwardStats[i]])
        }
    }
    console.log(leftFootedValues, rightFootedValues);

    //calculate the averages for both groups
    let sum = leftFootedValues.reduce((a, b) => a + b, 0);
    let leftFootedAverage = (sum / leftFootedValues.length) || 0;

    sum = rightFootedValues.reduce((a, b) => a + b, 0);
    let rightFootedAverage = (sum / rightFootedValues.length) || 0;
    leftVRightData[i] = [leftFootedAverage, rightFootedAverage];

    //construct an array with the values for all forwards
    //used later to calculate the extent of the scales
    forwardData[i] = [];
    for (let forward in forwards){
        forwardData[i].push({
            player: forward,
            data: forwards[forward][forwardStats[i]],
            y: 0,
            percentileRank: 0
        });
    }
}

console.log(leftVRightData);

//set chart constants
let margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};
let totalWidth = 600;
let totalHeight = 150;
let innerWidth = totalWidth - margins.right - margins.left;
let innerHeight = totalHeight - margins.top - margins.bottom;

let v4Canvas = document.getElementById('v4-canvas');

//create a container for the charts
let container = document.createElement('div');
container.className = 'singleAxisScatterContainer';
v4Canvas.appendChild(container);

//iterate through the arrays for each stat and draw the chart for them
for (let i=0; i<leftVRightData.length; i++){

    //create a div for each chart
    let div = document.createElement('div');
    div.id = forwardStats[i];
    div.className = 'singleAxisScatter';
    container.appendChild(div);

    //get the array for the current stat
    let currentStat = leftVRightData[i];
    let currentExtent = forwardData[i];

    console.log(currentStat);

    let xScale = d3.scaleLinear()
        .domain(d3.extent(currentExtent, function(data){ return data.data }))
        .range([margins.left, innerWidth])
        .nice();

    let xAxis = d3.axisBottom(xScale);

    let svg = d3.select(`#${forwardStats[i]}`)
        .append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight);
    // .call(d3.zoom().on("zoom", zoom));

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

    let markers = svg.append("g")
        .attr("id", `${forwardStats[i]}Markers`)
        .attr("transform", `translate(${margins.left}, ${innerHeight - 25})`)
        .selectAll("circle")
        .data(currentStat)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (data) {return xScale(data)})
        .attr("cy", 0)
        .style("fill", function(data, i) {
            if (i === 0){
                return "blue"
            }
            else {
                return "red"
            }
        });
    // .on("mouseover", function(d) {
    //     tooltip.transition()
    //         .duration(200)
    //         .style("opacity", .9);
    //     tooltip.html(
    //         "<b>Player: </b>" + d.player +
    //         "<br/>" +
    //         "<b>Raw Value: </b>" + d.data +
    //         "<br/>" +
    //         "<b>Percentile Rank: </b>" + Number.parseFloat(d.percentileRank.toPrecision(2)))
    //         .style("color", "white")
    //         .style("font-family", "sans-serif")
    //         .style("font-size", "10px")
    //         .style("left", (d3.event.pageX + 15) + "px")
    //         .style("top", (d3.event.pageY - 10) + "px");
    // })
    // .on("mousemove", function(d) {
    //     tooltip.html(
    //         "<b>Player: </b>" + d.player +
    //         "<br/>" +
    //         "<b>Raw Value: </b>" + d.data +
    //         "<br/>" +
    //         "<b>Percentile Rank: </b>" + Number.parseFloat(d.percentileRank.toPrecision(2)))
    //         .style("stroke", "white")
    //         .style("font-family", "sans-serif")
    //         .style("font-size", "10px")
    //         .style("left", (d3.event.pageX + 15) + "px")
    //         .style("top", (d3.event.pageY - 10) + "px");
    // })
    // .on("mouseleave", mouseleave);

    let x_axis = svg.append("g")
        .attr("id", `x_axis${i}`)
        .attr("class", "axis")
        .attr("transform", `translate(${margins.left}, ${innerHeight})`)
        .call(xAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", totalWidth)
        .attr("y", totalHeight - 6)
        .style("font-family", "sans-serif")
        .style("fill", "white")
        .text(forwardLabels[i]);

    // function zoom() {
    //     // re-scale y axis during zoom; ref [2]
    //     x_axis.transition()
    //         .duration(50)
    //         .call(xAxis.scale(d3.event.transform.rescaleY(xScale)));
    //
    //     // re-draw circles using new y-axis scale; ref [3]
    //     var new_yScale = d3.event.transform.rescaleY(xScale);
    //     markers.attr("cy", function(d) { return new_yScale(d[1]); });
    // }

}

//create a div for the legend
let div = document.createElement('div');
div.id = 'legend';
div.className = 'singleAxisScatter';
container.appendChild(div);

// draw legend
let svg = d3.select('#legend')
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

let colors = ["red", "blue"];

var legend = svg.selectAll(".legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return `translate(0, ${(i*20) + 50})`; });

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
    .style("fill", "white")
    .text(function(d) {
        let legendText = "";
        switch(d) {
            case "blue":
                legendText = "Left-footed average";
                break;
            case "red":
                legendText = "Right-footed average";
                break;
        }
        return legendText;
    });

