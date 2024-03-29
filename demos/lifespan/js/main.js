
// Constant dimensions
const margin = {top: 50, right: 100, bottom: 30, left: 100},
      width = document.body.offsetWidth * 0.85,
      step = 8,
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

// Load and parse the json data
d3.json("data/people.json").then(function(genealogy) {
    
    // Sort the people in the graph
    const graph = order_graph(genealogy);
    console.log(graph);

    // Define the order of the people
    const people_grouped_1 = [
        "Kant",
        "Herder",
        "Fichte",
        "_0",
        "Humboldt",
        "Schlegel",
        "Grimm",
        "Rask",
        "Bopp",
        "_1",
        "Grassmann",
        "Lepsius",
        "Curtius",
        "Roth",
        "Schleicher",
        "Mueller",
        "Weber",
        "_2",
        "Steinthal",
        "_3",
        "Whitney",
        "_4",
        "Breal",
        "_5",
        "Leskien",
        "Schuchardt",
        "Baudouin de Courtenay",
        "Osthoff",
        "Brugmann",
        "Lanman",
        "Sievers",
        "Harper",
        "Saussure",
        "Dewey",
        "Boas",
        "_6",
        "Meillet",
        "_7",
        "Buck",
        "_8",
        "Sapir",
        "Bloomfield",
        "Benedict",
        "Mead",
        "Hoijer",
        "Newman",
        "Pike",
        "Voegelin",
        "Harris",
        "Swadesh",
        "Haas",
        "Hockett",
        "_31",
        "Halle"
    ];
    
    var people_grouped_2 = [
        "Hegel",
        "Comte",
        "Fechner",
        "Trendelenberg",
        "Mill",
        "Lotze",
        "_10",
        "Brentano",
        "Marty",
        "Stumpf",
        "Masaryk",
        "Freud",
        "Ehrenfels",
        "Husserl",
        "_11",
        "Hilbert",
        "_23",
        "Meinong",
        "_12",
        "Twardowski",
        "_15",
        "Russell",
        "_19",
        "Lukasiewicz",
        "Wittgenstein",
        "_20",
        "Neurath",
        "Schlick",
        "Carnap",
        "Reichenbach",
        "Koyre",
        "_21",
        "Cassirer",
        "_16",
        "Langfeld",
        "Wertheimer",
        "Koffka",
        "Lewin",
        "Heider",
        "_9",
        "Wundt",
        "_17",
        "Loeb",
        "Titchener",
        "Angell",
        "Meyer",
        "Watson",
        "Hull",
        "Tolman",
        "Lashley",
        "Allport",
        "Skinner",
        "Bruner",
        "_13",
        "Chelpanov",
        "Karchevsky",
        "_14",
        "Shpet",
        "Mathesius",
        "Trubetzkoy",
        "Jakobson",
        "Wellek",
        "_18",
        "Reifler",
        "Lehmann",
        "Garvin",
        "Yngve",
        "Chomsky",
        "Lamb",
        "Oettinger",
        "_30"
    ];
    people_grouped_2.reverse();

    const group1 = new Set(people_grouped_1.filter(function(name) {
        return name[0] != '_';
    }));
    const group2 = new Set(people_grouped_2.filter(function(name) {
        return name[0] != '_';
    }));

    const teachers = [
        { "from": "Kant", "to": "Herder" },
        { "from": "Herder", to: "Fichte" },
        { "from": "Kant", "to": "Fichte" },
        { "from": "Herder", "to": "Humboldt" },
        
        { from: "Humboldt", to: "Steinthal" },
        { from: "Steinthal", to: "Boas" },
        
        { from: "Bopp", to: "Whitney" },
        { from: "Lepsius", to: "Whitney" },
        { from: "Curtius", to: "Whitney" },
        { from: "Mueller", to: "Whitney" },
        { from: "Weber", to: "Breal" },

        { from: "Whitney", to: "Harper" },
        { from: "Whitney", to: "Lanman" },
        { from: "Whitney", to: "Buck" },
        { from: "Osthoff", to: "Saussure" },

        { from: "Boas", to: "Sapir" },
        { from: "Boas", to: "Benedict" },
        { from: "Buck", to: "Bloomfield" },
        { from: "Benedict", to: "Mead" },
        { from: "Sapir", to: "Pike" },
        { from: "Sapir", to: "Harris" },
        { from: "Sapir", to: "Haas" },
        { from: "Sapir", to: "Hockett" },
        { from: "Sapir", to: "Swadesh" },
        { from: "Sapir", to: "Voegelin" },
        { from: "Sapir", to: "Newman" },
        { from: "Sapir", to: "Hoijer" },
        { from: "Bloomfield", to: "Pike" },
        { from: "Bloomfield", to: "Harris" },
        { from: "Bloomfield", to: "Hockett" },

        { from: "Comte", to: "Brentano" },
        { from: "Trendelenberg", to: "Brentano" },
        { from: "Trendelenberg", to: "Marty" },
        { from: "Mill", to: "Brentano" },

        { from: "Steinthal", to: "Wundt" },
        { from: "Wundt", to: "Chelpanov" },
        { from: "Wundt", to: "Titchener" },
        { from: "Wundt", to: "Angell" },
        { from: "Titchener", to: "Watson" },
        { from: "Angell", to: "Watson" },
        { from: "Loeb", to: "Watson" },
        { from: "Watson", to: "Hull" },
        { from: "Watson", to: "Tolman" },
        { from: "Watson", to: "Lashley" },
        { from: "Watson", to: "Allport" },
        { from: "Watson", to: "Skinner" },
        { from: "Allport", to: "Bruner" },

        { from: "Brentano", to: "Marty" },
        { from: "Brentano", to: "Stumpf" },
        { from: "Brentano", to: "Masaryk" },
        { from: "Brentano", to: "Meinong" },
        { from: "Brentano", to: "Freud" },
        { from: "Brentano", to: "Ehrenfels" },
        { from: "Brentano", to: "Husserl" },
        { from: "Brentano", to: "Twardowski" },
        
        { from: "Husserl", to: "Hilbert" },

        { from: "Marty", to: "Mathesius", extra_space: 50 },
        { from: "Masaryk", to: "Mathesius", extra_space: 50 },
        { from: "Chelpanov", to: "Shpet" },
        { from: "Shpet", to: "Jakobson" },

        { from: "Russell", to: "Wittgenstein" },

        { from: "Cassirer", to: "Lewin" },
        { from: "Sapir", to: "Koffka", extra_space: 25 },
        
        { from: "Stumpf", to: "Langfeld" }, 
        { from: "Stumpf", to: "Wertheimer" }, 
        { from: "Stumpf", to: "Allport" }, 
        { from: "Wertheimer", to: "Heider" },
        { from: "Wertheimer", to: "Allport", extra_space: 75 },
        { from: "Langfeld", to: "Allport", extra_space: 75 },
        
        { from: "Jakobson", to: "Halle" },
        { from: "Halle", to: "Chomsky" },
        { from: "Harris", to: "Chomsky" },
        { from: "Voegelin", to: "Garvin" }
    ];

    const first_gen = {
        label: "First Generation",
        start: "Humboldt",
        end: "Bopp",
        color: stroke_color("linguist")
    };
    const second_gen = {
        label: "Second Generation",
        start: "Grassmann",
        end: "Weber",
        color: stroke_color("linguist")
    };
    const third_gen = {
        label: "Third Generation",
        start: "Leskien",
        end: "Boas",
        color: stroke_color("linguist")
    };
    const sapir_circle = {
        label: "Sapir Circle",
        start: "Sapir",
        end: "Hockett",
        color: stroke_color("linguist")
    };
    const machine_trans = {
        label: "Machine Translation",
        start: "Oettinger",
        end: "Reifler",
        color: stroke_color("linguist")
    };
    const prague_circle = {
        label: "Prague Circle",
        start: "Wellek",
        end: "Shpet",
        color: stroke_color("linguist")
    };
    const moscow_school = {
        label: "Moscow School",
        start: "Karchevsky",
        end: "Chelpanov",
        color: stroke_color("linguist")
    };
    const gestalt = {
        label: "Gestalt",
        start: "Heider",
        end: "Langfeld",
        color: stroke_color("psychologist")
    };
    const vienna_circle = {
        label: "Vienna Circle",
        start: "Koyre",
        end: "Neurath",
        color: stroke_color("philosopher")
    };
    const brentano_circle = {
        label: "Brentano Circle",
        start: "Husserl",
        end: "Brentano",
        color: stroke_color("philosopher")
    };

    const all_people = people_grouped_1.concat(people_grouped_2);

    // Calculate the height of the SVG
    const height = (all_people.length - 1)*step + margin.top + margin.bottom;
    
    // Define the scales
    const earliest_birth = graph.births[0],
          latest_death = graph.deaths[graph.deaths.length - 1];

    console.log("earliest birth", earliest_birth);
    console.log("latest death", latest_death);

    const xRange = [margin.left, width - (margin.left + margin.right)],
          xScale = d3.scaleLinear()
              .domain([earliest_birth.born, latest_death.died])
              .range(xRange),
          timeScale = d3.scaleTime()
              .domain([new Date(earliest_birth.born, 0, 1),
                       new Date(latest_death.died, 0, 1)])
              .range(xRange);

    const scaleX = function(last) {
        let person = graph.names.get(last),
            birth = parseInt(person.born, 10);
        return xScale(birth);
    };
    const scaleDeath = function(last) {
        let person = graph.names.get(last);
        if (person.died.length == 0)
            return -1;
        
        let died = parseInt(person.died, 10);
        return xScale(died);
    };
    const scaleY = d3.scalePoint(all_people, [margin.top, height - margin.bottom]);
        
    // Create the SVG
    var svg = d3.select("#svg-container").append("svg")
            .attr("width", width)
            .attr("height", height);

    // Define the path interpolator for lifespan lines
    const lifespan_line = d3.line()
              .curve(d3.curveLinear)
              .x(function(d) { return d.x; })
              .y(function(d) { return d.y; });    

    // Place the grid
    var gridx = svg.append("g")
        .attr("id", "gridx")
        .attr("transform", function() {
            return `translate(0,${height})`;
        })
        .call(d3.axisTop(timeScale)
              .ticks(d3.timeYear.every(20))
              .tickSize(height - margin.top/2)
              .tickPadding(10)
              .tickFormat(function(d) {
                  return d.getFullYear();
              }))
        .call(function(g) {
            g.select(".domain").remove();
        });

    // Apply inline styles for easy exporting
    gridx.selectAll("line")
        .style("stroke", "#cccccc")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3)
        .style("shape-rendering", "crispEdges");
    
    gridx.selectAll("text")
        .style("font-family", "serif")
        .style("font-size", 9)
        .style("fill", "#808080");
    
    // Place the subgroups
    svg.append("g")
        .attr("font-family", "serif")
        .attr("font-size", 7.5)
        .attr("letter-spacing", "0.5px")
        .attr("text-anchor", "left")
        .selectAll("g")
        .data([
            first_gen,
            second_gen,
            third_gen,
            sapir_circle,
            machine_trans,
            prague_circle,
            moscow_school,
            gestalt,
            vienna_circle,
            brentano_circle
        ])
        .join("g")
        .attr("class", "subgroup")
        .attr("id", function(d) { return d.label; })
        .attr("transform", function(d) {

            let names = [];
            for (var i = 0; i < all_people.length; i++) {
                if (all_people[i] === d.start) {
                    names.push(all_people[i]);
                    continue;
                }
                if (all_people[i] === d.end) {
                    names.push(all_people[i]);
                    break;
                }
                if (names.length > 0) {
                    names.push(all_people[i]);
                }
            }
            let birthsX = names.map(function(name) {
                return scaleX(name);
            });
            let maxBirthX = birthsX.reduce(function(a, b) {
                return Math.max(a, b);
            });

            d.startX = maxBirthX + 10;
            d.endX = width - margin.right;
            
            let startY = scaleY(d.start);
            return `translate(${d.startX},${startY - line_padding})`;
        })
        .call(function(g) {
            g.append("rect")
                .style("stroke", "none")
                .style("fill", function(d) { return d.color; })
                .style("opacity", 0.2)
                .attr("width", function(d) {
                    return d.endX - d.startX;
                })
                .attr("height", function(d) {
                    let startY = scaleY(d.start),
                        endY = scaleY(d.end);
                    return endY - startY + (line_padding*2);
                });
            
            g.append("text")
                .attr("x", function(d) { return (d.endX - d.startX) + 15; })
                .attr("y", function(d) {
                    let startY = scaleY(d.start),
                        endY = scaleY(d.end),
                        height = endY - startY + (line_padding*2);
                    return (height/2) + 1.5;
                })
                .attr("id", function(d) {
                    return "label-" + d.label;
                })
                .style("font-size", 9)
                .style("fill", "#808080")
                .text(function(d) {
                    return d.label;
                });
        });
        
    // Place the people
    const people = svg.append("g")
              .attr("font-family", "serif")
              .attr("font-size", 6)
              .attr("letter-spacing", "0.5px")
              .attr("text-anchor", "left")
              .selectAll("g")
              .data(all_people.filter(function(name) {
                  return name[0] != '_';
              }).map(function(name) {
                  let person = graph.names.get(name);
                  return {
                      last: person.last,
                      born: parseInt(person.born, 10),
                      died: (person.died.length > 0 ? parseInt(person.died, 10) : 0)
                  };
              }))
              .join("g")
              .attr("class", "person")
              .attr("id", function(d) {
                  return d.last;
              })
              .attr("transform", function(d) {
                  return `translate(${d.x = scaleX(d.last)},${d.y = scaleY(d.last)})`;
              })
              .call(function(g) {
                  g.append("text")
                      .attr("x", 0)
                      .attr("y", 1.5)
                      .attr("id", function(d) {
                          return "head-" + d.last.replace(/\s/g, "-");
                      })
                      .style("fill", "#808080")
                      .text(function(d) {
                          return d.last + " " + d.born;
                      });
                  
                  g.append("line")
                      .attr("id", function(d) {
                          return d.last.replace(/\s/g, "-") + "-lifespan";
                      })
                      .attr("class", "lifespan-line")
                      .style("stroke", function(d) {
                          let person = graph.names.get(d.last);
                          return stroke_color(person.profession);
                      })
                      .style("stroke-width", 2)
                      .style("fill", "none")
                      .attr("x1", 0)
                      .attr("x2", function(d) {
                          let start = xScale(d.born),
                              end = (d.died > 0 ? xScale(d.died) : width - margin.right);
                          return end - start;
                      })
                      .attr("y1", 0)
                      .attr("y2", 0);

                  g.append("text")
                      .attr("x", function(d) {
                          let start = xScale(d.born),
                              end = (d.died > 0 ? xScale(d.died) : xRange[1]);
                          return end - start + line_padding;
                      })
                      .attr("y", 1.5)
                      .style("fill", "#808080")
                      .text(function(d) {
                          if (d.died == 0)
                              return "";
                          return d.died;
                      });
              });

    // Move names out from behind lines
    all_people.forEach(function(name) {
        if (name[0] == '_')
            return;

        let person = graph.names.get(name),
            key = "head-" + person.last.replace(/\s/g, "-"),
            head = d3.select("#" + key);
        
        let head_width = head.node().getBBox().width + line_padding;
        head.attr("x", -head_width);
    });

    const half_circle = d3.arc()
              .startAngle(Math.PI)
              .endAngle(Math.PI * 2);

    const svg_line = d3.line()
              .curve(d3.curveLinear)
              .x(function(d) { return d.x; })
              .y(function(d) { return d.y; });
    
    let links = svg.append("g").attr("id", "links");
    
    // Make the teacher arcs
    teachers.forEach(function(link) {
        const inGroup1 = group1.has(link.from),
              inGroup2 = group2.has(link.from);
        console.assert(inGroup1 || inGroup2);
        
        const source_left = center_left(link.from),
              target_left = center_left(link.to),
              arc_radius = Math.abs(target_left.y - source_left.y) / 2;

        let from_person = graph.names.get(link.from);
        const stroke = stroke_color(from_person.profession);
        
        var arc_y = 0;
        if (inGroup1)
            arc_y = source_left.y + arc_radius;
        if (inGroup2)
            arc_y = source_left.y - arc_radius;

        var arc_x = source_left.x - line_padding;
        if (link.extra_space)
            arc_x -= link.extra_space;
        
        // Draw the arc
        links.append("path")
            .attr("d", half_circle({
                innerRadius: arc_radius,
                outerRadius: arc_radius
            }))
            .attr("transform", `translate(${arc_x},${arc_y})`)
            .attr("id", "arc:" + link.from + "-" + link.to)
            .attr("stroke", stroke)
            .style("stroke-width", 1.5)
            .style("stroke-opacity", 1)
            .style("fill", "none");

        if (link.extra_space) {
            links.append("path")
                .attr("d", svg_line([
                    {x: arc_x, y: source_left.y},
                    {x: source_left.x - line_padding, y: source_left.y}
                ]))
                .attr("id", "extra-line:" + link.from + "-" + link.to)
                .attr("stroke", stroke)
                .style("stroke-width", 1.5)
                .style("stroke-opacity", 1)
                .style("fill", "none");
        }
        
        links.append("path")
            .attr("d", svg_line([
                {x: arc_x, y: target_left.y},
                {x: target_left.x - line_padding, y: target_left.y}
            ]))
            .attr("id", "line:" + link.from + "-" + link.to)
            .attr("stroke", stroke)
            .style("stroke-width", 1.5)
            .style("stroke-opacity", 1)
            .style("fill", "none");
    });
});

