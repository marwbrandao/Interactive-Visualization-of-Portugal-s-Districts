const fs = require('fs');
const turf = require('@turf/turf');

// Read the GeoJSON file
let rawdata = fs.readFileSync('output-pretty.geojson');
let geojson = JSON.parse(rawdata);

// Ensure correct winding order
let correctedGeojson = turf.rewind(geojson, {reverse: true});

// Save corrected GeoJSON to a new file
fs.writeFileSync('path_to_your_output_geojson_file.geojson', JSON.stringify(correctedGeojson, null, 2));
