var scaleh = d3.scale.linear();
var scalev = d3.scale.linear();
var width = 1150,
    height = 720;

function fx(d) { return d.x; };
function fy(d) { return d.y; };

//var svg;

d3.xml("./field.svg", function(xml) {
    svgdom = document.getElementById("mainContainer").appendChild(xml.documentElement);

    var svg = d3.select("svg");
    var defs = d3.select("defs");


    scaleh.domain([0, width]);
    scaleh.range([0, 1268]);
    scalev.domain([0, height]);
    scalev.range([0, 808]);

    // Define the div for the tooltip
    var div = d3
        .select("#mainContainer")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    d3.json("./players.json", function(json) {
        console.log(json)

        datap = json.nodes;

        json.nodes = datap;

        var node = svg.selectAll(".node")
            .data(datap)
            .enter().append("g")
            .attr("class", "node")
            .style("pointer-events", "all")
            .append("circle")
            .attr("cx", function(d, i){
                return d.x})
            .attr("cy", function(d, i){ return d.y})
            .attr("r", 10)
            .attr("filter","url(#f3)")
            .style("fill", "white")
            .style("stroke", "grey")
            .style("stroke-width", "1")
            .on("mouseover", function(d) {
                var entries = 0;
                switch (d.Position) {
                    case "CB":
                        entries = Object.keys(centerBacks).length;
                        break;
                    case "FB":
                        entries = Object.keys(fullBacks).length;
                        break;
                    case "CM":
                        entries = Object.keys(centralMids).length;
                        break;
                    case "AM":
                        entries = Object.keys(attackingMids).length;
                        break;
                    case "FW":
                        entries = Object.keys(forwards).length;
                        break;
                }
                // console.log(d);
                div.style("opacity", 1);
                div.html(d.name + "s" + " in dataset" + ": " + entries)
                    .style("left", d3.event.pageX + 5 + "px")
                    .style("top", d3.event.pageY - 28 + "px");
            })
            .on("mousemove", function(d) {
                // console.log(d)
                var entries = 0;
                switch (d.Position) {
                    case "CB":
                        entries = Object.keys(centerBacks).length;
                        break;
                    case "FB":
                        entries = Object.keys(fullBacks).length;
                        break;
                    case "CM":
                        entries = Object.keys(centralMids).length;
                        break;
                    case "AM":
                        entries = Object.keys(attackingMids).length;
                        break;
                    case "FW":
                        entries = Object.keys(forwards).length;
                        break;
                }
                div.style("opacity", 1);
                div.html(d.name + "s" + " in dataset" + ": " + entries)
                    .style("left", d3.event.pageX + 5 + "px")
                    .style("top", d3.event.pageY - 28 + "px");
            })
            .on("mouseout", function(d) {
                div.style("opacity", 0);
            })
            .on("click", function(d) {
                console.log(d);
                // window.location.href = 'visualization.html';
                window.location.href = 'visualization.html' + '#' + d.Position;
            });

        svg.selectAll(".node")
            .data(datap)
            .append("text")
            .text(function(d, i) {
                // return d.Number;
                return d.Position;
            })
            .attr("x", function(d, i) {
                return d.x;
            })
            .attr("y", function(d, i) {
                return d.y ;
            })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("text-anchor", "middle")
            .style("dominant-baseline", "central")
            .style("stroke", "black")
            .style("pointer-events", "none");

    });
});
