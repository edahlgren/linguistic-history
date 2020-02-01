const margin = {top: 20, bottom: 20},
      width = document.body.offsetWidth * 0.10,
      step = 20,
      line_padding = 4;

const lines = [
    { key: "solid", stroke: "#cccccc", dasharray: null, linecap: null },
    { key: "dashed", stroke: "#cccccc", dasharray: "5,5", linecap: null },
    { key: "dotted", stroke: "#cccccc", dasharray: "1,5", linecap: "round" },
    
    { key: "linguist", stroke: "#f7c111", dasharray: null, linecap: null },
    { key: "philosopher", stroke: "#7fc78b", dasharray: null, linecap: null },
    { key: "psychologist", stroke: "#7fb0c7", dasharray: null, linecap: null },
    { key: "mathematician", stroke: "#eda1d5", dasharray: null, linecap: null }
];

const dots = [
    { key: "linguist-dot", fill: "#f7c111", dasharray: null, linecap: null },
    { key: "philosopher-dot", fill: "#7fc78b", dasharray: null, linecap: null },
    { key: "psychologist-dot", fill: "#7fb0c7", dasharray: null, linecap: null },
    { key: "mathematician-dot", fill: "#eda1d5", dasharray: null, linecap: null }
];

const line_keys = lines.map(function(d) { return d.key; }),
      dot_keys = dots.map(function(d) { return d.key; }),
      all_keys = line_keys.concat(dot_keys);

// Calculate the height of the SVG
const height = (all_keys.length - 1)*step + margin.top + margin.bottom,
      scaleY = d3.scalePoint(all_keys, [margin.top, height - margin.bottom]);

var svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height);

const line_generator = d3.line()
          .curve(d3.curveLinear)
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });    

const line_elements = svg.append("g")
          .attr("font-family", "serif")
          .attr("font-size", 6)
          .attr("letter-spacing", "0.5px")
          .attr("text-anchor", "left")
          .selectAll("g")
          .data(lines)
          .join("g")
          .attr("class", "legend-element")
          .attr("id", function(d) {
              return d.key;
          })
          .attr("transform", function(d) {
              return `translate(${0},${d.y = scaleY(d.key)})`;
          })
          .call(function(g) {
              g.append("line")
                  .style("stroke", function(d) { return d.stroke; })
                  .style("stroke-dasharray", function(d) {
                      return (d.dasharray ? d.dasharray : "none");
                  })
                  .style("stroke-linecap", function(d) {
                      return (d.linecap ? d.linecap : "none");
                  })
                  .style("stroke-width", 2)
                  .style("fill", "none")
                  .attr("x1", 0)
                  .attr("x2", function(d) {
                      return width;
                  })
                  .attr("y1", 0)
                  .attr("y2", 0);
          });

const dot_elements = svg.append("g")
          .attr("font-family", "serif")
          .attr("font-size", 6)
          .attr("letter-spacing", "0.5px")
          .attr("text-anchor", "left")
          .selectAll("g")
          .data(dots)
          .join("g")
          .attr("class", "legend-element")
          .attr("id", function(d) {
              return d.key;
          })
          .attr("transform", function(d) {
              return `translate(${0},${d.y = scaleY(d.key)})`;
          })
          .call(function(g) {
              g.append("circle")
                  .attr("class", "point")
                  .attr("r", 2)
                  .attr("cx", width - 1)
                  .attr("cy", 1)
                  .attr("stroke", "none")
                  .attr("fill", function(d) { return d.fill; });
          });
