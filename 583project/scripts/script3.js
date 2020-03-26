let forwardStats = ['npg', 'shots', 'conversionRate', 'assists', 'keyPasses', 'succDribbles', 'dribbleSuccRate'];
let forwardLabels = ['Non-Penalty Goals per90', 'Shots per90', 'Conversion Rate', 'Assists per90', 'Key Passes per90', 'Successful Dribbles per90', 'Dribble Success Rate'];

//array of arrays, one for each stat
let forwardData = [];

for (let i=0; i<forwardStats.length; i++){ //for all 7 forward stats
    //construct an array
    forwardData[i] = [];
    //populate it with objects for each player
    for (let forward in forwards){
        forwardData[i].push({
            player: forward,
            data: forwards[forward][forwardStats[i]],
            y: 0,
            percentileRank: 0
        });
    }
}

console.log(forwardData);

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
for (let i=0; i<forwardData.length; i++){

    //create a div for each chart
    let div = document.createElement('div');
    div.id = forwardStats[i];
    div.className = 'singleAxisScatter';
    container.appendChild(div);

    //get the array for the current stat and sort it (ascending order)
    let currentStat = forwardData[i];
    currentStat.sort((a, b) => a.data - b.data);

    //calculate offsets for duplicate values by iterating through the array
    for (let j=0; j<currentStat.length; j++){

        //calculate percentile rank
        currentStat[j].percentileRank = (j/(currentStat.length - 1)) * 100;

        //retrieve the player and their data
        let player = currentStat[j].player;
        let data = currentStat[j].data;
        let numOccurrences = -1;
        //count the number of times their data occurs in the array
        for (let k=0; k<currentStat.length; k++){
            if (data === currentStat[k].data) {
                numOccurrences++
            }
            if (player === currentStat[k].player){
                break;
            }
        }
        //calculate the offset
        currentStat[j].y = -(numOccurrences * 5);
    }

    //construct color scale
    let colorScale = d3.scaleLinear()
        .domain(d3.extent(currentStat, function(data){ return data.data }))
        .range([0, 1]);

    let xScale = d3.scaleLinear()
        .domain(d3.extent(currentStat, function(data){ return data.data }))
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
        .attr("r", 3)
        .attr("cx", function(data){ return xScale(data.data)})
        .attr("cy", function(data){ return data.y })
        .style("fill", function(data) {
            if (data.percentileRank < 25){
                return "red"
            }
            else if (data.percentileRank < 50){
                return "orange"
            }
            else if (data.percentileRank < 75){
                return "yellow"
            }
            else {
                return "green"
            }
            // let base_color = colorScale(data.data);
            // return d3.interpolateInferno(base_color)
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

let colors = ["red", "orange", "yellow", "green"];

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
            case "red":
                legendText = "< 25th percentile";
                break;
            case "orange":
                legendText = "25th - 50th percentile";
                break;
            case "yellow":
                legendText = "50th - 75th percentile";
                break;
            case "green":
                legendText = "> 75th percentile";
                break;
        }
        return legendText;
    });

