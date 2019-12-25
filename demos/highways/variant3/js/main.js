
const width = 1080,
      half_width = width / 2,
      box_height = 14,
      margin_y = 20;

const white = "#ffffff",
      yellow = "#fac11e",
      dark_yellow = "#ffffff",
      green = "#98cf74",
      blue = "#7dc6e3",
      pink= "#eda1d5";

const svg_parent = document.getElementById('main-container');

// Load and parse the json data
d3.json("data/middle.json").then(function(genealogy) {

    // Sort the people in the graph
    const graph = order_graph(genealogy);
    console.log(graph);

    // Calculate the height of the SVG
    const name_height = (graph.people.byBirth.length - 1) * (box_height + 2);
    const height = (name_height < half_width ? half_width : name_height);

    let y_range = [margin_y, height - margin_y],
        x_range = [0, width];
    
    const youngest = graph.people.byBirth[0],
          oldest = graph.people.byBirth[graph.people.byBirth.length - 1];

    // Numeric scales
    const yTime = d3.scaleTime()
              .domain([new Date(youngest.born, 0, 1),
                       new Date(oldest.born, 0, 1)])
              .range(y_range);
    const y = d3.scaleLinear()
              .domain([youngest.born, oldest.born])
              .range(y_range);
    const x = d3.scaleLinear()
              .domain([0, 100])
              .range(x_range);
    
    // Scale people by birthday
    const scaleY = function(last) {
        let person = graph.people.byName.get(last);
        return y(parseInt(person.born, 10));
    };
    
    // Scale people by group on the x axis, from [0,100]
    const scaleX = function(last) {
        let personX = graph.scaleX.people[last],
            groupX = graph.scaleX.groups[personX.group];

        // Scale groups from [0,10] to [0,100]
        let start = groupX.start * 10,
            end = groupX.end * 10;

        // Map person position from [0, 10] scale to this one
        let scalePoint = d3.scaleLinear()
                .domain([0, 10])
                .range([start, end]);

        // Get the position of the person between [0,100]
        let position = scalePoint(personX.pos);

        // Scale it to the x dimensions
        return x(position);
    };

    // Find the max and min years in a group
    let maxYear = function(group) {
        return Math.max.apply(Math, group.map(function(person) {
            return parseInt(person.born, 10);
        }));
    };
    let minYear = function(group) {
        return Math.min.apply(Math, group.map(function(person) {
            return parseInt(person.born, 10);
        }));
    };
    
    // Create the SVG
    var svg = d3.select("#svg-container").append("svg")
            .attr("width", width)
            .attr("height", height);

    // Add the groups (lowest layer)
    svg.selectAll("groups")
        .data(graph.showGroups)
        .enter()
        .append("rect")
        .attr("id", function(d) { return d.group; })
        .attr("fill", function(d) {
            //return "#dbdbdb";
            
            switch(d.group) {
            case "Moscow School":
            case "Prague Linguistic Circle":
                return "#f5efdc";
            case "Wittgenstein's Circle":
            case "Vienna Circle":
            case "Brentano's Circle":
                return "#e3f0d5";
            case "Gestalt":
                return "#daebf2";
            default:
                return "none";
            }
        })
        .attr("class", "thought-group")
        .attr("stroke", "none")
        .attr("width", function(d) {
            
            // Same as above
            let left = x(d.start * 10),
                right = x(d.end * 10);
            
            // Calculate the diff
            return right - left;
        })
        .attr("height", function(d) {
            
            // Same as above
            let group = graph.people.byGroup[d.group],
                max = maxYear(group),
                min = minYear(group);
            
            // Find the top and bottom
            let top = y(max);
            if (d.flushTop)
                top = 0;
            let bottom = y(min);
            
            // Calculate the diff
            return (bottom - top) + (margin_y * 1.5);
        })
        .attr("transform", function(d) {
            // Calculate the left position
            let left = x(d.start * 10);
            
            // Find the largest birth year
            let group = graph.people.byGroup[d.group],
                max = maxYear(group);
            
            // Calculate the top position
            let top = y(max);
            if (d.flushTop)
                top = 0;
            
            // Shift it to these coordinates
            return `translate(${d.x = left},${d.y = top})`;
        });

    /**
    // Create y-axis grid lines
    const gridY = svg.append("g")
              .attr("class","grid-y")
              .style("stroke-width", "1")
              .call(d3.axisRight(yTime)
                    .ticks(d3.timeYear.every(2.5))
                    .tickSize(width)
                    .tickFormat(function(d) {
                        if (d.getFullYear() % 10 == 0)
                            return d.getFullYear();
                        return null;
                    }))
              .call(function(g) {
                  g.select(".domain").remove();
              })
              .call(function(g) {
                  g.selectAll(".tick text")
                      .attr("x", 4)
                      .attr("dy", -2);
              });

    const tickDiff = y(oldest.born) - y(oldest.born + 2.5);

    // Create x-axis to match tick width of y-axis
    // (makes graph paper squares)
    const gridX = svg.append("g")
              .attr("class","grid-x")
              .style("stroke-width", "1")
              .call(d3.axisBottom(x)
                    .ticks(width / tickDiff)
                    .tickSize(height)
                    .tickFormat(""))
              .call(function(g) {
                  g.select(".domain").remove();
              });
     **/
    
    // Position the people
    const people = svg.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "middle")
              .selectAll("g")
              .data(graph.people.byBirth)
              .join("g")
              .attr("id", function(d) {
                  return d.last;
              })
              .attr("transform", function(d) {
                  // Put them all in the middle first
                  //return `translate(${d.x = (width / 2)},${d.y = scaleY(d.last)})`;
                  return `translate(${d.x = scaleX(d.last)},${d.y = scaleY(d.last)})`;
              })
              .call(function(g) {
                  g.append("text")
                      .attr("dy", "0.35em")
                      .text(function(d) {
                          return d.last;
                      });
              });

    // Show endpoints for the different people
    
    const mathesius = d3.select("#Mathesius"),
          mathesius_bottom = get_points_bottom(mathesius, mathesius_links.bottom.length);
    
    const brentano = d3.select("#Brentano"),
          brentano_top = get_points_top(brentano, brentano_links.top.length),
          brentano_bottom = get_points_bottom(brentano, brentano_links.bottom.length);

    const marty = d3.select("#Marty"),
          marty_left = get_points_left(marty, marty_links.left.length),
          marty_right = get_points_right(marty, marty_links.right.length);

    const masaryk = d3.select("#Masaryk"),
          masaryk_left = get_points_left(masaryk, masaryk_links.left.length),
          masaryk_right = get_points_right(masaryk, masaryk_links.right.length);

    const twardowski = d3.select("#Twardowski"),
          twardowski_left = get_points_left(twardowski, twardowski_links.left.length);

    const husserl = d3.select("#Husserl"),
          husserl_left = get_points_left(husserl, husserl_links.left.length),
          husserl_right = get_points_right(husserl, husserl_links.right.length);

    const ehrenfels = d3.select("#Ehrenfels"),
          ehrenfels_left = get_points_left(ehrenfels, ehrenfels_links.left.length);

    const freud = d3.select("#Freud"),
          freud_left = get_points_left(freud, freud_links.left.length);
    
    const meinong = d3.select("#Meinong"),
          meinong_left = get_points_left(meinong, meinong_links.left.length);

    const stumpf = d3.select("#Stumpf"),
          stumpf_left = get_points_left(stumpf, stumpf_links.left.length),
          stumpf_right = get_points_right(stumpf, stumpf_links.right.length);

    const comte = d3.select("#Comte"),
          comte_right = get_points_right(comte, comte_links.right.length);

    const trendelenberg = d3.select("#Trendelenberg"),
          trendelenberg_left = get_points_left(trendelenberg, trendelenberg_links.left.length);

    const mill = d3.select("#Mill"),
          mill_left = get_points_left(mill, mill_links.left.length);

    const langfeld = d3.select("#Langfeld"),
          langfeld_left = get_points_left(langfeld, langfeld_links.left.length);

    const wertheimer = d3.select("#Wertheimer"),
          wertheimer_right = get_points_right(wertheimer, wertheimer_links.right.length),
          wertheimer_left = get_points_left(wertheimer, wertheimer_links.left.length);

    const heider = d3.select("#Heider"),
          heider_bottom = get_points_bottom(heider, heider_links.bottom.length);
    
    const cassirer = d3.select("#Cassirer"),
          cassirer_top = get_points_top(cassirer, cassirer_links.top.length);

    const koffka = d3.select("#Koffka"),
          koffka_left = get_points_left(koffka, koffka_links.left.length);
    
    const lewin = d3.select("#Lewin"),
          lewin_left = get_points_left(lewin, lewin_links.left.length);

    const shpet = d3.select("#Shpet"),
          shpet_left = get_points_left(shpet, shpet_links.left.length),
          shpet_right = get_points_right(shpet, shpet_links.right.length);

    const jakobson = d3.select("#Jakobson"),
          jakobson_bottom = get_points_bottom(jakobson, jakobson_links.bottom.length);

    const hilbert = d3.select("#Hilbert"),
          hilbert_bottom = get_points_bottom(hilbert, hilbert_links.bottom.length);
    
    const chelpanov = d3.select("#Chelpanov"),
          chelpanov_top = get_points_top(chelpanov, chelpanov_links.top.length),
          chelpanov_bottom = get_points_bottom(chelpanov, chelpanov_links.bottom.length);
    
    const wittgenstein = d3.select("#Wittgenstein"),
          wittgenstein_right = get_points_right(wittgenstein, wittgenstein_links.right.length);

    const russell = d3.select("#Russell"),
          russell_top = get_points_top(russell, russell_links.top.length);

    const wundt = d3.select("#Wundt"),
          wundt_top = get_points_top(wundt, wundt_links.top.length);

    const angell = d3.select("#Angell"),
          angell_bottom = get_points_bottom(angell, angell_links.bottom.length);

    const titchener = d3.select("#Titchener"),
          titchener_bottom = get_points_bottom(titchener, titchener_links.bottom.length);    
    
    // Connect Mathesius
    connect_vertical(svg, "Mathesius-Marty", dark_yellow, {
        start: mathesius_bottom[0],
        end: marty_left[0]
    });    
    connect_vertical(svg, "Mathesius-Masaryk", dark_yellow, {
        start: mathesius_bottom[1],
        end: masaryk_left[0]
    });

    // Connect Brentano
    connect_vertical(svg, "Brentano-Marty", dark_yellow, {
        start: brentano_top[0],
        end: marty_right[0]
    });    
    connect_vertical(svg, "Brentano-Masaryk", dark_yellow, {
        start: brentano_top[1],
        end: masaryk_right[0]
    });
    connect_vertical(svg, "Brentano-Husserl", white, {
        start: brentano_top[2],
        end: husserl_right[0]
    });
    connect_vertical(svg, "Brentano-Twardowski", white, {
        start: brentano_top[3],
        end: twardowski_left[0]
    });
    connect_vertical(svg, "Brentano-Ehrenfels", white, {
        start: brentano_top[4],
        end: ehrenfels_left[0]
    });
    connect_vertical(svg, "Brentano-Freud", white, {
        start: brentano_top[5],
        end: freud_left[0]
    });
    connect_vertical(svg, "Brentano-Meinong", white, {
        start: brentano_top[6],
        end: meinong_left[0]
    });
    connect_vertical(svg, "Brentano-Stumpf", white, {
        start: brentano_top[7],
        end: stumpf_left[0]
    });
    
    connect_vertical_dashed(svg, "Brentano-Comte", dark_yellow, {
        start: brentano_bottom[0],
        end: comte_right[0]
    });
    connect_vertical_dashed(svg, "Brentano-Trendelenberg", white, {
        start: brentano_bottom[1],
        end: trendelenberg_left[0]
    });
    connect_vertical_dashed(svg, "Brentano-Mill", white, {
        start: brentano_bottom[2],
        end: mill_left[0]
    });
    
    // Connect Gestalt
    connect_vertical(svg, "Langfeld-Stumpf", white, {
        start: langfeld_left[0],
        end: stumpf_right[0]
    });
    connect_vertical(svg, "Wertheimer-Stumpf", white, {
        start: wertheimer_left[0],
        end: stumpf_right[1]
    });
    connect_vertical(svg, "Heider-Wertheimer", white, {
        start: heider_bottom[0],
        end: wertheimer_right[0]
    });

    // Connect Cassirer
    connect_vertical(svg, "Cassirer-Lewin", white, {
        start: cassirer_top[0],
        end: lewin_left[0]
    });

    // Connect Jakobson
    connect_vertical(svg, "Jakobson-Shpet", white, {
        start: jakobson_bottom[0],
        end: shpet_right[0]
    });

    // Connect Russell
    connect_vertical(svg, "Russell-Wittgenstein", white, {
        start: russell_top[0],
        end: wittgenstein_right[0]
    });
    connect_vertical_dotted(svg, "Hilbert-Husserl", white, {
        start: hilbert_bottom[0],
        end: husserl_left[0]
    });
    
    // Connect Chelpanov
    connect_vertical(svg, "Chelpanov-Shpet", white, {
        start: chelpanov_top[0],
        end: shpet_left[0]
    });

    // Connect Wundt
    connect_vertical(svg, "Wundt-Titchener", white, {
        start: wundt_top[3],
        end: titchener_bottom[0]
    });
    
    // Custom connections
    const brentano_corners = get_corners(brentano);
    
    const marty_to_trendelenberg = [
        marty_right[1],
        { x: brentano_top[0].x - 8, y: marty_right[1].y },
        { x: brentano_top[0].x - 8, y: trendelenberg_left[1].y },
        trendelenberg_left[1]
    ];
    connect_through(svg, "Marty-Trendelenberg", null, white, marty_to_trendelenberg);
    
    const chelpanov_to_wundt = [
        chelpanov_bottom[0],
        { x: chelpanov_bottom[0].x, y: brentano_corners.bottom_left.y + 8 },
        { x: wundt_top[1].x, y: brentano_corners.bottom_left.y + 8 },
        wundt_top[1],
    ];
    connect_through(svg, "Chelpanov-Wundt", "Brentano's Circle",
                    white, chelpanov_to_wundt);

    const wundt_to_angell = [
        wundt_top[2],
        { x: wundt_top[2].x, y: titchener_bottom[0].y + 8 },
        { x: angell_bottom[0].x, y: titchener_bottom[0].y + 8 },
        angell_bottom[0],
    ];
    connect_through(svg, "Wundt-Angell", null, white, wundt_to_angell);
    
    connect_vertical2(svg, "Wundt-unknown", "Brentano's Circle", white, {
        start: wundt_top[0],
        end: { x: 0, y: brentano_corners.bottom_left.y + 16 }
    });

    connect_vertical2(svg, "Koffka-unknown", "Moscow School", white, {
        start: koffka_left[0],
        end: { x: 0, y: koffka_left[0].y }
    });

    show_points(svg, mathesius_bottom, yellow);
    show_points(svg, brentano_top, green);
    show_points(svg, brentano_bottom, green);
    show_points(svg, marty_left, green);
    show_points(svg, marty_right, green);
    show_points(svg, masaryk_left, yellow);
    show_points(svg, masaryk_right, yellow);
    show_points(svg, twardowski_left, green);
    show_points(svg, husserl_left, green);
    show_points(svg, husserl_right, green);
    show_points(svg, ehrenfels_left, green);
    show_points(svg, freud_left, blue);
    show_points(svg, meinong_left, green);
    show_points(svg, stumpf_left, blue);
    show_points(svg, stumpf_right, blue);
    show_points(svg, comte_right, green);
    show_points(svg, trendelenberg_left, green);
    show_points(svg, mill_left, green);
    show_points(svg, langfeld_left, blue);
    show_points(svg, wertheimer_right, blue);
    show_points(svg, wertheimer_left, blue);
    show_points(svg, heider_bottom, blue);
    show_points(svg, cassirer_top, green);
    show_points(svg, koffka_left, blue);
    show_points(svg, lewin_left, blue);
    show_points(svg, shpet_left, yellow);
    show_points(svg, shpet_right, yellow);
    show_points(svg, jakobson_bottom, yellow);
    show_points(svg, hilbert_bottom, pink);
    show_points(svg, chelpanov_top, yellow);
    show_points(svg, chelpanov_bottom, yellow);
    show_points(svg, wittgenstein_right, green);
    show_points(svg, russell_top, green);
    show_points(svg, wundt_top, blue);
    show_points(svg, angell_bottom, blue);
    show_points(svg, titchener_bottom, blue);
});

