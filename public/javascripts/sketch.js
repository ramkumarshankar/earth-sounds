var earthquakes = [];
var regularFont;

var backgroundColor;
var screenColor = {
    r: 65,
    g: 62,
    b: 74
};

var ellipseColor1;
var pointColor = {
    r: 240,
    g: 180,
    b: 158
};
var ellipseColor2;
var radiusColor = {
    r: 211,
    g: 225,
    b: 241,
    a: 120
};
var textColor;

var startTime;
var maxDepth = 0;
var minDepth = 0;
var useDummy = false;
var hasPlayed = false;

//Envelope
var env;
var attackLevel = 1.0;
var releaseLevel = 0;
var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;
var osc;

var ambientSound;

var loNotes = [50, 56, 60, 64, 67];
var hiNotes = [72, 77, 83, 87, 92];
var notes = [50, 56, 60, 64, 67, 72, 77, 83, 87, 92];
var notesSize = notes.length;

var prevNote = 5;

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
        this._colorAlpha = 255;

        //Set some flags
        this._hasPlayed = false;
        this._isDrawing = false;
        this._hasDrawn = false;
        this._fadeOut = false;
    }

    setupTone() {
        //TODO: do something with frequency?
        var direction = random();
        var distance = random();
        var note = prevNote;
        if (direction < 0.5) {
            if (distance < 0.5) {
                note -= 1;
            }
            else {
                note -= 2;
            }
        }
        else {
            if (distance < 0.5) {
                note += 1;
            }
            else {
                note += 2;
            }
        }
        prevNote = constrain(note, 0, notesSize-1);
        this._freq = midiToFreq(notes[prevNote]);
        // this._freq = midiToFreq(notes[Math.floor(random(notesSize))]);
        // var boundary = (maxDepth + minDepth) / 2;
        // if (this._depth >= boundary) {
        //     this._freq = midiToFreq(loNotes[Math.floor(random(5))]);
        // }
        // else {
        //     this._freq = midiToFreq(hiNotes[Math.floor(random(5))]);
        // }
    }

    startDraw() {
        this._isDrawing = true;
    }

    draw() {
        if (this._isDrawing) {

            if (this._radius >= this._mag * 40) {
                this._radius = 5;
                this._fadeOut = true;
                env.triggerRelease(osc);
            }

            if (!this._hasPlayed) {
                osc.freq(this._freq);
                // env.play(osc, 0, 0.1);
                env.triggerAttack(osc);
                this._hasPlayed = true;
            }

            var x = map(this._long, -180, 180, 0, width);
            var y = height - map(this._lat, -90, 90, 0, height);

            if (this._fadeOut) {
                if (this._colorAlpha < 0) {
                    this._fadeOut = false;
                    this._hasDrawn = true;
                    this._isDrawing = false;
                    this._colorAlpha = 255;
                }
                else {
                    fill(color(pointColor.r, pointColor.g, pointColor.b, this._colorAlpha));
                    ellipse(x, y, 15, 15);

                    fill(255, 255, 255, this._colorAlpha);
                    textSize(16);
                    textAlign(CENTER);
                    textFont(regularFont);

                    text(this._title, x, y + 30);

                    this._colorAlpha -= 10;
                }
            }
            else {

                noStroke();

                fill(ellipseColor2);
                ellipse(x, y, this._radius, this._radius);
                this._radius += 0.5;

                fill(ellipseColor1);
                ellipse(x, y, 15, 15);

                fill(textColor);
                textSize(16);
                textAlign(CENTER);
                textFont(regularFont);
                text(this._title, x, y + 30);
            }
        }
    }
}

function preload() {
    regularFont = loadFont('./assets/Chivo-Light.otf');

    ambientSound = loadSound('./assets/falling-through-space.mp3');

    if (useDummy) {
        //mockup some test data
        let quakeEvent = new Earthquake(0, '10km N of Atlantis', 2.3, 150, 30, 4, 0);
        earthquakes.push(quakeEvent);
        quakeEvent = new Earthquake(0, '20km SSW of Mordor', 4.9, 10, -60, 4, 5);
        earthquakes.push(quakeEvent);
        quakeEvent = new Earthquake(0, '28km SE of Atlantis', 0.5, -87, 11, 4, 10);
        earthquakes.push(quakeEvent);
    }
    else {
        //load data feed, uncomment line
        //Daily
        var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
        // Hourly
        // var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
        loadJSON(url, loadData);
    }

}

function loadData(results) {
    var firstEventTime = moment(results.features[0].properties.time);
    var startTime = 0;
    for (var i = 0; i < results.features.length; i++) {
        // var timeInterval = firstEventTime.diff(moment(results.features[i].properties.time), 'seconds') / 1000;
        var timeInterval = random(0, 2);
        var eventdiff =  constrain(timeInterval, 0.3, 1.5);
        startTime += eventdiff;
        let quakeEvent = new Earthquake(
            i,
            results.features[i].properties.place,
            results.features[i].properties.mag,
            results.features[i].geometry.coordinates[0],
            results.features[i].geometry.coordinates[1],
            results.features[i].geometry.coordinates[2],
            //Todo: decide how to sequence the events
            startTime
            // firstEventTime.diff(moment(results.features[i].properties.time), 'seconds') / 1000
        );
        earthquakes.push(quakeEvent);
        if (results.features[i].geometry.coordinates[2] > maxDepth) {
            maxDepth = results.features[i].geometry.coordinates[2];
        }
        if (results.features[i].geometry.coordinates[2] < minDepth) {
            minDepth = results.features[i].geometry.coordinates[2];
        }
    }
    for (var i = 0; i <  earthquakes.length; i++) {
        earthquakes[i].setupTone();
    }
}

function checkPlayed() {
    hasPlayed = false;
    for (var i = 0; i < earthquakes.length; i++) {
        if (earthquakes[i]._hasDrawn) {
            hasPlayed = true;
            continue;
        }
        print(i);
        hasPlayed = false;
        break;
    }
    return hasPlayed;
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth();
    backgroundColor =  color(screenColor.r, screenColor.g, screenColor.b);
    ellipseColor1 = color(pointColor.r, pointColor.g, pointColor.b);
    ellipseColor2 = color(radiusColor.r, radiusColor.g, radiusColor.g, radiusColor.a);
    textColor = color('rgba(255, 255, 255, 1)');
    background(backgroundColor);

    env = new p5.Env();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);

    osc = new p5.Oscillator();
    osc.start();

    ambientSound.loop();
    ambientSound.play();
    ambientSound.setVolume(0.3);

    startTime = millis();

}

function draw() {
    background(backgroundColor);
    var interval = (millis() - startTime) / 1000;
    for (var i = 0; i < earthquakes.length; i++) {
        if (interval > earthquakes[i]._time) {
            if (!earthquakes[i]._hasDrawn) {
                earthquakes[i].startDraw();
            }
        }
    }
    for (var i = 0; i < earthquakes.length; i++) {
        earthquakes[i].draw();
    }
    if (checkPlayed()) {
        for (var i = 0; i < earthquakes.length; i++) {
            earthquakes[i]._hasDrawn = false;
            earthquakes[i]._hasPlayed = false;
            earthquakes[i].setupTone();
        }
        startTime = millis();
    }
}