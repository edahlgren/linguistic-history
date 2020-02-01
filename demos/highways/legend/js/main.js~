const margin = {top: 20, bottom: 20},
      width = document.body.offsetWidth * 0.10,
      step = 20,
      line_padding = 4;

function stroke_color(profession) {
    switch (profession) {
    case "linguist":
        return "#ebe2d5";
    case "anthropologist":
        return "#f2ddd3";
    case "mathematician":
        return "#e8e8e8";
    case "philosopher":
        return "#dfe6da";
    case "psychologist":
        return "#dae8eb";
    default:
        console.error("UNKNOWN PROFESSION!");
        return "#ff0000";
    }
}

const lines = [
    { key: "linguist", desc: "Linguist" },
    { key: "anthropologist", desc: "Anthropologist" },
    { key: "mathematician", desc: "Mathematician" },
    { key: "philosopher", desc: "Philosopher" },
    { key: "psychologist", desc: "Psychologist" }
];

// Calculate the height of the SVG
const height = (lines.length - 1)*step + margin.top + margin.bottom,
      scaleY = d3.scalePoint(lines.map(function(d) { return d.key; }),
                             [margin.top, height - margin.bottom]);

var svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height);

const line_generator = d3.line()
          .curve(d3.curveLinear)
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });    

const legend = svg.append("g")
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
                  .style("stroke", function(d) {
                      return stroke_color(d.key);
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
