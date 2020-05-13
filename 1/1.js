// const canvas = d3.select(".canvas");

// const svg = canvas.append("svg").attr("height", 600).attr("width", 600);

// // append shapes to svg container
// const group  = svg.append('g').attr('transform','translate(50,100)')
// group
//   .append("rect")
//   .attr("width", 200)
//   .attr("height", 100)
//   .attr("fill", "blue")
//   .attr("x", 20)
//   .attr("y", 20);

// group
//   .append("circle")
//   .attr("r", 50)
//   .attr("cx", 300)
//   .attr("cy", 70)
//   .attr("fill", "pink");
// group
//   .append("line")
//   .attr("x1", 370)
//   .attr("x2", 400)
//   .attr("y1", 20)
//   .attr("y2", 120)
//   .attr("stroke", "red");

// svg
//   .append("text")
//   .attr("x", 20)
//   .attr("y", 200)
//   .attr("fill", "grey")
//   .text("hello ninjas !")
//   .style("font-family", "arial");

const data = [
  {
    width: 550,
    height: 100,
    fill: "blue",
  },
  {
    width: 400,
    height: 70,
    fill: "purple",
  },
  {
    width: 200,
    height: 50,
    fill: "pink",
  },
];

const svg = d3.select("svg");

// Join data to rects
const rects = svg.selectAll("rect").data(data);

// add attrs to rects already in the DOM
rects
  .attr("width", (d) => d.width)
  .attr("height", (d) => d.height)
  .attr("fill", (d) => d.fill);

// append to the enter selection to DOM
rects
  .enter()
  .append("rect")
  .attr("width", (d) => d.width)
  .attr("height", (d) => d.height)
  .attr("fill", (d) => d.fill);