const comte_links = {
    right: [ "Brentano" ]
};

const trendelenberg_links = {
    left: [ "Brentano", "Marty" ]
};

const mill_links = {
    left: [ "Brentano" ]
};

const brentano_links = {
    // Links left to right
    top: [
        "Marty",
        "Masaryk",
        "Twardowski",
        "Husserl",
        "Ehrenfels",
        "Freud",
        "Meinong",
        "Stumpf"
    ],
    bottom: [
        "Comte",
        "Trendelenberg",
        "Mill"
    ]
};

const marty_links = {
    left: [
        "Mathesius"
    ],
    right: [
        "Brentano",
        "Trendelenberg"
    ]
};

const masaryk_links = {
    left: [
        "Mathesius",
    ],
    right: [
        "Brentano",
    ]
};

const twardowski_links = {
    left: [ "Brentano" ]
};

const husserl_links = {
    left: [ "Hilbert" ],
    right: [ "Brentano" ]
};

const ehrenfels_links = {
    left: [ "Brentano" ]
};

const freud_links = {
    left: [ "Brentano" ]
};

const meinong_links = {
    left: [ "Brentano" ]
};

const stumpf_links = {
    left: [
        "Brentano",
    ],
    right: [
        "Langfeld",
        "Wertheimer"
    ]
};

