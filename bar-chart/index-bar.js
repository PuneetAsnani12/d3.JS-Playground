// select the svg container first
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

//create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0,${graphHeight})`);
const yAxisGroup = graph.append("g");

// scales

// linear scale
const y = d3.scaleLinear().range([graphHeight, 0]);

// band scale
const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

//create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(20)
  .tickFormat((d) => d + " orders");

const t = d3.transition().duration(3000);

// update function
const update = (data) => {
  // 1. update scales(domains) if they rely on our data
  y.domain([0, d3.max(data, (d) => d.orders)]);
  x.domain(data.map((item) => item.name));

  //2. join updated data to the elements

  //join the data to rects
  const rects = graph.selectAll("rect").data(data);

  //3. remove any unwanted shapes using the exit selection
  rects.exit().remove();

  //4. update current shapes in the dom
  rects
    .attr("width", x.bandwidth)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .transition(t)
    .attr("height", (d) => graphHeight - y(d.orders))
    .attr("y", (d) => y(d.orders));

  // 5. append the enter selection to the dom
  //append the enter selection to the DOM
  rects
    .enter()
    .append("rect")
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .attr("height", 0)
    .attr("y", graphHeight)
    .merge(rects)
    .transition(t)
    .attrTween("width", widthTween)
    .attr("height", (d) => graphHeight - y(d.orders))
    .attr("y", (d) => y(d.orders));

  // call the axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // update x axis text
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end")
    .attr("fill", "orange");
};

let data = [];
// get data from firestore with updates
db.collection("dishes").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    // console.log(change.doc.data())
    const doc = { ...change.doc.data(), id: change.doc.id };
    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

// TWEENS

const widthTween = (d) => {
  //define interpolation
  //d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, x.bandwidth());

  // return a funtion which takes a time ticker 't'
  return function (t) {
    //return the value from passing the ticker into the interpolation
    return i(t);
  };
};

// get data from firestore
// db.collection("dishes")
//   .get()
//   .then((res) => {
//     let data = [];

//     res.docs.forEach((doc) => {
//       data.push(doc.data());
//     });

//     update(data);

//     // d3.interval(() => {
//     //   data[0].orders += 50;
//     // }, 1000);

//   });
