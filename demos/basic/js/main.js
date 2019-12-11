
// Constant dimensions
const margin = { top: 20, right: 20, bottom: 20, left: 200 },
      step = 14,
      width = 600;

// Load and parse the json data
d3.json("data/all.json").then(function(genealogy) {

    // Parse the genealogy data into a cross referenced graph
    const graph = genealogy_graph(genealogy);

    // Calculate the height of the SVG
    const height = (graph.nodes.length - 1) * step + margin.top + margin.bottom;

    // Sort the nodes (people) by birth date
    const sorted = sort_nodes(graph);

    // Scaling function on the y axis
    const scaleY = d3.scalePoint(sorted, [margin.top, height - margin.bottom]);

    // Create the SVG
    var svg = d3.select("#svg-container").append("svg")
            .attr("width", width)
            .attr("height", height);

    // Make the labels
    const label = svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              .selectAll("g")
              .data(graph.nodes)
              .join("g")
              .attr("transform", function(d) {
                  return `translate(${margin.left},${d.y = scaleY(d.id)})`;
              })
              .call(function(g) {
                  g.append("text")
                      .attr("x", -6)
                      .attr("dy", "0.35em")
                      .text(function(d) {
                          let died = d.data.died;
                          if (died.length == 0)
                              died = "____";
                          
                          return d.data.first + " " + d.data.last + " " +
                              "(" + d.data.born + " - " + died + ")";
                      });
              })
              .call(function(g) {
                  g.append("circle").attr("r", 3);
              });

    // Make the arcs --- all of them are grey for now
    const path = svg.insert("g", "*")
              .attr("fill", "none")
              .attr("stroke-opacity", 0.6)
              .attr("stroke-width", 1.5)
              .selectAll("path")
              .data(graph.links)
              .join("path")
              .attr("stroke", function(d) {
                  switch (d.type) {
                  case "teacher":
                      return "#b2c2bd";
                  case "influence":
                      return "#6d93c7";
                  case "postDoc":
                      return "#65dbb7";
                  case "hostile":
                      return "#ff0000";
                  default:
                      return "#aaa";
                  }
              })
              .attr("d", make_arc);
});

function make_arc(d) {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;
    return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${margin.left},${y2}`;
}

function sort_nodes(graph) {
    const _sorted = graph.nodes.map(function(node) { 
        return { id: node.id, born: parseInt(node.data.born, 10) };
    }).sort(function(a, b) {
        // Descending by order of birth
        if (a.born < b.born) return 1;
        if (a.born > b.born) return -1;
        return 0;
    });
    return _sorted.map(function(d) { return d.id });
}

function genealogy_graph(genealogy) {
    // People to nodes
    const nodes = genealogy.people.map(function(person) {
        return {
            id: (person.key.length > 0 ? person.key : person.last),
            data: person,
            sourceLinks: [],
            targetLinks: []
        };
    });

    // Map ids to nodes
    const nodeById = new Map(nodes.map(function(node) {
        return [node.id, node];
    }));

    // Make links reference nodes
    const links = genealogy.links.map(function(link) {
        return {
            source: nodeById.get(link.from),
            target: nodeById.get(link.to),
            type: link.type
        };
    });

    // Make nodes reference links
    for (var i = 0; i < links.length; i++) {
        let link = links[i],
            source = link.source,
            target = link.target;
        
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
    }

    return { nodes: nodes, links: links};
}