const langfeld_links = {
    left: [ "Stumpf" ]
};

const wertheimer_links = {
    left: [ "Stumpf" ],
    right: [ "Heider" ]
};

const heider_links = {
    bottom: [ "Wertheimer" ]
};

const cassirer_links = {
    top: [ "Lewin" ]
};

const koffka_links = {
    left: [ "unknown" ]
};

const lewin_links = {
    left: [ "Cassirer" ]
};

const mathesius_links = {
    bottom: [ "Marty", "Masaryk" ]
};

const shpet_links = {
    left: [ "Chelpanov" ],
    right: [ "Jakobson" ]
};

const jakobson_links = {
    bottom: [ "Shpet" ]
};

const hilbert_links = {
    bottom: [ "Husserl" ]
};

const chelpanov_links = {
    top: [ "Shpet" ],
    bottom: [ "Wundt" ]
};

const wittgenstein_links = {
    right: [ "Russell" ]
};

const russell_links = {
    top: [ "Wittgenstein" ],
    bottom: [ "Husserl" ]
};

const wundt_links = {
    top: [ "unknown", "Chelpanov", "Angell", "Titchener" ]
};

const angell_links = {
    bottom: [ "Wundt" ]
};

const titchener_links = {
    bottom: [ "Wundt" ]
};

