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
        let quakeEvent = new Earthquake(
            i,
            results.features[i].properties.place,
            results.features[i].properties.mag,
            results.features[i].geometry.coordinates[0],
            results.features[i].geometry.coordinates[1],
            results.features[i].geometry.coordinates[2]
        );
        quakeEvent._osc.stop();
        earthquakes.push(quakeEvent);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(97, 74, 226);

}

function draw() {
    noStroke();
    color(255,255,255);
    for (var i = 0; i < earthquakes.length; i++) {
        var x = map(earthquakes[i]._long, -180, 180, 0, width);
        var y = map(earthquakes[i]._lat, -90, 90, 0, height);
        ellipse(x, y, 20, 20);
    }
}