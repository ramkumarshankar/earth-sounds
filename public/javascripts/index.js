var earthquakes = [];
var textFont;

var backgroundColor;

var ellipseColor1;
var ellipseColor2;

var startTime;
var timeScaleFactor = 5;
var useDummy = false;

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

        this._radius = 5;

        //Initialise the oscillator for this event
        var freq = map(this._mag, 0, 6, 30, 700);
        this._osc = new p5.Oscillator(freq, 'sine');
        this._osc.amp(0);
        this._osc.start();

        //Set some flags
        this._isPlaying = false;
        this._isDrawing = false;
        this._hasDrawn = false;
    }

    playTone() {
        this._isPlaying = true;
    }

    stopTone() {
        this._isPlaying = false;
    }

    startDraw() {
        if (!this.hasDrawn) {
            this._isDrawing = true;
            this.playTone();
        }
    }

    draw() {
        if (!this._hasDrawn) {
            if (this._isDrawing) {

                if (this._radius >= this._mag * 40) {
                    this._radius = 5;
                    this._isDrawing = false;
                    this._hasDrawn = true;
                    this.stopTone();
                }

                if (this._isPlaying) {
                    this._osc.amp(0.5, 0.05);
                }
                else {
                    this._osc.amp(0, 0.5);
                }
                var x = map(this._long, -180, 180, 0, width);
                var y = height - map(this._lat, -90, 90, 0, height);
                noStroke();

                fill(ellipseColor2);
                ellipse(x, y, this._radius, this._radius);
                this._radius += 1;

                fill(ellipseColor1);
                ellipse(x, y, 15, 15);
            }
        }
    }
}

function preload() {
    textFont = loadFont('./assets/Chivo-Light.otf');

    if (useDummy) {
        //mockup some test data
        let quakeEvent = new Earthquake(0, '10km N of Atlantis', 2.3, 150, 30, 4, 0);
        earthquakes.push(quakeEvent);
        quakeEvent = new Earthquake(0, '20km SSW of Morder', 4.9, 10, -60, 4, 5);
        earthquakes.push(quakeEvent);
        quakeEvent = new Earthquake(0, '28km SE of Atlantis', 0.5, -87, 11, 4, 10);
        earthquakes.push(quakeEvent);
    }
    else {
        //load data feed, uncomment line
        //Daily
        // var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
        //Hourly
        var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
        loadJSON(url, loadData);
    }

}

function loadData(results) {
    var firstEventTime = moment(results.features[0].properties.time);
    for (var i = 0; i < results.features.length; i++) {
        let quakeEvent = new Earthquake(
            i,
            results.features[i].properties.place,
            results.features[i].properties.mag,
            results.features[i].geometry.coordinates[0],
            results.features[i].geometry.coordinates[1],
            results.features[i].geometry.coordinates[2],
            // moment(results.features[i].properties.time).diff(firstEventTime, 'seconds')
            firstEventTime.diff(moment(results.features[i].properties.time), 'seconds') / 100
        );
        earthquakes.push(quakeEvent);
    }

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    backgroundColor =  color(97, 74, 226);
    ellipseColor1 = color('rgba(11, 34, 62, 1)');
    ellipseColor2 = color('rgba(255, 255, 255, 0.1)');
    background(backgroundColor);

    startTime = millis();
}

function draw() {
    background(backgroundColor);
    var interval = (millis() - startTime) / 1000;
    for (var i = 0; i < earthquakes.length; i++) {
        if (interval > earthquakes[i]._time) {
            earthquakes[i].startDraw();
        }
    }
    for (var i = 0; i < earthquakes.length; i++) {
        earthquakes[i].draw();
    }
}