const conn_width = 8,
      conn_padding_between = 2,
      conn_padding_away = 8,
      conn_with_padding = conn_width + conn_padding_between;
          
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

// Initialize the line generator
const svg_line = d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });
const curvature = 1;

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

function connect_vertical_dashed(svg, name, stroke, endpoints) {
    let points = connect_vertical_points(endpoints);

    // Make the line
    let outline = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name + "-outline")
            .attr("class", "line")
            .style("stroke", "#b0b0b0")
            .style("stroke-width", points[0].r + 0.5)
            .style("stroke-dasharray", "7,7")
            .style("fill", "none");
    
    let elem = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name)
            .attr("class", "line")
            .style("stroke", stroke)
            .style("stroke-width", points[0].r)
            .style("stroke-dasharray", "7,7")
            .style("fill", "none");
}

function connect_vertical_dotted(svg, name, stroke, endpoints) {
    let points = connect_vertical_points(endpoints);

    // Make the line
    let outline = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name + "-outline")
            .attr("class", "line")
            .style("stroke", "#b0b0b0")
            .style("stroke-width", points[0].r + 0.5)
            .style("stroke-linecap", "round")
            .style("stroke-dasharray", "1,10")
            .style("fill", "none");
    
    let elem = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name)
            .attr("class", "line")
            .style("stroke", stroke)
            .style("stroke-width", points[0].r)
            .style("stroke-linecap", "round")
            .style("stroke-dasharray", "1,10")
            .style("fill", "none");
}

