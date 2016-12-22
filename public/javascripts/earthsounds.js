var earthquakes = [];
var textFont;

//Todo: use moment to work with the time values
//Values already arrive in descending order

function preload() {
    textFont = loadFont('./assets/Chivo-Light.otf');
    var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    loadJSON(url, loadData);
}

function loadData(results) {
    for (var i = 0; i < results.features.length; i++) {
        earthquakes.push({
            id: i,
            text: results.features[i].properties.place,
            mag: results.features[i].properties.mag,
            long: results.features[i].geometry.coordinates[0],
            lat: results.features[i].geometry.coordinates[1],
            depth: results.features[i].geometry.coordinates[2]
        });
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(97, 74, 226);
}

function draw() {

}