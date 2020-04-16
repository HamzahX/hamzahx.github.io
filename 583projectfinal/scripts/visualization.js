//set constants for scatter plot stats and their labels
const stats = [
    'npg',
    'shots',
    'conversionRate',
    'assists',
    'keyPasses',
    'succDribbles',
    'dribbleSuccRate',
    'tackles'
];
const labels = [
    'Non-Penalty Goals per90',
    'Shots per90',
    'Conversion Rate',
    'Assists per90',
    'Key Passes per90',
    'Successful Dribbles per90',
    'Dribble Success Rate',
    'Successful Tackles per90'
];

//set chart constants
const margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};
const totalWidth = 600;
const totalHeight = 150;
const innerWidth = totalWidth - margins.right - margins.left;
const innerHeight = totalHeight - margins.top - margins.bottom;

$('#playerSearchBar').bind("enterKey",function(e){

    drawScatterPlot();

    d3.selectAll("circle").style("opacity", .4);
    d3.selectAll('#'+$("#playerSearchBar").val().toLowerCase()).attr("r", 6).style("opacity", 1).style("fill", "white");
    $("#playerSearchBar").blur();
});

var text = window.location.hash.substring(1);
$.each($("input[name='position']").prop("checked", false), function(){
    if ($(this).val() === text) {
        $(this).prop("checked", true);
    }
});


$('#playerSearchBar').keyup(function(e){
    if(e.keyCode === 13)
    {
        $(this).trigger("enterKey");
    }
});
$("#playerSearchBar").on('click', function() {
    drawScatterPlot();
});

$('#footCheckboxForm input').on('change', function() {
    // console.log($('input[name=optradio]:checked', '#footCheckboxForm').val());
    drawScatterPlot();
});

//create a container for the charts
let container = document.createElement('div');
container.className = 'singleAxisScatterContainer';
canvas.appendChild(container);

//tooltip for hover
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("background-color", "whitesmoke")
    .style("padding", "0.4%")
    .style("opacity", 0);

drawScatterPlot();