function connect_vertical2(svg, name, before, stroke, endpoints) {
    let points = connect_vertical_points(endpoints);

    let outline = svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name + "-outline")
        .attr("class", "line")
        .style("stroke", "#b0b0b0")
        .style("stroke-width", points[0].r + 0.5)
        .style("fill", "none");
    
    let elem = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name)
            .attr("class", "line")
            .style("stroke", stroke)
            .style("stroke-width", points[0].r)
            .style("fill", "none");
    
    if (before) {
        let prev = document.getElementById(before),
            parent = svg.node();
        parent.insertBefore(elem.node(), prev);
        parent.insertBefore(outline.node(), elem.node());
    }
}

function connect_through(svg, name, before, stroke, points) {
    points = connect_through_points(points);
    console.log(points);

    // Make the line
    let outline = svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name + "-outline")
        .attr("class", "line")
        .style("stroke", "#b0b0b0")
        .style("stroke-width", points[0].r + 0.5)
        .style("fill", "none");
    
    let elem = svg.append("path")
            .attr("d", svg_line(points))
            .attr("id", name)
            .attr("class", "line")
            .style("stroke", stroke)
            .style("stroke-width", points[0].r)
            .style("fill", "none");
    
    if (before) {
        let prev = document.getElementById(before),
            parent = svg.node();
        parent.insertBefore(elem.node(), prev);
        parent.insertBefore(outline.node(), elem.node());
    }
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