function coords(str) {
    return str.substring(str.indexOf("(")+1, str.indexOf(")")).split(",");
}

function center_left(key) {
    const group  = d3.select("#" + key);
    
    const box = group.node().getBBox(),
          translation = coords(group.attr("transform")),
          trans_x = parseInt(translation[0], 10),
          trans_y = parseInt(translation[1], 10);

    const top_left = { x: box.x + trans_x, y: box.y + trans_y };
          
    return { x: top_left.x, y: top_left.y + (box.height/2) };
}

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
            died: (person.died.length > 0 ? parseInt(person.died, 10) : 0)
        };
    }).sort(function(a, b) {
        // Ascending by order of birth
        if (a.born < b.born) return -1;
        if (a.born > b.born) return 1;
        return 0;
    });

    // Order by death
    const byDeath = genealogy.people.filter(function(person) {
        return person.died.length > 0;
    }).map(function(person) { 
        return {
            last: person.last,
            born: parseInt(person.born, 10),
            died: parseInt(person.died, 10)
        };
    }).sort(function(a, b) {
        // Ascending by order of birth
        if (a.died < b.died) return -1;
        if (a.died > b.died) return 1;
        return 0;
    });
    
    return {
        names: byName,
        births: byBirth,
        deaths: byDeath
    };
}
