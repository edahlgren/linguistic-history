#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////
//
// Description


// This is a small Javascript program that writes all volume1-poster data to
// a single JSON file, so a D3 script can read it simply.
//
// Note: This is just a prototype to start experimenting with the data.
// It may not end up being useful to the final result.


////////////////////////////////////////////////////////////////////////////////
//
// Dependencies


const fs = require('fs');
const path = require('path');
const cli = require('command-line-args');


////////////////////////////////////////////////////////////////////////////////
//
// Input and output


// Spec for command line arguments
const input_args = [
    // CSV file like original/volume1-poster.csv
    { name: 'people', type: String }
];


// Name of JSON output file
const output_file = "all.json";


////////////////////////////////////////////////////////////////////////////////
//
// Entrypoint


function main() {
    
    // Parse args
    const args = cli(input_args);

    // Check args
    if (!args.people) {
        console.log("\nneed --people: a CSV file like volume1-poster.csv\n");
        process.exit(1);
    }

    // Parse the people
    const people = get_people(args.people);

    // Get links that include these people
    const links = get_links(people);
    
    // JSON to write
    let data = {
        people: people,
        links: links
    };
    
    // Write the JSON data to a file
    fs.writeFileSync(output_file, JSON.stringify(data, null, 2));
}

main();


////////////////////////////////////////////////////////////////////////////////
//
// Supporting functions and data


function get_people(file) {

    // Array to return
    let people = [];
    
    // Read the file into memory and split by lines
    // (This prototype assumes a small file size)
    let lines = fs.readFileSync(file, 'utf-8').split('\n');

    // Parse the person information from each line
    lines.forEach(function(line) {

        // Split the line by commas (csv)
        let parts = line.split(',');

        // Skip lines with not enough data. We need at
        // least ("P", first, last, born, died)
        if (parts.length < 5)
            return;

        // Skip lines that don't start with "P"
        // (Matches original/volume1-poster.py)
        if (parts[0] !== "P")
            return;

        // Create the person structure with defaults for
        // profession and key
        let person = {
            first: parts[1],
            last: parts[2],
            born: parts[3],
            died: parts[4],
            profession: "linguist",
            key: ""
        };

        // Set the profession if one is available
        if (parts.length >= 7)
            person.profession = parts[6];

        // Replace empty professions with "unknown"
        if (person.profession.trim() === "")
            person.profession = "unknown";
        
        // Set the key if one is available
        if (parts.length >= 8)
            person.key = parts[7];
      
        // Add to the output array
        people.push(person);
    });

    return people;
}