function connect_vertical(svg, name, stroke, endpoints) {
    let points = connect_vertical_points(endpoints);

    // Make the line
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name + "-outline")
        .attr("class", "line")
        .style("stroke", "#b0b0b0")
        .style("stroke-width", endpoints.start.r + 0.5)
        .style("fill", "none");
    
    svg.append("path")
        .attr("d", svg_line(points))
        .attr("id", name)
        .attr("class", "line")
        .style("stroke", stroke)
        .style("stroke-width", endpoints.start.r)
        .style("fill", "none");
}

function show_points(svg, points, color) {
    svg.selectAll("nothing")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("r", function(d) { return d.r * 0.5; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("stroke", "none")
        .attr("fill", color);
}

function get_corners(group) {
    const box = group.node().getBBox(),
          translation = coords(group.attr("transform")),
          trans_x = parseInt(translation[0], 10),
          trans_y = parseInt(translation[1], 10);
    
    const top_left = { x: box.x + trans_x, y: box.y + trans_y },
          top_right = { x: top_left.x + box.width, y: top_left.y };

    const bottom_left = { x: box.x + trans_x, y: box.y + box.height + trans_y },
          bottom_right = { x: bottom_left + box.width, y: bottom_left.y };

    return {
        width: box.width,
        height: box.height,
        top_left: top_left,
        top_right: top_right,
        bottom_left: bottom_left,
        bottom_right: bottom_right
    };
}

function coords(str) {
    return str.substring(str.indexOf("(")+1, str.indexOf(")")).split(",");
}

function order_graph(genealogy) {
    // Map names to nodes
    const byName = new Map(genealogy.people.map(function(person) {
        return [person.last, person];
    }));

    const byBirth = genealogy.people.map(function(person) { 
        return { last: person.last, born: parseInt(person.born, 10) };
    }).sort(function(a, b) {
        // Descending by order of birth
        if (a.born < b.born) return 1;
        if (a.born > b.born) return -1;
        return 0;
    });

    const byGroup = {};
    genealogy.people.forEach(function(person) {
        let group = [];
        if (byGroup.hasOwnProperty(person.group)) {
            group = byGroup[person.group];
        }
        group.push(person);
        byGroup[person.group] = group;
    });

    const groupX = {};
    genealogy.groups.forEach(function(group) {
        groupX[group.group] = { start: group.start, end: group.end };
    });

    const personX = {};
    genealogy.people.forEach(function(person) {
        personX[person.last] = { group: person.group, pos: person.scaleX };
    });

    return {
        people: {
            byName: byName,
            byBirth: byBirth,
            byGroup: byGroup
        },
        scaleX: {
            groups: groupX,
            people: personX
        },
        showGroups: genealogy.showGroups
    };
}
