// Constant dimensions
const margin = {top: 20, right: 10, bottom: 30, left: 10},
      width = document.body.offsetWidth,
      height = 436,
      display_height = height - margin.bottom,
      step = 8,
      padding = 8;

function background_color(profession) {
    switch (profession) {
    case "linguists":
        return "#fafafa";
    case "psychologists":
        return "rgba(221, 236, 240, 0.3)";
    case "anthropologists":
        return "rgba(212, 183, 169, 0.2)";
    case "mathematicians":
        return "#edeae6";
    case "philosophers":
        return "#f7f5f2";
    default:
        return "#ff0000";
    }
}

function circle_color(profession) {
    switch (profession) {
    case "linguist-circle":
        return "#f0f0f0";
    case "psychologist-circle":
        return "#e9f3f5";
    case "philosopher-circle":
        return "#f2eadf";
    default:
        return "#ff0000";
    }    
}

function background_circle_color(profession) {
    switch (profession) {
    case "linguist-circle":
        return "#d9d9d9";
    case "psychologist-circle":
        return "#dae8eb";
    case "philosopher-circle":
        return "#ebe2d5";
    default:
        return "#ff0000";
    }    
}

// Load and parse the json data
d3.json("data/subset.json").then(function(genealogy) {

    // Sort the people in the graph
    const graph = order_graph(genealogy);
    console.log(graph);

    const youngest = graph.births[0],
          oldest = graph.births[graph.births.length - 1];

    const xRange = [margin.left, width - (margin.left + margin.right)],
          before1800 = [xRange[0], xRange[1] * 0.1],
          after1800 = [before1800[1], xRange[1]];
    
    const xBefore1800 = d3.scaleLinear()
              .domain([youngest.born, 1799])
              .range(before1800);
    const xAfter1800 = d3.scaleLinear()
              .domain([1800, oldest.born])
              .range(after1800);

    const timeBefore1800 = d3.scaleTime()
              .domain([new Date(youngest.born, 0, 1),
                       new Date(1800, 0, 1)])
              .range(before1800);
    const timeAfter1800 = d3.scaleTime()
              .domain([new Date(1801, 0, 1),
                       new Date(oldest.born, 0, 1)])
              .range(after1800);
    
    const scaleX = function(last) {
        let person = graph.names.get(last),
            birth = parseInt(person.born, 10);
        if (birth < 1800)
            return xBefore1800(birth);
        return xAfter1800(birth);
    };
    const xTime = function(date) {
        console.log(date);
        if(date.getFullYear() < 1800)
            return timeBefore1800(date);
        return timeAfter1800(date);
    };

    // Scales for the y-axis
    const outsiders_height = step * 4;
    const display_step = (display_height - step - outsiders_height) / 3;

    const band1 = { start: 0, end: display_step },
          band2 = { start: band1.end, end: band1.end + outsiders_height/2 },
          band3 = { start: band2.end, end: band2.end + outsiders_height/2 },
          band4 = { start: band3.end, end: band3.end + display_step },
          band5 = { start: band4.end, end: band4.end + display_step },
          band6 = { start: band5.end, end: band5.end + padding/2 };
    
    const yScale1 = d3.scaleLinear()
              .domain([0,10])
              .range([step + band1.start, band1.end - step]);
    const yScale2 = d3.scaleLinear()
              .domain([0,10])
              .range([band2.start, band2.end]);
    const yScale3 = d3.scaleLinear()
              .domain([0,10])
              .range([band3.start, band3.end]);
    const yScale4 = d3.scaleLinear()
              .domain([0,10])
              .range([step + band4.start, band4.end - step]);
    const yScale5 = d3.scaleLinear()
              .domain([0,10])
              .range([step + band5.start, band5.end - step]);
    
    // Create the SVG
    var svg = d3.select("#svg-container").append("svg")
            .attr("width", width)
            .attr("height", height + padding/2);

    // Highlight the background in colors
    svg.selectAll("professions")
        .data([
            { profession: "linguists", band: band1 },
            { profession: "psychologists", band: band5 },
            { profession: "anthropologists", band: band2 },
            { profession: "mathematicians", band: band3 },
            { profession: "philosophers", band: band4 },
            { profession: "psychologists", band: band6 }
        ])
        .enter()
        .append("rect")
        .attr("id", function(d) { return d.profession; })
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3)
        .attr("fill", "#fafafa")
        .attr("width", function(d) {
            return width;
        })
        .attr("height", function(d) {
            return d.band.end - d.band.start;
        })
        .attr("transform", function(d) {
            return `translate(${d.x = 0},${d.y = d.band.start})`;
        });

    svg.append("g")
        .attr("id", "shown-groups")
        .attr("width", width)
        .attr("height", height);
    
    // Create x-axis grid lines
    let grid1 = svg.append("g")
        .attr("class","grid-x")
        .attr("transform", function() {
            return `translate(${0},${display_height - step + padding/2})`;
        })
        .call(d3.axisBottom(timeBefore1800)
              .ticks(d3.timeYear.every(10))
              .tickSize(step)
              .tickFormat(function(d) {
                  if (d.getFullYear() % 50 == 0)
                      return d.getFullYear();
                  return null;
              }))
        .call(function(g) {
            g.select(".domain").remove();
        });

    grid1.selectAll("line")
        .style("stroke", "#808080")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.5)
        .style("shape-rendering", "crispEdges");
    grid1.selectAll("text")
        .style("font-family", "serif")
        .style("font-size", 9)
        .style("fill", "#aaa");
    
    
    let grid2 = svg.append("g")
        .attr("class","grid-x")
        .attr("transform", function() {
            return `translate(${0},${display_height - step + padding/2})`;
        })
        .call(d3.axisBottom(timeAfter1800)
              .ticks(d3.timeYear.every(10))
              .tickSize(step)
              .tickFormat(function(d) {
                  return d.getFullYear();
              }))
        .call(function(g) {
            g.select(".domain").remove();
        });

    grid2.selectAll("line")
        .style("stroke", "#808080")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.5)
        .style("shape-rendering", "crispEdges");
    grid2.selectAll("text")
        .style("font-family", "serif")
        .style("font-size", 9)
        .style("fill", "#aaa");
    
    // Position the people
    const people = svg.append("g")
              .attr("font-family", "serif")
              .attr("font-size", 7)
              .attr("letter-spacing", "0.5px")
              .attr("text-anchor", "middle")
              .selectAll("g")
              .data(graph.births)
              .join("g")
              .attr("class", "person")
              .attr("id", function(d) {
                  return d.last;
              })
              .attr("transform", function(d) {

                  let yOffset = function(person) {
                      switch (person.profession) {
                      case "linguist":
                          return yScale1(person.scaleY ? person.scaleY : 5);
                      case "anthropologist":
                          return yScale2(person.scaleY ? person.scaleY : 4);
                      case "mathematician":
                          return yScale3(person.scaleY ? person.scaleY : 4);
                      case "philosopher":
                          return yScale4(person.scaleY ? person.scaleY : 5);
                      case "psychologist":
                          return yScale5(person.scaleY ? person.scaleY : 5);
                      default:
                          console.error("UNKNOWN PROFESSION!");
                          return 0;
                      }
                  };
                  
                  let person = graph.names.get(d.last);
                  return `translate(${d.x = scaleX(d.last)},${d.y = yOffset(person)})`;
              })
              .call(function(g) {
                  g.append("text")
                      .attr("fill", "#404040")
                      .attr("dy", "0.35em")
                      .text(function(d) {
                          return d.last;
                      });
                  g.append("text")
                      .attr("fill", "#404040")
                      .attr("dy", 10)
                      .text(function(d) {
                          return d.born;
                      });
              });
    
    // Map out lines between each person
    connect(svg, {
        lines: [
            {
                from: { name: "Herder", side: "bottom" },
                to: { name: "Kant", side: "right" },
                direction: "down"
            },
            {
                from: { name: "Herder", side: "bottom" },
                to: { name: "Fichte", side: "left" },
                direction: "down"
            },
            {
                from: { name: "Kant", side: "right" },
                to: { name: "Fichte", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Herder", side: "top" },
                to: { name: "Humboldt", side: "left" },
                direction: "up"
            },
            {
                from: { name: "Humboldt", side: "bottom" },
                to: { name: "Steinthal", side: "left" },
                direction: "down"
            },
            {
                from: { name: "Brentano", side: "left" },
                to: { name: "Comte", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Brentano", side: "left" },
                to: { name: "Trendelenberg", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Brentano", side: "left" },
                to: { name: "Mill", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Whitney", side: "left" },
                to: { name: "Mueller", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Whitney", side: "left" },
                to: { name: "Curtius", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Whitney", side: "left" },
                to: { name: "Bopp", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Whitney", side: "left" },
                to: { name: "Lepsius", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Weber", side: "right" },
                to: { name: "Breal", side: "left" },
                direction: "left"
            },
            {
                from: { name: "Trendelenberg", side: "right" },
                to: { name: "Marty", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Marty", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Masaryk", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Husserl", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Twardowski", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Ehrenfels", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Meinong", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Freud", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Brentano", side: "right" },
                to: { name: "Stumpf", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Stumpf", side: "right" },
                to: { name: "Langfeld", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Stumpf", side: "right" },
                to: { name: "Wertheimer", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Stumpf", side: "right" },
                to: { name: "Allport", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Wundt", side: "right" },
                to: { name: "Angell", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Wundt", side: "right" },
                to: { name: "Titchener", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Watson", side: "left" },
                to: { name: "Loeb", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Watson", side: "left" },
                to: { name: "Angell", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Watson", side: "left" },
                to: { name: "Titchener", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Watson", side: "right" },
                to: { name: "Hull", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Watson", side: "right" },
                to: { name: "Tolman", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Watson", side: "right" },
                to: { name: "Skinner", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Watson", side: "right" },
                to: { name: "Allport", side: "left" },
                direction: "custom",
                custom: function(svg, name, endpoints) {
                    const heider = d3.select("#Heider"),
                          heider_corners = get_corners(heider);
                    
                    let points = [
                        endpoints.start,
                        { x: heider_corners.bottom_left.x, y: endpoints.start.y },
                        { x: heider_corners.bottom_left.x, y: endpoints.end.y },
                        endpoints.end
                    ];
                    
                    connect_through(svg, name, points);
                }                
            },
            {
                from: { name: "Watson", side: "right" },
                to: { name: "Lashley", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Allport", side: "left" },
                to: { name: "Langfeld", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Allport", side: "left" },
                to: { name: "Wertheimer", side: "bottom" },
                direction: "left"
            },
            {
                from: { name: "Allport", side: "right" },
                to: { name: "Bruner", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Wertheimer", side: "bottom" },
                to: { name: "Heider", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Hilbert", side: "bottom" },
                to: { name: "Husserl", side: "right" },
                direction: "down"
            },
            {
                from: { name: "Wittgenstein", side: "left" },
                to: { name: "Russell", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Cassirer", side: "right" },
                to: { name: "Lewin", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Whitney", side: "right" },
                to: { name: "Harper", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Whitney", side: "right" },
                to: { name: "Buck", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Buck", side: "right" },
                to: { name: "Bloomfield", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Whitney", side: "right" },
                to: { name: "Lanman", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Osthoff", side: "right" },
                to: { name: "Saussure", side: "left" },
                direction: "right"
            },
            /**
            {
                from: { name: "Mathesius", side: "left" },
                to: { name: "Marty", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Mathesius", side: "left" },
                to: { name: "Masaryk", side: "top" },
                direction: "left"
            },
            {
                from: { name: "Chelpanov", side: "right" },
                to: { name: "Shpet", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Trubetzkoy", side: "left" },
                to: { name: "Fortunatov", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Breal", side: "right" },
                to: { name: "Fortunatov", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Shpet", side: "right" },
                to: { name: "Jakobson", side: "left" },
                direction: "right"
            },
             **/
            {
                from: { name: "Steinthal", side: "right" },
                to: { name: "Boas", side: "left" },
                direction: "right",
                move_behind: true
            },
            {
                from: { name: "Boas", side: "right" },
                to: { name: "Benedict", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Boas", side: "right" },
                to: { name: "Sapir", side: "bottom" },
                direction: "right"
            },            
            {
                from: { name: "Sapir", side: "bottom" },
                to: { name: "Koffka", side: "left" },
                direction: "custom",
                custom: function(svg, name, endpoints) {
                    const anthropologists = d3.select("#anthropologists"),
                          corners = get_corners(anthropologists);
                    
                    let points = [
                        endpoints.start,
                        { x: endpoints.start.x, y: corners.top_left.y }
                    ];
                    connect_through(svg, name + "-1", points);
                }
            },
            {
                from: { name: "Koffka", side: "left" },
                to: { name: "Sapir", side: "bottom" },
                direction: "custom",
                custom: function(svg, name, endpoints) {
                    const philosophers = d3.select("#philosophers"),
                          corners = get_corners(philosophers);
                    
                    let start = endpoints.start,
                        end = { x: endpoints.end.x, y: corners.bottom_left.y };
                    
                    connect_horizontal(svg, name + "-2", {start: start, end: end});
                }
            },
            {
                from: { name: "Benedict", side: "right" },
                to: { name: "Mead", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Pike", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Harris", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Haas", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Hockett", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Swadesh", side: "bottom" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Voegelin", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Newman", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Sapir", side: "right" },
                to: { name: "Hoijer", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Bloomfield", side: "right" },
                to: { name: "Pike", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Bloomfield", side: "right" },
                to: { name: "Harris", side: "top" },
                direction: "right"
            },
            {
                from: { name: "Bloomfield", side: "right" },
                to: { name: "Hockett", side: "top" },
                direction: "right"
            },
            /**
            {
                from: { name: "Jakobson", side: "top" },
                to: { name: "Halle", side: "left" },
                direction: "up"
            },
            {
                from: { name: "Chomsky", side: "left" },
                to: { name: "Halle", side: "right" },
                direction: "left"
            },
            {
                from: { name: "Voegelin", side: "right" },
                to: { name: "Garvin", side: "left" },
                direction: "right"
            },
            {
                from: { name: "Wundt", side: "right" },
                to: { name: "Chelpanov", side: "left" },
                direction: "custom",
                custom: function(svg, name, endpoints) {
                    const marty = d3.select("#Marty"),
                          marty_corners = get_corners(marty);
                    
                    let points = [
                        endpoints.start,
                        { x: marty_corners.top_left.x, y: endpoints.start.y },
                        { x: marty_corners.top_left.x, y: endpoints.end.y },
                        endpoints.end
                    ];
                    
                    connect_through(svg, name, points);
o                },
                move_behind_middle: true
            }
             **/
        ],
        fix_edges: function(edges) {
            let brentano = edges.get("Brentano-right");
            brentano.list[0] = "Marty";
            brentano.list[1] = "Masaryk";
            brentano.list[5] = "Freud";
            brentano.list[6] = "Meinong";
            edges.set("Brentano-right", brentano);

            /**
            let mathesius = edges.get("Mathesius-left");
            mathesius.list[0] = "Marty";
            mathesius.list[1] = "Masaryk";
            edges.set("Mathesius-left", mathesius);
             **/
            
            let whitney = edges.get("Whitney-right");
            whitney.list[0] = "Lanman";
            whitney.list[1] = "Harper";
            whitney.list[2] = "Buck";
            edges.set("Whitney-right", whitney);
            
            let bloomfield = edges.get("Bloomfield-right");
            bloomfield.list[0] = "Hockett";
            bloomfield.list[1] = "Harris";
            bloomfield.list[2] = "Pike";
            edges.set("Bloomfield-right", bloomfield);
            
            let werth = edges.get("Wertheimer-bottom");
            werth.list[0] = "Stumpf";
            werth.list[1] = "Allport";
            werth.list[2] = "Heider";
            edges.set("Wertheimer-bottom", werth);
            
            return edges;
        },
        show_groups: [
            {
                name: "first_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Humboldt", "Schlegel", "Rask", "Bopp", "Grimm"
                    ]);

                    return [
                        corners.get("Rask").top_right,
                        corners.get("Rask").top_left,
                        {
                            x: corners.get("Rask").top_left.x,
                            y: corners.get("Schlegel").top_right.y
                        },
                        corners.get("Schlegel").top_left,
                        {
                            x: corners.get("Schlegel").top_left.x,
                            y: corners.get("Humboldt").top_right.y
                        },
                        corners.get("Humboldt").top_left,
                        corners.get("Humboldt").bottom_left,
                        {
                            x: corners.get("Grimm").top_left.x,
                            y: corners.get("Humboldt").bottom_right.y
                        },
                        corners.get("Grimm").bottom_left,
                        corners.get("Grimm").bottom_right,
                        {
                            x: corners.get("Grimm").bottom_right.x,
                            y: corners.get("Bopp").bottom_right.y
                        },
                        corners.get("Bopp").bottom_right,
                        corners.get("Bopp").top_right,
                        {
                            x: corners.get("Rask").bottom_right.x,
                            y: corners.get("Bopp").top_right.y
                        },
                        corners.get("Rask").top_right
                    ];                    
                }
            },
            {
                name: "second_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Mueller", "Curtius", "Lepsius", "Grassmann", "Schleicher", "Weber"
                    ]);
                    return [
                        corners.get("Mueller").top_right,
                        corners.get("Curtius").top_left,
                        {
                            x: corners.get("Curtius").bottom_left.x,
                            y: corners.get("Lepsius").top_right.y
                        },
                        corners.get("Lepsius").top_left,
                        {
                            x: corners.get("Lepsius").top_left.x,
                            y: corners.get("Grassmann").top_left.y
                        },
                        corners.get("Grassmann").top_left,
                        corners.get("Grassmann").bottom_left,
                        {
                            x: corners.get("Schleicher").top_left.x,
                            y: corners.get("Grassmann").bottom_left.y
                        },
                        corners.get("Schleicher").bottom_left,
                        corners.get("Schleicher").bottom_right,
                        {
                            x: corners.get("Schleicher").bottom_right.x,
                            y: corners.get("Weber").bottom_left.y
                        },
                        corners.get("Weber").bottom_right,
                        {
                            x: corners.get("Weber").top_right.x,
                            y: corners.get("Mueller").bottom_right.y
                        },
                        corners.get("Mueller").bottom_right,
                        corners.get("Mueller").top_right
                    ];
                }
            },
            {
                name: "third_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Leskien", "Delbruek", "Brugmann", "Grassmann", "Boas", "Harper",
                        "Dewey", "Saussure", "Sievers", "Osthoff", "Schuchardt"
                    ]);
                    return [
                        corners.get("Sievers").top_left,
                        {
                            x: corners.get("Sievers").top_left.x,
                            y: corners.get("Osthoff").top_right.y
                        },
                        corners.get("Osthoff").top_left,
                        {
                            x: corners.get("Osthoff").bottom_left.x,
                            y: corners.get("Schuchardt").top_right.y
                        },
                        corners.get("Schuchardt").top_left,
                        {
                            x: corners.get("Schuchardt").top_left.x,
                            y: corners.get("Leskien").top_left.y
                        },
                        corners.get("Leskien").top_left,
                        corners.get("Leskien").bottom_left,
                        {
                            x: corners.get("Delbruek").top_left.x,
                            y: corners.get("Leskien").bottom_left.y
                        },
                        corners.get("Delbruek").bottom_left,
                        {
                            x: corners.get("Boas").top_left.x,
                            y: corners.get("Delbruek").bottom_left.y
                        },
                        corners.get("Boas").bottom_left,
                        {
                            x: corners.get("Dewey").bottom_right.x,
                            y: corners.get("Boas").bottom_right.y
                        },
                        {
                            x: corners.get("Dewey").top_right.x,
                            y: corners.get("Dewey").top_right.y
                        },
                        {
                            x: corners.get("Saussure").bottom_right.x,
                            y: corners.get("Dewey").top_right.y
                        },
                        corners.get("Saussure").top_right,
                        {
                            x: corners.get("Sievers").bottom_right.x,
                            y: corners.get("Saussure").top_left.y
                        },
                        corners.get("Sievers").top_right,
                        corners.get("Sievers").top_left
                    ];
                }
            },
            {
                name: "sapir_circle",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Sapir", "Benedict", "Mead", "Hoijer", "Voegelin", "Haas", "Hockett",
                        "Swadesh", "Harris", "Bloomfield"
                    ]);
                    return [
                        corners.get("Sapir").top_left,
                        corners.get("Sapir").bottom_left,
                        {
                            x: corners.get("Benedict").top_left.x,
                            y: corners.get("Sapir").bottom_left.y
                        },
                        corners.get("Benedict").bottom_left,
                        corners.get("Benedict").bottom_right,
                        {
                            x: corners.get("Benedict").bottom_right.x,
                            y: corners.get("Voegelin").bottom_left.y
                        },
                        {
                            x: corners.get("Mead").bottom_left.x,
                            y: corners.get("Voegelin").bottom_left.y
                        },
                        corners.get("Mead").bottom_left,
                        corners.get("Mead").bottom_right,
                        {
                            x: corners.get("Mead").bottom_right.x,
                            y: corners.get("Hoijer").bottom_left.y
                        },
                        {
                            x: corners.get("Voegelin").bottom_right.x,
                            y: corners.get("Hoijer").bottom_left.y
                        },
                        corners.get("Voegelin").bottom_right,
                        {
                            x: corners.get("Haas").bottom_right.x,
                            y: corners.get("Voegelin").bottom_right.y
                        },
                        {
                            x: corners.get("Haas").bottom_right.x,
                            y: corners.get("Hockett").bottom_right.y
                        },
                        corners.get("Hockett").bottom_right,
                        corners.get("Hockett").top_right,
                        {
                            x: corners.get("Hockett").top_right.x,
                            y: corners.get("Bloomfield").top_right.y
                        },
                        corners.get("Bloomfield").top_left,
                        {
                            x: corners.get("Bloomfield").top_left.x,
                            y: corners.get("Sapir").top_right.y
                        },
                        corners.get("Sapir").top_left
                    ];
                }
            },
            {
                name: "wittgenstein_circle",
                className: "philosopher-circle",
                points: function() {
                    let corners = map_corners([
                        "Wittgenstein", "Lukasiewicz", "Koyre"
                    ]);
                    return [
                        corners.get("Lukasiewicz").top_left,
                        corners.get("Lukasiewicz").top_right,
                        {
                            x: corners.get("Lukasiewicz").top_right.x,
                            y: corners.get("Wittgenstein").top_left.y
                        },
                        corners.get("Wittgenstein").top_right,
                        corners.get("Wittgenstein").bottom_right,
                        {
                            x: corners.get("Lukasiewicz").bottom_left.x,
                            y: corners.get("Wittgenstein").bottom_left.y
                        },
                        corners.get("Lukasiewicz").top_left                        
                    ];
                }
            },
            {
                name: "vienna_circle",
                className: "philosopher-circle",
                points: function() {
                    let corners = map_corners([
                        "Neurath", "Carnap", "Koyre", "Schlick"
                    ]);
                    return [
                        corners.get("Neurath").bottom_left,
                        {
                            x: corners.get("Carnap").bottom_left.x,
                            y: corners.get("Neurath").bottom_left.y
                        },
                        corners.get("Carnap").bottom_left,
                        {
                            x: corners.get("Koyre").top_right.x,
                            y: corners.get("Carnap").bottom_right.y
                        },
                        corners.get("Koyre").top_right,
                        corners.get("Koyre").top_left,
                        {
                            x: corners.get("Koyre").bottom_left.x,
                            y: corners.get("Schlick").top_right.y
                        },
                        {
                            x: corners.get("Neurath").top_left.x,
                            y: corners.get("Schlick").top_left.y
                        },
                        corners.get("Neurath").top_left,
                        corners.get("Neurath").bottom_left
                    ];
                }
            },
            {
                name: "brentanos_circle",
                className: "philosopher-circle",
                points: function() {
                    let corners = map_corners([
                        "Brentano", "Marty", "Masaryk", "Husserl", "Ehrenfels", "Freud", "Stumpf"
                    ]);
                    return [
                        corners.get("Brentano").top_left,
                        corners.get("Brentano").top_right,
                        {
                            x: corners.get("Marty").bottom_left.x,
                            y: corners.get("Brentano").top_right.y
                        },
                        corners.get("Marty").top_left,
                        {
                            x: corners.get("Masaryk").bottom_left.x,
                            y: corners.get("Marty").top_right.y
                        },
                        corners.get("Masaryk").top_left,
                        corners.get("Masaryk").top_right,
                        {
                            x: corners.get("Masaryk").bottom_right.x,
                            y: corners.get("Husserl").top_left.y
                        },
                        {
                            x: corners.get("Ehrenfels").top_right.x,
                            y: corners.get("Husserl").top_right.y
                        },
                        corners.get("Ehrenfels").bottom_right,
                        {
                            x: corners.get("Freud").top_right.x,
                            y: corners.get("Ehrenfels").bottom_right.y
                        },
                        corners.get("Freud").bottom_right,
                        corners.get("Freud").bottom_left,
                        {
                            x: corners.get("Freud").bottom_left.x,
                            y: corners.get("Ehrenfels").bottom_right.y
                        },
                        {
                            x: corners.get("Stumpf").bottom_right.x,
                            y: corners.get("Ehrenfels").bottom_right.y
                        },
                        corners.get("Stumpf").bottom_right,
                        corners.get("Stumpf").bottom_left,
                        {
                            x: corners.get("Stumpf").bottom_left.x,
                            y: corners.get("Brentano").bottom_right.y
                        },
                        corners.get("Brentano").bottom_left,
                        corners.get("Brentano").top_left
                    ];
                }
            },
            {
                name: "gestalt_circle",
                className: "psychologist-circle",
                points: function() {
                    let corners = map_corners([
                        "Heider", "Wertheimer", "Langfeld"
                    ]);
                    return [
                        corners.get("Heider").top_right,
                        {
                            x: corners.get("Langfeld").top_left.x,
                            y: corners.get("Wertheimer").top_left.y
                        },
                        corners.get("Langfeld").bottom_left,
                        corners.get("Langfeld").bottom_right,
                        {
                            x: corners.get("Langfeld").bottom_right.x,
                            y: corners.get("Wertheimer").bottom_right.y
                        },
                        corners.get("Wertheimer").bottom_right,
                        corners.get("Heider").bottom_right,
                        corners.get("Heider").top_right
                    ];
                }
            }
        ]
    });
    
});

function order_graph(genealogy) {
    // Map names to nodes
    const byName = new Map(genealogy.people.map(function(person) {
        return [person.last, person];
    }));

    // Order by birth
    const byBirth = genealogy.people.map(function(person) { 
        return { last: person.last, born: parseInt(person.born, 10) };
    }).sort(function(a, b) {
        // Ascending by order of birth
        if (a.born < b.born) return -1;
        if (a.born > b.born) return 1;
        return 0;
    });
    
    return {
        names: byName,
        births: byBirth
    };
}

const conn_width = 1,
      conn_padding_between = 1,
      conn_padding_away = 3,
      conn_with_padding = conn_width + conn_padding_between;

function coords(str) {
    return str.substring(str.indexOf("(")+1, str.indexOf(")")).split(",");
}

function get_corners(group) {
    const box = group.node().getBBox(),
          translation = coords(group.attr("transform")),
          trans_x = parseInt(translation[0], 10),
          trans_y = parseInt(translation[1], 10);
    
    const top_left = { x: box.x + trans_x, y: box.y + trans_y },
          top_right = { x: top_left.x + box.width, y: top_left.y };

    const bottom_left = { x: box.x + trans_x, y: box.y + box.height + trans_y },
          bottom_right = { x: bottom_left.x + box.width, y: bottom_left.y };

    return {
        id: group.id,
        width: box.width,
        height: box.height,
        top_left: top_left,
        top_right: top_right,
        bottom_left: bottom_left,
        bottom_right: bottom_right
    };
}

function map_corners(names) {
    return new Map(names.map(function(name) {
        let element = d3.select("#" + name),
            corners = get_corners(element);
        return [name, corners];
    }));
}

function get_points_top(group, conns) {
    const width = (conns * conn_with_padding) - conn_padding_between,
          corners = get_corners(group);
    
    const top_midpoint = corners.top_left.x + (corners.width / 2),
          start_x = top_midpoint - (width / 2) + conn_padding_between;
    
    const points = [];
    for (var i = 0; i < conns; i++) {
        points.push({
            x: start_x + (i * conn_with_padding),
            y: corners.top_left.y - conn_padding_away,
            r: conn_width / 2
        });
    }

    return points;
}

function get_points_bottom(group, conns) {
    const width = (conns * conn_with_padding) - conn_padding_between,
          corners = get_corners(group);

    const bottom_midpoint = corners.bottom_left.x + (corners.width / 2),
          start_x = bottom_midpoint - (width / 2) + conn_padding_between;
    
    const points = [];
    for (var i = 0; i < conns; i++) {
        points.push({
            x: start_x + (i * conn_with_padding),
            y: corners.bottom_left.y + conn_padding_away,
            r: conn_width / 2
        });
    }

    return points;
}

function get_points_left(group, conns) {
    const height = (conns * conn_with_padding) - conn_padding_between,
          corners = get_corners(group);

    const left_midpoint = corners.top_left.y + (corners.height / 2),
          start_y = left_midpoint - (height / 2) + conn_padding_between;
    
    const points = [];
    for (var i = 0; i < conns; i++) {
        points.push({
            x: corners.top_left.x - conn_padding_away,
            y: start_y + (i * conn_with_padding),
            r: conn_width / 2
        });
    }

    return points;
}

function get_points_right(group, conns) {
    const height = (conns * conn_with_padding) - conn_padding_between,
          corners = get_corners(group);

    const right_midpoint = corners.top_right.y + (corners.height / 2),
          start_y = right_midpoint - (height / 2) + conn_padding_between;
    
    const points = [];
    for (var i = 0; i < conns; i++) {
        points.push({
            x: corners.top_right.x + conn_padding_away,
            y: start_y + (i * conn_with_padding),
            r: conn_width / 2
        });
    }

    return points;
}

function get_points(lastname, side, number) {
    const obj = d3.select("#" + lastname);
    switch (side) {
    case "top":
        return get_points_top(obj, number);
    case "bottom":
        return get_points_bottom(obj, number);
    case "left":
        return get_points_left(obj, number);
    case "right":
        return get_points_right(obj, number);
    default:
        console.error("YIKES");
    }
}

function connect_through_points(points) {
    
    let all = [],
        prev = {};
    
    points.forEach(function(point) {
        if (all.length == 0) {
            all.push(point);
            prev = point;
            return;
        }

        // Going left or right
        if (prev.x != point.x) {
            if (point.x > prev.x && point.x - prev.x > curvature)
                all.push({
                    x: point.x - curvature,
                    y: point.y
                });
        
            if (point.x < prev.x && prev.x - point.x > curvature)
                all.push({
                    x: point.x + curvature,
                    y: point.y
                });
        
            all.push(point);
            prev = point;
            return;
        }

        // Going up or down
        if (prev.y != point.y) {
            if (point.y > prev.y && point.y - prev.y > curvature)
                all.push({
                    x: point.x,
                    y: point.y - curvature
                });
            
            if (point.y < prev.y && prev.y - point.y > curvature)
                all.push({
                    x: point.x,
                    y: point.y + curvature
                });

            all.push(point);
            prev = point;
            return;
        }

        console.assert(false);
    });

    return all;
}

function connect_vertical_points(endpoints) {
    let points = [],
        prev = {},
        next = {};

    // Add the starting point
    points.push(endpoints.start);
    prev = endpoints.start;

    // Go up or down first (move y)
    next = {
        x: endpoints.start.x,
        y: endpoints.end.y
    };

    // Do we need to add a point in between?
    if (next.y - prev.y > curvature)
        points.push({
            x: next.x,
            y: next.y - curvature
        });

    // Add the next point
    points.push(next);
    prev = next;

    // Go east or west if need be (move x)
    if (endpoints.end.x != endpoints.start.x) {
        next = endpoints.end;
        
        // Do we need to add a point in between?
        if (next.x > prev.x && next.x - prev.x > curvature)
            points.push({
                x: prev.x + curvature,
                y: prev.y
            });
        
        if (next.x < prev.x && prev.x - next.x > curvature)
            points.push({
                x: prev.x - curvature,
                y: prev.y
            });
        
        points.push(next);
    }
    
    return points;
}

function connect_horizontal_points(endpoints) {
    let points = [],
        prev = {},
        next = {};

    // Add the starting point
    points.push(endpoints.start);
    prev = endpoints.start;

    // Go left or right first (move x)
    next = {
        x: endpoints.end.x,
        y: endpoints.start.y
    };

    // Do we need to add a point in between?
    if (next.x - prev.x > curvature)
        points.push({
            x: next.x - curvature,
            y: next.y
        });

    // Add the next point
    points.push(next);
    prev = next;

    // Go up or down if need be (move y)
    if (endpoints.end.y != endpoints.start.y) {
        next = endpoints.end;
        
        // Do we need to add a point in between?
        if (next.y > prev.y && next.y - prev.y > curvature)
            points.push({
                x: prev.x,
                y: prev.y + curvature
            });
        
        if (next.y < prev.y && prev.y - next.y > curvature)
            points.push({
                x: prev.x,
                y: prev.y - curvature
            });
        
        points.push(next);
    }
    
    return points;
}

// Initialize the line generator
const svg_line = d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });

const curvature = 1;

function connect_through(svg, name, points) {
    points = connect_through_points(points);

    // Make the line
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", "#808080")
        .style("stroke-width", points[0].r)
        .style("fill", "none");
}

function connect_vertical(svg, name, endpoints) {
    let points = connect_vertical_points(endpoints);

    // Make the line
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", "#808080")
        .style("stroke-width", endpoints.start.r)
        .style("fill", "none");
}

function connect_horizontal(svg, name, endpoints) {
    let points = connect_horizontal_points(endpoints);

    // Make the line
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", "#808080")
        .style("stroke-width", endpoints.start.r)
        .style("fill", "none");
}

function connect(svg, data) {

    // Calculate the number of points
    let points = new Map();
    data.lines.forEach(function(line) {
        let from = points.get(line.from.name);
        if (!from) from = { top: 0, bottom: 0, left: 0, right: 0 };
        from[line.from.side] += 1;
        points.set(line.from.name, from);

        let to = points.get(line.to.name);
        if (!to) to = { top: 0, bottom: 0, left: 0, right: 0 };
        to[line.to.side] += 1;
        points.set(line.to.name, to);
    });

    // Actually find the location of the points
    points.forEach(function(value, key, map) {
        let actual_points = {
            top: (value.top > 0 ? get_points(key, "top", value.top) : []),
            bottom: (value.bottom > 0 ? get_points(key, "bottom", value.bottom) : []),
            left: (value.left > 0 ? get_points(key, "left", value.left) : []),
            right: (value.right > 0 ? get_points(key, "right", value.right) : [])
        };
        map.set(key, actual_points);
    });    
    console.log("points", points);

    // Then collect endpoints based on common from edges
    let edges = new Map();
    data.lines.forEach(function(line) {
        let key1 = line.from.name + "-" + line.from.side;
        let value1 = edges.get(key1);
        if (!value1) value1 = { list: [], side: line.from.side };
        value1.list.push(line.to.name);
        edges.set(key1, value1);

        let key2 = line.to.name + "-" + line.to.side;
        let value2 = edges.get(key2);
        if (!value2) value2 = { list: [], side: line.to.side };
        value2.list.push(line.from.name);
        edges.set(key2, value2);
    });

    // And sort them by how they should get assigned a point
    edges.forEach(function(value, key, map) {
        if (value.list.length == 1)
            return;
        
        let centers = value.list.map(function(name) {
            let obj = d3.select("#" + name),
                corners = get_corners(obj);
            return {
                name: name,
                x: corners.top_left.x,
                y: corners.top_left.y
            };
        });

        switch (value.side) {
        case "top":
        case "bottom":
            centers.sort(function(a, b) {
                if (a.x < b.x) return -1;
                if (a.x > b.x) return 1;
                return 0;
            });
            value.list = centers.map(function(d) {
                return d.name;
            });
            break;
            
        case "left":
        case "right":
            centers.sort(function(a, b) {
                if (a.y < b.y) return -1;
                if (a.y > b.y) return 1;
                return 0;
            });
            value.list = centers.map(function(d) {
                return d.name;
            });
            break;
            
        default:
            console.error("HELP!");
        }

        map.set(key, value);
    });
    console.log("edges", edges);

    edges = data.fix_edges(edges);
    console.log("fixed edges", edges);

    function get_point(a, b, side) {
        let order = 0,
            edge_list = edges.get(a + "-" + side).list;

        let found = false;
        for (var i = 0; i < edge_list.length; i++) {
            if (edge_list[i] === b) {
                order = i;
                found = true;
                break;
            }
        }
        if (!found)
            console.error("OH NO!!", a + "->" + b, edge_list);

        let the_points = points.get(a);
        return the_points[side][order];
    }
    
    // Then draw the lines
    data.lines.forEach(function(line) {

        let from_point = get_point(line.from.name, line.to.name, line.from.side),
            to_point = get_point(line.to.name, line.from.name, line.to.side),
            id = line.from.name + "-" + line.to.name;

        switch (line.direction) {
        case "custom":
            line.custom(svg, id, {
                start: from_point,
                end: to_point
            });
            break;
            
        case "up":
        case "down":
            connect_vertical(svg, id, {
                start: from_point,
                end: to_point
            });
            break;
            
        case "left":
        case "right":
            connect_horizontal(svg, id, {
                start: from_point,
                end: to_point
            });
            break;
            
        default:
            console.log("Nothing HAPPENED?!?");
            return;
        }

        if (line.move_behind_middle) {
            let middle = document.getElementById("anthropologists"),
                parent = svg.node(),
                element = d3.select("#" + id);
            parent.insertBefore(element.node(), middle);
        }
    });

    // Find the convex hull containing each group of names
    data.show_groups.forEach(function(set) {

        const sharp_cornered_line = d3.line()        
                  .curve(d3.curveLinearClosed)
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; });

        // Background
        
        // Show it
        d3.select("#shown-groups")
            .append("path")
            .attr("d", sharp_cornered_line(set.points()))
            .attr("id", set.name)
            .attr("stroke-width", 12)
            .attr("stroke", "none")
            .attr("fill", "#fafafa");
    });

    data.lines.forEach(function(line) {
        if (line.move_behind) {
            let before = document.getElementById("shown-groups"),
                id = line.from.name + "-" + line.to.name,
                parent = svg.node(),
                element = d3.select("#" + id);
            parent.insertBefore(element.node(), before);
        }
    });
}
