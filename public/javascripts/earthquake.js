class Earthquake {
    constructor(id, title, lat, long, depth) {
        //Get our values
        this._id = id;
        this._title = title;
        this._lat = lat;
        this._long = long;
        this._depth = depth;

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
}