// Links between people, generated from the hard-coded links in
// original/volume1-poster.py
function get_links(people) {
    const links = [
        { from: "Sorokin", to: "Merton", type: "teacher" },
        { from: "Parsons", to: "Merton", type: "teacher" },
        { from: "Zeisel", to: "Lazarsfeld", type: "colleagues" },
        { from: "Lazarsfeld", to: "Stouffer", type: "teacher" },
        { from: "Lazarsfeld", to: "Boudon", type: "teacher" },
        { from: "Lazarsfeld", to: "Coleman", type: "teacher" },
        { from: "Dewey", to: "Chapin", type: "teacher" },
        { from: "charlottebuhler", to: "Lazarsfeld", type: "teacher" },
        { from: "charlottebuhler", to: "Lazarsfeld", type: "teacher" },
        { from: "Wundt", to: "GHMead", type: "teacher" },
        { from: "Herder", to: "Fichte", type: "teacher" },
        { from: "Kant", to: "Fichte", type: "teacher" },
        { from: "Langfeld", to: "Allport", type: "teacher" },
        { from: "Carnap", to: "Quine", type: "teacher" },
        { from: "Cassirer", to: "Lewin", type: "teacher" },
        { from: "Bopp", to: "Whitney", type: "teacher" },
        { from: "Curtius", to: "Whitney", type: "teacher" },
        { from: "Lepsius", to: "Whitney", type: "teacher" }, 
        { from: "Mueller", to: "Whitney", type: "teacher" },
        { from: "Whitney", to: "Harper", type: "teacher" }, 
        { from: "Whitney", to: "MauriceBloomfield", type: "teacher" },
        { from: "Whitney", to: "Lanman", type: "teacher" },
        { from: "Whitney", to: "Buck", type: "teacher" },
        { from: "Buck", to: "Bloomfield", type: "teacher" }, 
        { from: "Baudouin", to: "Saussure", type: "influence" },
        { from: "Baudouin", to: "Polivanov", type: "teacher" },
        { from: "Baudouin", to: "Shcherba", type: "teacher" },
        { from: "Baudouin", to: "Kruszewski", type: "teacher" },
        { from: "Boas", to: "Sapir", type: "teacher" },
        { from: "Boas", to: "Benedict", type: "teacher" },
        { from: "Boas", to: "Mead", type: "teacher" },
        { from: "Benedict", to: "Mead", type: "teacher" },
        { from: "Sapir", to: "Swadesh", type: "teacher" },
        { from: "Sapir", to: "Newman", type: "teacher" },
        { from: "Sapir", to: "Haas", type: "teacher" },
        { from: "Sapir", to: "Hockett", type: "teacher" },
        { from: "Sapir", to: "Voegelin", type: "postDoc" },
        { from: "Sapir", to: "Harris", type: "teacher" },
        { from: "Sapir", to: "Kluckhohn", type: "influence" },
        { from: "Sapir", to: "Whorf", type: "teacher" },
        { from: "Sapir", to: "Pike", type: "teacher" },
        { from: "Sapir", to: "Hoijer", type: "influence" },
        { from: "Bloomfield", to: "Harris", type: "teacher" },
        { from: "Bloomfield", to: "Hockett", type: "teacher" },
        { from: "Bloomfield", to: "Pike", type: "teacher" },
        { from: "Goodman", to: "Chomsky", type: "teacher" },
        { from: "Quine", to: "Chomsky", type: "hostile" },
        { from: "Sapir", to: "Koffka", type: "teacher" },
        { from: "Harris", to: "Chomsky", type: "hostile" },
        { from: "BarHillel", to: "Chomsky", type: "teacher" },
        { from: "Chomsky", to: "Halle", type: "teacher" },
        { from: "Jakobson", to: "Halle", type: "teacher" },
        { from: "Osthoff", to: "Saussure", type: "teacher" },
        { from: "Darwin", to: "Schleicher", type: "influence" },
        { from: "Frege", to: "Russell", type: "influence" },
        { from: "Russell", to: "Wittgenstein", type: "teacher" },
        { from: "Trendelenburg", to: "Marty", type: "teacher" },
        { from: "Trendelenburg", to: "Brentano", type: "influence" },
        { from: "Comte", to: "Brentano", type: "influence" },
        { from: "Mill", to: "Brentano", type: "influence" },
        { from: "Brentano", to: "Marty", type: "teacher" },
        { from: "Brentano", to: "Masaryk", type: "teacher" },
        { from: "Brentano", to: "Husserl", type: "teacher" },
        { from: "Brentano", to: "Meinong", type: "teacher" },
        { from: "Brentano", to: "Ehrenfels", type: "teacher" },
        { from: "Brentano", to: "Stumpf", type: "teacher" },
        { from: "Brentano", to: "Freud", type: "teacher" },
        { from: "Brentano", to: "Twardowski", type: "teacher" },
        { from: "Wertheimer", to: "Heider", type: "teacher" },
        { from: "Stumpf", to: "Allport", type: "postDoc" },
        { from: "Stumpf", to: "Kohler", type: "teacher" },
        { from: "Stumpf", to: "Langfeld", type: "teacher" },
        { from: "Stumpf", to: "Wertheimer", type: "teacher" },
        { from: "Stumpf", to: "Kulpe", type: "teacher" },
        { from: "Kulpe", to: "Wertheimer", type: "teacher" },
        { from: "Kulpe", to: "Koffka", type: "teacher" },
        { from: "Masaryk", to: "Mathesius", type: "teacher" },
        { from: "Marty", to: "Mathesius", type: "teacher" },
        { from: "Buhler", to: "Popper", type: "teacher" }, 
        { from: "Helmholtz", to: "Wundt", type: "teacher" },
        { from: "James", to: "Hall", type: "teacher" }, 
        { from: "Wundt", to: "Hall", type: "teacher" }, 
        { from: "Wundt", to: "Kulpe", type: "teacher" }, 
        { from: "Wundt", to: "Titchener", type: "teacher" },
        { from: "Wundt", to: "Angell", type: "teacher" },
        { from: "Wundt", to: "Cattell", type: "teacher" }, 
        { from: "Wundt", to: "Muensterberg", type: "teacher" },
        { from: "Wundt", to: "Chelpanov", type: "teacher" },
        { from: "Mach", to: "Chelpanov", type: "teacher" },
        { from: "Mach", to: "Loeb", type: "teacher" },
        { from:  "Chelpanov", to: "Shpet", type: "teacher" },
        { from: "Shpet", to: "Jakobson", type: "teacher" },
        { from: "Loeb", to: "Watson", type: "teacher" },
        { from: "Angell", to: "Watson", type: "teacher" },
        { from: "Titchener", to: "Watson", type: "teacher" },
        { from: "Watson", to: "Tolman", type: "teacher" }, 
        { from: "Watson", to: "Lashley", type: "teacher" },
        { from: "Watson", to: "Skinner", type: "teacher" },
        { from: "Watson", to: "Hull", type: "teacher" },
        { from: "Fortunatov", to: "Trubetzkoy", type: "teacher" },
        { from: "Weber", to: "Breal", type: "teacher" },
        { from: "Breal", to: "Fortunatov", type: "teacher" },
        { from: "Voegelin", to: "Garvin", type: "teacher" },
        { from: "Steinthal", to: "Wundt", type: "teacher" },
        { from: "Humboldt", to: "Steinthal", type: "influence" },
        { from: "Steinthal", to: "Boas", type: "influence" },
        { from: "Herder", to: "Humboldt", type: "influence" },
        { from: "Kant", to: "Herder", type: "teacher" },
        { from: "Titchener", to: "Boring", type: "teacher" },
        { from: "Kohler", to: "Allport", type: "postDoc" },
        { from: "Wertheimer", to: "Allport", type: "postDoc" },
        { from: "Trubetzkoy", to: "Buhler", type: "colleagues" },
        { from: "Hilbert", to: "Husserl", type: "teacher" }, 
        { from: "Allport", to: "Bruner", type: "teacher" },
        { from: "Sapir", to: "Lasswell", type: "colleagues" },
        { from: "Giddings", to: "Ogburn", type: "teacher" },
        { from: "Giddings", to: "Odum", type: "teacher" },
        { from: "Giddings", to: "Chapin", type: "teacher" },
        { from: "Hall", to: "Chapin", type: "teacher" },
        { from: "Small", to: "Bernard", type: "teacher" },
        { from: "Giddings", to: "Small", type: "hostile" },
        { from: "Dewey", to: "GHMead", type: "teacher" },
        { from: "Simmel", to: "Park", type: "teacher" },
        { from: "Trendelenberg", to: "Brentano", type: "teacher" }
    ];

    // Choose an index based on the key or last name
    const set = new Set(people.map(function(person) { 
        return (person.key.length > 0 ? person.key : person.last);
    }));

    // Only use links that include these people
    return links.filter(function(link) {
        if (!set.has(link.from))
            return false;
        if (!set.has(link.to))
            return false;
        return true;
    });
}
