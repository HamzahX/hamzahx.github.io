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
            y: 0
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

//create a container for the charts
let container = document.createElement('div');
container.className = 'singleAxisScatterContainer';
document.body.appendChild(container);

//iterate through the arrays for each stat and draw the chart for them
for (let i=0; i<forwardData.length; i++){

    //create a div for each chart
    let div = document.createElement('div');
    div.id = forwardStats[i];
    div.className = 'singleAxisScatter';
    container.appendChild(div);

    //retrieve the array for the current stat and sort the objects by ascending order
    let currentStat = forwardData[i];
    currentStat.sort((a, b) => a.data - b.data);

    //calculate offsets for duplicate values
    //iterate through the array
    for (let j=0; j<currentStat.length; j++){
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

    //create the d3 scale
    let xScale = d3.scaleLinear()
        .domain(d3.extent(currentStat, function(data){ return data.data }))
        .range([margins.left, innerWidth])
        .nice();

    //create an x axis
    let xAxis = d3.axisBottom(xScale);

    //create an svg element
    let svg = d3.select(`#${forwardStats[i]}`)
        .append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight);

    //create the markers for the scatter plot
    let markers = svg.append("g")
        .attr("id", `${forwardStats[i]}Markers`)
        .attr("transform", `translate(${margins.left}, ${innerHeight - 25})`)
        .selectAll("circle")
        .data(currentStat)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(data){
            return xScale(data.data)
        })
        .attr("cy", function(data){
            return data.y
        })
        .style("fill", "black");
        // .on("mouseover", function(data) {
        //     svg.append("text")
        //         .attr("class", "playername")
        //         .attr("text-anchor", "end")
        //         .attr("x", innerWidth/2)
        //         .attr("y", totalHeight - 6)
        //         .style("font-family", "sans-serif")
        //         .text("Player: " + data.player);
        // })
        // .on("mouseout", function(data) {
        //     svg.select(".playername").remove();
        // });

    //draw the x axis
    let x_axis = svg.append("g")
        .attr("id", `x_axis${i}`)
        .attr("transform", `translate(${margins.left}, ${innerHeight})`)
        .call(xAxis);

    //draw the axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", totalWidth)
        .attr("y", totalHeight - 6)
        .style("font-family", "sans-serif")
        .text(forwardLabels[i]);

}
