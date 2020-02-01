// Constant dimensions
const margin = {top: 20, right: 10, bottom: 30, left: 10},
      width = document.body.offsetWidth,
      height = 500,
      display_height = height - margin.bottom,
      step = 8,
      padding = 8,
      space_between = 1;

function background_color(profession) {
    switch (profession) {
    case "linguists":
        return "#f7f5f2";
    case "anthropologists":
        return "#d4b7a9";
    case "mathematicians":
        return "#fffaed";
    case "philosophers":
        return "#c6cfc0";
    case "psychologists":
        return "#ddecf0";
    default:
        return "#ffffff";
    }
}

function background_opacity(profession) {
    switch (profession) {
    case "philosophers":
        return 0.1;
    case "psychologists":
        return 0.3;
    case "anthropologists":
        return 0.2;
    case "mathematicians":
        return 0.7;
    default:
        return 1;
    }
}

function circle_color(profession) {
    switch (profession) {
    case "linguist-circle":
        return "#f2ece4";
    case "linguist-sub-circle":
        return "#f0e7da";
    case "philosopher-circle":
        return "#eef2eb";
    case "philosopher-sub-circle":
        return "#e4eddf";
    case "psychologist-circle":
        return "#e9f3f5";
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
    const outsiders_height = step * 4,
          display_step = (display_height - (space_between*4) - step - outsiders_height) / 3;

    const band1 = { start: 0, end: display_step },
          band2 = { start: band1.end + space_between, end: band1.end + outsiders_height/2 },
          band3 = { start: band2.end + space_between, end: band2.end + outsiders_height/2 },
          band4 = { start: band3.end + space_between, end: band3.end + display_step },
          band5 = { start: band4.end + space_between, end: band4.end + display_step },
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
            { profession: "anthropologists", band: band2 },
            { profession: "mathematicians", band: band3 },
            { profession: "philosophers", band: band4 },
            { profession: "psychologists", band: band5 },
            { profession: "psychologists", band: band6 }
        ])
        .enter()
        .append("rect")
        .attr("id", function(d) { return d.profession; })
        .attr("fill", function(d) {
            return background_color(d.profession);
        })
        .attr("opacity", function(d) {
            return background_opacity(d.profession);
        })
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
    
    svg.append("g")
        .attr("id", "group-lines")
        .attr("width", width)
        .attr("height", height);
    
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
                  return d.last.split(' ').join('-');
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
                          console.error("No profession");
                          return 0;
                      }
                  };
                  
                  let person = graph.names.get(d.last);
                  return `translate(${d.x = scaleX(d.last)},${d.y = yOffset(person)})`;
              })
              .call(function(g) {
                  g.append("text")
                      .attr("fill", "#7a7a7a")
                      .attr("dy", "0.35em")
                      .text(function(d) {
                          return d.last;
                      });
                  g.append("text")
                      .attr("fill", "#7a7a7a")
                      .attr("dy", 10)
                      .text(function(d) {
                          return d.born
                      });
              });
    
    // Map out lines between each person
    connect(svg, {
        lines: [
            /**
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
                to: { name: "Bopp", side: "right" },
                direction: "left"
            },
             **/
            {
                from: "Whitney",
                to: "Mueller",
                direction: "left"
            },
            {
                from: "Whitney",
                to: "Curtius",
                direction: "left"
            },
            {
                from: "Whitney",
                to: "Lepsius",
                direction: "left"
            },
            {
                from: "Weber",
                to: "Breal",
                direction: "left"
            },
            /**
            {
                from: { name: "Trendelenberg", side: "right" },
                to: { name: "Marty", side: "bottom" },
                direction: "left"
            },
             **/
            {
                from: "Brentano",
                to: "Marty",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Masaryk",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Husserl",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Twardowski",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Ehrenfels",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Meinong",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Freud",
                direction: "right"
            },
            {
                from: "Brentano",
                to: "Stumpf",
                direction: "right"
            },
            /**
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
             **/
            {
                from: "Wertheimer",
                to: "Heider",
                direction: "right"
            },
            /**
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
             **/
            {
                from: "Osthoff",
                to: "Saussure",
                direction: "up"
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
             **/
            {
                from: "Benedict",
                to: "Mead",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Pike",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Harris",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Haas",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Hockett",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Swadesh",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Voegelin",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Newman",
                direction: "right"
            },
            {
                from: "Sapir",
                to: "Hoijer",
                direction: "right"
            },
            /**
            {
                from: "Bloomfield",
                to: "Pike",
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
             **/
            
            return edges;
        },
        show_groups: [
            {
                name: "first_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Humboldt",
                        "Schlegel",
                        "Rask",
                        "Bopp",
                        "Grimm"
                    ]);

                    return [
                        corners.get("Rask").top_right,
                        corners.get("Rask").top_left,
                        {
                            x: corners.get("Rask").top_left.x,
                            y: corners.get("Schlegel").top_right.y
                        },
                        {
                            x: corners.get("Humboldt").top_left.x,
                            y: corners.get("Schlegel").top_left.y
                        },
                        corners.get("Humboldt").bottom_left,
                        {
                            x: corners.get("Grimm").bottom_left.x - 4,
                            y: corners.get("Humboldt").bottom_left.y
                        },
                        {
                            x: corners.get("Grimm").bottom_left.x - 4,
                            y: corners.get("Grimm").bottom_left.y + 4
                        },
                        {
                            x: corners.get("Bopp").top_right.x,
                            y: corners.get("Grimm").bottom_right.y + 4
                        },
                        corners.get("Bopp").bottom_right,
                        {
                            x: corners.get("Bopp").bottom_right.x,
                            y: corners.get("Rask").top_right.y
                        },
                        corners.get("Rask").top_left
                    ];                    
                }
            },
            {
                name: "second_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Mueller",
                        "Curtius",
                        "Lepsius",
                        "Grassmann",
                        "Schleicher",
                        "Weber",
                        "Breal",
                        "Whitney"
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
                            x: corners.get("Schleicher").bottom_left.x,
                            y: corners.get("Grassmann").bottom_left.y
                        },
                        corners.get("Schleicher").bottom_left,
                        {
                            x: corners.get("Breal").bottom_right.x,
                            y: corners.get("Schleicher").bottom_left.y
                        },
                        corners.get("Breal").top_right,
                        {
                            x: corners.get("Whitney").top_right.x,
                            y: corners.get("Breal").top_left.y
                        },
                        corners.get("Whitney").top_right,
                        {
                            x: corners.get("Mueller").top_right.x,
                            y: corners.get("Whitney").top_right.y
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
                        "Baudouin-de-Courtenay",
                        "Schuchardt",
                        "Leskien",
                        "Delbruck",
                        "Sievers",
                        "Brugmann",
                        "Saussure",
                        "Lanman"
                    ]);
                    return [
                        {
                            x: corners.get("Schuchardt").top_left.x,
                            y: corners.get("Baudouin-de-Courtenay").top_left.y
                        },
                        corners.get("Schuchardt").bottom_left,
                        {
                            x: corners.get("Leskien").top_left.x - 8,
                            y: corners.get("Schuchardt").bottom_left.y
                        },
                        {
                            x: corners.get("Leskien").top_left.x - 8,
                            y: corners.get("Delbruck").bottom_left.y + 8
                        },
                        {
                            x: corners.get("Sievers").top_right.x + 8,
                            y: corners.get("Delbruck").bottom_left.y + 8
                        },
                        {
                            x: corners.get("Sievers").top_right.x + 8,
                            y: corners.get("Saussure").bottom_left.y
                        },
                        corners.get("Saussure").bottom_right,
                        corners.get("Saussure").top_right,
                        {
                            x: corners.get("Lanman").bottom_right.x,
                            y: corners.get("Saussure").top_right.y
                        },
                        {
                            x: corners.get("Lanman").bottom_right.x,
                            y: corners.get("Baudouin-de-Courtenay").top_right.y
                        }
                    ];
                }
            },
            {
                name: "neo-grammarians",
                className: "linguist-sub-circle",
                points: function() {
                    let corners = map_corners([
                        "Leskien", "Delbruck", "Brugmann", "Sievers", "Osthoff"
                    ]);
                    return [
                        corners.get("Leskien").top_left,
                        corners.get("Leskien").bottom_left,
                        {
                            x: corners.get("Delbruck").top_left.x,
                            y: corners.get("Leskien").bottom_left.y
                        },
                        corners.get("Delbruck").bottom_left,
                        {
                            x: corners.get("Sievers").bottom_right.x,
                            y: corners.get("Delbruck").bottom_right.y
                        },
                        {
                            x: corners.get("Sievers").top_right.x,
                            y: corners.get("Leskien").top_right.y
                        },
                        corners.get("Leskien").top_left
                    ];
                }
            },
            /**
            {
                name: "third_generation",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Leskien", "Delbruek", "Brugmann", "Grassmann",
                        "Saussure", "Sievers", "Osthoff", "Schuchardt"
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
             **/
            {
                name: "sapir_circle",
                className: "linguist-circle",
                points: function() {
                    let corners = map_corners([
                        "Sapir",
                        "Benedict",
                        "Mead",
                        "Hoijer",
                        "Voegelin",
                        "Newman",
                        "Haas",
                        "Hockett",
                        "Swadesh",
                        "Harris",
                        "Pike"
                    ]);
                    return [
                        corners.get("Sapir").top_left,
                        corners.get("Sapir").bottom_left,
                        {
                            x: corners.get("Benedict").top_left.x,
                            y: corners.get("Sapir").bottom_left.y
                        },
                        {
                            x: corners.get("Benedict").bottom_left.x,
                            y: corners.get("Benedict").bottom_left.y - 4
                        },
                        {
                            x: corners.get("Mead").bottom_right.x,
                            y: corners.get("Mead").bottom_right.y - 4
                        },
                        {
                            x: corners.get("Mead").bottom_right.x,
                            y: corners.get("Hoijer").bottom_left.y
                        },
                        {
                            x: corners.get("Newman").bottom_right.x + 4,
                            y: corners.get("Hoijer").bottom_left.y
                        },
                        {
                            x: corners.get("Newman").bottom_right.x + 4,
                            y: corners.get("Haas").bottom_right.y
                        },
                        corners.get("Haas").bottom_right,
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
                            x: corners.get("Swadesh").top_right.x,
                            y: corners.get("Hockett").top_right.y
                        },
                        corners.get("Swadesh").top_right,
                        {
                            x: corners.get("Harris").top_right.x,
                            y: corners.get("Swadesh").top_right.y
                        },
                        {
                            x: corners.get("Pike").top_right.x,
                            y: corners.get("Swadesh").top_right.y
                        },
                        corners.get("Pike").top_right,
                        corners.get("Pike").top_left,
                        {
                            x: corners.get("Pike").top_left.x,
                            y: corners.get("Sapir").top_right.y
                        },
                        corners.get("Sapir").top_left
                    ];
                }
            },
            {
                name: "vienna_penumbra",
                className: "philosopher-circle",
                points: function() {
                    let corners = map_corners([
                        "Wittgenstein",
                        "Reichenbach",
                        "Schlick",
                        "Neurath",
                        "Carnap"
                    ]);
                    return [
                        corners.get("Wittgenstein").top_left,
                        {
                            x: corners.get("Wittgenstein").top_left.x,
                            y: corners.get("Neurath").top_left.y - 8
                        },
                        {
                            x: corners.get("Neurath").top_left.x - 8,
                            y: corners.get("Neurath").top_left.y - 8
                        },
                        {
                            x: corners.get("Neurath").top_left.x - 8,
                            y: corners.get("Schlick").bottom_left.y + 8
                        },
                        {
                            x: corners.get("Reichenbach").bottom_right.x + 8,
                            y: corners.get("Carnap").bottom_right.y + 8
                        },
                        {
                            x: corners.get("Reichenbach").bottom_right.x + 8,
                            y: corners.get("Wittgenstein").top_left.y
                        },
                        corners.get("Wittgenstein").top_left
                    ];
                }
            },
            {
                name: "vienna_circle",
                className: "philosopher-sub-circle",
                points: function() {
                    let corners = map_corners([
                        "Schlick",
                        "Neurath",
                        "Carnap"
                    ]);
                    return [
                        corners.get("Neurath").top_left,
                        corners.get("Schlick").bottom_left,
                        corners.get("Schlick").bottom_right,
                        {
                            x: corners.get("Carnap").bottom_right.x,
                            y: corners.get("Schlick").bottom_right.y
                        },
                        corners.get("Carnap").top_right,
                        {
                            x: corners.get("Neurath").bottom_right.x,
                            y: corners.get("Carnap").top_right.y
                        },
                        corners.get("Neurath").top_right,
                        corners.get("Neurath").top_left
                    ];
                }
            },
            {
                name: "brentanos_circle",
                className: "philosopher-circle",
                experimental: true,
                points: function() {
                    let corners = map_corners([
                        "Brentano",
                        "Marty",
                        "Masaryk",
                        "Husserl",
                        "Twardowski",
                        "Ehrenfels",
                        "Freud",
                        "Meinong",
                        "Stumpf"
                    ]);

                    let ps = [];
                    corners.forEach(function(data, name, map) {
                        ps.push(
                            [data.top_left.x, data.top_left.y],
                            [data.top_right.x, data.top_right.y],
                            [data.bottom_left.x, data.bottom_left.y],
                            [data.bottom_right.x, data.bottom_right.y]
                        );
                    });

                    const delaunay = d3.Delaunay.from(ps);

                    const simple_hull = d3.polygonHull(ps);
                    const delaunay_hull = delaunay.hullPolygon();

                    console.log("simple", simple_hull);
                    console.log("delaunay", delaunay_hull);

                    const centroid = d3.polygonCentroid(delaunay_hull);
                    
                    // Gather all triangles
                    var all_triangles = [];

                    let iter = delaunay.trianglePolygons(),
                        next = iter.next();
                    while (!next.done) {
                        all_triangles.push(next.value);
                        next = iter.next();
                    }
                    
                    // Gather the exterior triangles
                    var exterior_triangles = [];

                    const halfedges = delaunay.halfedges;
                    for (let i = 0, n = halfedges.length; i < n; ++i) {
                        const j = halfedges[i];
                        if (j < 0) {
                            
                            let triangle = Math.floor(i/3);

                            const t0 = delaunay.triangles[triangle * 3 + 0];
                            const t1 = delaunay.triangles[triangle * 3 + 1];
                            const t2 = delaunay.triangles[triangle * 3 + 2];

                            console.log("triangle(" + triangle + ")", t0, t1, t2);

                            const t0_points = [delaunay.points[t0 * 2],
                                               delaunay.points[t0 * 2 + 1]];
                            const t1_points = [delaunay.points[t1 * 2],
                                               delaunay.points[t1 * 2 + 1]];
                            const t2_points = [delaunay.points[t2 * 2],
                                               delaunay.points[t2 * 2 + 1]];

                            console.log(t0_points, t1_points, t2_points);

                            exterior_triangles.push([t0_points, t1_points, t2_points, t0_points]);
                        }
                    }

                    console.log(exterior_triangles);

                    var point_set = new Set();
                    exterior_triangles.forEach(function(triangle) {
                        point_set.add(triangle[0][0] + "," + triangle[0][1]);
                        point_set.add(triangle[1][0] + "," + triangle[1][1]);
                        point_set.add(triangle[2][0] + "," + triangle[2][1]);
                    });

                    function euclidean(cx, cy, ex, ey) {
                        var dy = ey - cy;
                        var dx = ex - cx;
                        return Math.sqrt((dx*dx) + (dy*dy));
                    }

                    // Remove fourth points that are closest to the centroid
                    corners.forEach(function(data, name, map) {
                        const tl = data.top_left.x + "," + data.top_left.y,
                              tr = data.top_right.x + "," + data.top_right.y,
                              bl = data.bottom_left.x + "," + data.bottom_left.y,
                              br = data.bottom_right.x + "," + data.bottom_right.y;

                        if (point_set.has(tl) && point_set.has(tr) &&
                            point_set.has(bl) && point_set.has(br)) {

                            console.log("found 4 points:", name);

                            var four = [
                                {
                                    x: data.top_left.x,
                                    y: data.top_left.y
                                },
                                {
                                    x: data.top_right.x,
                                    y: data.top_right.y
                                },
                                {
                                    x: data.bottom_left.x,
                                    y: data.bottom_left.y
                                },
                                {
                                    x: data.bottom_right.x,
                                    y: data.bottom_right.y
                                }
                            ];
                            
                            for (var i = 0; i < four.length; i++)
                                four[i].dist = euclidean(centroid[0], centroid[1],
                                                         four[i].x, four[i].y);
                            
                            four.sort(function(a, b) {
                                return a.dist - b.dist;
                            });

                            const closest = four[0].x + "," + four[0].y;
                            point_set.delete(closest);
                        }
                    });                    
                    

                    function angle(cx, cy, ex, ey) {
                        var dy = ey - cy;
                        var dx = ex - cx;
                        var theta = Math.atan2(dy, dx); // range (-PI, PI]
                        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
                        if (theta < 0) theta = 360 + theta; // range [0, 360)
                        return theta;
                    }
                    
                    var exterior_points = [];
                    for (let item of point_set.values()) {
                        console.log(item);
                        let coords = item.split(','),
                            x = parseFloat(coords[0]),
                            y = parseFloat(coords[1]);
                        exterior_points.push({
                            x: x,
                            y: y,
                            theta: angle(centroid[0], centroid[1], x, y)
                        });
                    }
                    console.log("exteriorpoints", exterior_points);

                    exterior_points.sort(function(a, b) {
                        return a.theta - b.theta;
                    });
                    console.log("(sorted) exterior points", exterior_points);

                    // Add the first one to the end to ensure a closed loop
                    exterior_points.push(exterior_points[0]);
                    
                    return {
                        centroid: centroid,
                        outer: delaunay_hull,
                        all_triangles: all_triangles,
                        exterior_triangles: exterior_triangles,
                        exterior_points: exterior_points.map(function(p) {
                            return [p.x, p.y];
                        }),
                        all: ps
                    };
                    
                    /**
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
                        {
                            x: corners.get("Ehrenfels").top_right.x,
                            y: corners.get("Twardowski").top_right.y
                        },
                        corners.get("Twardowski").top_right,
                        corners.get("Twardowski").bottom_right,
                        {
                            x: corners.get("Ehrenfels").top_right.x,
                            y: corners.get("Twardowski").bottom_right.y
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
                            y: corners.get("Meinong").bottom_right.y
                        },
                        corners.get("Meinong").bottom_left,
                        {
                            x: corners.get("Meinong").bottom_left.x,
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
                     **/
                }
            },
            {
                name: "gestalt_circle",
                className: "psychologist-circle",
                points: function() {
                    let corners = map_corners([
                        "Lewin",
                        "Koffka",
                        "Heider",
                        "Wertheimer",
                        "Langfeld"
                    ]);
                    return [
                        {
                            x: corners.get("Heider").top_right.x,
                            y: corners.get("Lewin").top_right.y
                        },
                        {
                            x: corners.get("Langfeld").top_left.x,
                            y: corners.get("Koffka").top_left.y
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
        return {
            last: person.last,
            born: parseInt(person.born, 10),
            died: parseInt(person.died, 10),
            government: (person.government ? true : false)
        };
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

const conn_width = 3,
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

function get_midpoint(lastname) {
    const group = d3.select("#" + lastname),
          corners = get_corners(group),
          top_midpoint = corners.top_left.x + (corners.width / 2),
          left_midpoint = corners.top_left.y + (corners.height / 2);
    
    return {
        x: top_midpoint,
        y: left_midpoint,
        r: conn_width / 2
    };
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

const curvature = 30;
//const line_color = "#b0b0b0";
const line_color = "#ffffff",
      line_opacity = 0.6;

function connect_through(svg, name, points) {
    points = connect_through_points(points);

    // Make the line
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", line_color)
        .style("stroke-width", points[0].r)
        .style("stroke-opacity", line_opacity)
        .style("fill", "none");
}

function connect_vertical(svg, name, endpoints) {
    let points = connect_vertical_points(endpoints);

    // Make the line
    d3.select("#group-lines")
        .append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", line_color)
        .style("stroke-width", endpoints.start.r)
        .style("stroke-opacity", line_opacity)
        .style("fill", "none");
}

function connect_horizontal(svg, name, endpoints) {
    let points = connect_horizontal_points(endpoints);

    // Make the line
    d3.select("#group-lines")
        .append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("stroke", line_color)
        .style("stroke-width", endpoints.start.r)
        .style("stroke-opacity", line_opacity)
        .style("fill", "none");
}

function connect(svg, data) {
    
    // Then draw the lines
    data.lines.forEach(function(line) {

        /**
        let from_points = get_points(line.from.name, line.from.side, 1),
            from_point = from_points[0];

        let to_points = get_points(line.to.name, line.to.side, 1),
            to_point = to_points[0];
         **/

        console.log(line.from, "->", line.to);

        let from_point = get_midpoint(line.from),
            to_point = get_midpoint(line.to);

        let id = line.from + "-" + line.to;
        
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
    
    function euclidean(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        return Math.sqrt((dx*dx) + (dy*dy));
    }
    
    function point_near_centroid(a, b, centroid) {
        // No need, we can draw a straight line
        if (a[0] == b[0] || a[1] == b[1]) {
            console.log("straight line", a, b);
            return null;
        }
        
        var options = [
            { x: a[0], y: b[1] }, // up or down (y changes)
            { x: b[0], y: a[1] } // left or right (x changes)
        ];
        for (var i = 0; i < options.length; i++) {
            options[i].dist = euclidean(centroid[0], centroid[1],
                                        options[i].x, options[i].y);
        }
        options.sort(function(a, b) {
            return a.dist - b.dist;
        });
        const closest = options[0];
        return [closest.x, closest.y];
    }

    // Find the convex hull containing each group of names
    data.show_groups.forEach(function(set) {

        var shown_groups = d3.select("#shown-groups");
        
        if (set.experimental) {
            const curve_linear = d3.line()        
                      .curve(d3.curveLinearClosed)
                      .x(function(d) { return d[0]; })
                      .y(function(d) { return d[1]; });
            
            let points = set.points();
            console.log(set.name, points);

            // Add points between the exterior points so that
            // steps are close to the centroid
            let points_interpolated = [];

            for (var i = 0; i < points.exterior_points.length-1; i++) {
                let a = points.exterior_points[i],
                    b = points.exterior_points[i+1];
                
                points_interpolated.push(a);
                let inter = point_near_centroid(a, b, points.centroid);
                if (inter)
                    points_interpolated.push(inter);
            }
            console.log("interpolated", points_interpolated);

            shown_groups.append("path")
                .attr("d", curve_linear(points_interpolated))
                .attr("id", set.name)
                .attr("stroke-width", 12)
                .attr("stroke", function(d) { return circle_color(set.className); })
                .attr("fill", function(d) { return circle_color(set.className); });

            /**
            points.all_triangles.forEach(function(d) {
                shown_groups.append("path")
                    .attr("d", linear_closed(d))
                    .attr("stroke_width", 1)
                    .attr("stroke", "#7d7d7d")
                    .attr("fill", "none");
            });

            points.exterior_triangles.forEach(function(d) {
                shown_groups.append("path")
                    .attr("d", linear_closed(d))
                    .attr("stroke_width", 1)
                    .attr("stroke", "none")
                    .attr("fill", "rgba(255, 0, 0, 0)");
            });
            
            points.all.forEach(function(d) {
                shown_groups.append("circle")
                    .attr("class", "point")
                    .attr("r", 2)
                    .attr("cx", d[0])
                    .attr("cy", d[1])
                    .attr("stroke", "none")
                    .attr("fill", "#ff0000");
            });
            
            points_interpolated.forEach(function(d) {
                shown_groups.append("circle")
                    .attr("class", "point")
                    .attr("r", 2)
                    .attr("cx", d[0])
                    .attr("cy", d[1])
                    .attr("stroke", "none")
                    .attr("fill", "#00eeff");
            });

            shown_groups.append("circle")
                .attr("class", "point")
                .attr("r", 3)
                .attr("cx", points.centroid[0])
                .attr("cy", points.centroid[1])
                .attr("stroke", "none")
                .attr("fill", "#ff00e1");
            **/
            
            return;
        }

        const sharp_cornered_line = d3.line()        
                  .curve(d3.curveLinearClosed)
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; });

        console.log(set, set.points());
        
        // Show it
        shown_groups.append("path")
            .attr("d", sharp_cornered_line(set.points()))
            .attr("id", set.name)
            .attr("stroke-width", 12)
            .attr("stroke", function(d) { return circle_color(set.className); })
            .attr("fill", function(d) { return circle_color(set.className); });
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