//function to draw the scatter plots
function drawScatterPlot() {

    //clear the container
    container.innerHTML = '';

    //create an array and populate it with the positions that are currently checked
    let selectedPositions = [];

    $.each($("input[name='position']:checked"), function(){
        selectedPositions.push($(this).val());
    });

    //create an object and populate it with players who play in the selected positions
    let selectedPlayers = {};
    if (selectedPositions.includes("FW")) {
        Object.assign(selectedPlayers, forwards)
    }
    if (selectedPositions.includes("AM")) {
        Object.assign(selectedPlayers, attackingMids)
    }
    if (selectedPositions.includes("CM")) {
        Object.assign(selectedPlayers, centralMids)
    }
    if (selectedPositions.includes("FB")) {
        Object.assign(selectedPlayers, fullBacks)
    }
    if (selectedPositions.includes("CB")) {
        Object.assign(selectedPlayers, centerBacks)
    }

    //create an array of arrays to store the chart input data
    //one array for each of the 8 stats
    let chartInputData = [];
    for (let i=0; i<stats.length; i++){
        //construct an array
        chartInputData[i] = [];
        //populate it with objects for each player
        for (let player in selectedPlayers){
            chartInputData[i].push();
            if ($('input[name=optradio]:checked', '#footCheckboxForm').val() !== "B") {
                if ($('input[name=optradio]:checked', '#footCheckboxForm').val() === selectedPlayers[player]['preferredFoot']) {
                    chartInputData[i].push({
                        player: player,
                        data: selectedPlayers[player][stats[i]],
                        y: 0,
                        percentileRank: 0,
                        foot: selectedPlayers[player]['preferredFoot']
                    });
                }
            } else {
                chartInputData[i].push({
                    player: player,
                    data: selectedPlayers[player][stats[i]],
                    y: 0,
                    percentileRank: 0,
                    foot: selectedPlayers[player]['preferredFoot']
                });
            }
        }
    }

    for (let i=0; i<chartInputData.length; i++){

        //create a div for each scatter line
        let div = document.createElement('div');
        div.id = stats[i];
        div.className = 'singleAxisScatter';
        container.appendChild(div);

        //get the array for the current stat and sort it (ascending order)
        let currentStat = chartInputData[i];
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

        //create the scale of the x-axis
        let xScale = d3.scaleLinear()
            .domain(d3.extent(currentStat, function(data){ return data.data }))
            .range([margins.left, innerWidth])
            .nice();

        //create the axis
        let xAxis = d3.axisBottom(xScale);

        //create the svg element
        let svg = d3.select(`#${stats[i]}`)
            .append("svg")
            .attr("width", totalWidth)
            .attr("height", totalHeight)
            .call(d3.zoom().on("zoom", zoom));



        //tooltip mouseover event handler
        let mouseover = function(d) {
            tooltip
                .style("opacity", 1)
        };

        //tooltip mouseleave event handler
        let mouseleave = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)

        };

        //create the markers on the scatter line
        let markers = svg.append("g")
            .attr("id", `${stats[i]}Markers`)
            .attr("transform", `translate(${margins.left}, ${innerHeight - 25})`)
            .selectAll("circle")
            .data(currentStat)
            .enter()
            .append("circle")
            .attr("id", function(d) {
                let simplifiedName = d.player.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let splitName = simplifiedName.split(' ');
                return splitName[splitName.length - 1].toLowerCase();
                // if (splitName.length == 1) {
                //     return splitName[0].toLowerCase()
                // } else {
                //     return splitName[1].toLowerCase();
                // }
            })
            .attr("r", 4)
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
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(
                    "<b>Player: </b>" + d.player +
                    "<br/>" +
                    "<b>Raw Value: </b>" + d.data +
                    "<br/>" +
                    "<b>Percentile Rank: </b>" + Number.parseFloat(d.percentileRank.toPrecision(2)))
                    .style("color", "black")
                    .style("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 10) + "px");
            })
            .on("mousemove", function(d) {
                tooltip.html(
                    "<b>Player: </b>" + d.player +
                    "<br/>" +
                    "<b>Raw Value: </b>" + d.data +
                    "<br/>" +
                    "<b>Percentile Rank: </b>" + Number.parseFloat(d.percentileRank.toPrecision(2)))
                    .style("stroke", "black")
                    .style("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 10) + "px");
            })
            .on("mouseleave", mouseleave);

        //draw the x axis
        let x_axis = svg.append("g")
            .attr("id", `x_axis${i}`)
            .attr("class", "axis")
            .attr("transform", `translate(${margins.left}, ${innerHeight})`)
            .call(xAxis);

        //draw x-axis labels
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", totalWidth)
            .attr("y", totalHeight - 6)
            .style("font-family", "sans-serif")
            .style("fill", "white")
            .text(labels[i]);

        function zoom() {
            // re-scale y axis during zoom; ref [2]
            x_axis.transition()
                .duration(50)
                .call(xAxis.scale(d3.event.transform.rescaleX(xScale)));

            // re-draw circles using new y-axis scale; ref [3]
            var new_xScale = d3.event.transform.rescaleX(xScale);
            markers.attr("cx", function(d) { return new_xScale(d.data); });
        }

    }

    //create a div for the legend
    let div = document.createElement('div');
    div.id = 'legend';
    div.className = 'singleAxisScatter';
    container.appendChild(div);

    //draw legend
    let svg = d3.select('#legend')
        .append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight);

    let colors = ["red", "orange", "yellow", "green"];

    let legend = svg.selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return `translate(0, ${(i*20) + 50})`; });

    //draw legend colored rectangles
    legend.append("rect")
        .attr("x", margins.left + margins.right)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
            return d;
        });

    //draw legend text
    legend.append("text")
        .attr("x", margins.left + margins.right + 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
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

}

function clearScreen() {
    window.location.href = 'visualization.html';
    drawScatterPlot();
}
