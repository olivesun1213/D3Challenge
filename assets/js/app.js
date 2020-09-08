// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 40,
  right: 40,
  bottom: 60,
  left:60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;


// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var scatterChart = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Load data from data.csv (smoke vs age)
d3.csv("assets/data/data.csv").then(function(StateData) {
    StateData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      //console.log(data);
    });

  //create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(StateData, d => d.age))
    .range([0, chartWidth])
    .nice()
 
   

  const yScale = d3.scaleLinear()
    .domain([6,d3.max(StateData, d => d.smokes)])
    .range([chartHeight, 0])
    .nice()
   
   
  // create axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
 
  //append axis to chart
  scatterChart.append("g").attr("transform", `translate(0, ${chartHeight})`).call(xAxis);
  scatterChart.append("g").call(yAxis);

//create plot
scatterChart.selectAll("circle")
.data(StateData)
.enter()
.append("circle")
.attr("cx", d=>xScale(d.age))
.attr("cy", d=>yScale(d.smokes))
.attr("r", "8")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.8);

//add txt to each circle
scatterChart.append("g")
  .selectAll('text')
  .data(StateData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.age))
  .attr("y",d=>yScale(d.smokes))
  .classed(".stateText", true)
  .attr("font-family", "calibri")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "12px")
  .attr("alignment-baseline", "central");
  
  //add titles to x,y axis
  scatterChart.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        scatterChart.append("text")
        .attr("y", 0 - ((chartMargin.left / 2+5)))
        .attr("x", 0 - (chartHeight / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("font-weight", "bold")
        .text("Smokers (%)");
}).catch(function(error) {
  console.log(error);
});