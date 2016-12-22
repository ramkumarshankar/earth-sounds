var earthquakes = [];
var textFont;

class Earthquake {
    constructor(id, title, mag, long, lat, depth, time) {
        //Get our values
        this._id = id;
        this._title = title;
        this._mag = mag;
        this._long = long;
        this._lat = lat;
        this._depth = depth;
        this._time = time;

        //Initialise the oscillator for this event
        this._osc = new p5.Oscillator(440, 'sine');
        this._osc.amp(0);
        this._osc.start();
        this._isPlaying = false;
    }

    play() {
        this._isPlaying = true;
        this._osc.amp(0.5, 0.05);
    }

    stop() {
        this._isPlaying = false;
        this._osc.amp(0, 0.5);
    }

    draw() {
        var x = map(this._long, -180, 180, 0, width);
        var y = map(this._lat, -90, 90, 0, height);
        color(255, 255, 255, 0.1);
        noStroke();
        ellipse(x, y, 10, 10);
    }
}

function preload() {
    textFont = loadFont('./assets/Chivo-Light.otf');
    var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    loadJSON(url, loadData);
}

function loadData(results) {
    var firstEventTime = moment(results.features[0].time);
    for (var i = 0; i < results.features.length; i++) {
        let quakeEvent = new Earthquake(
            i,
            results.features[i].properties.place,
            results.features[i].properties.mag,
            results.features[i].geometry.coordinates[0],
            results.features[i].geometry.coordinates[1],
            results.features[i].geometry.coordinates[2],
            moment(results.features[i].time).diff(firstEventTime, 'seconds')
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
        earthquakes[i].draw();
    }
}