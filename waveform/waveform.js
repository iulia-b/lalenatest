/**
 * A view of a waveform.
 */
(function () {

  class Waveform {

    constructor({ sound, canvas }) {
      this.sound = sound;
      this.canvas = canvas;
      this.data = this.sound.waveformData;
      this._initConst();
    }

    
    // Draw the canvas the first time. This is called once only, and before any calls to `update()`.
    render() {
      const jqcanvas = $(this.canvas);
      this.canvasHeight = jqcanvas.height();
      this.canvasWidth = jqcanvas.width();
      this._initBaseValues();

      jqcanvas.on('click', e => this.handleCanvasClickEvent(e));
      this._bindTimeUpdateEvent();

      this.ctx = this.canvas.getContext('2d');
      this.lastPlaytime = 0;
      this._updateSegment(0, this.canvas.width, this.COLOR_UNSOUND);
    }

    // Update the visual state of the waveform so that it accurately represents the play progress of its sound.
    // This is called by the main handler
    // In order to optimize performance, this is drawing only the differential play time, 
    //  aka from the position it was last called to the currentTime position
    update() {
      // Calculate beginning and ending of the time segment that needs to be drawn
      let start = Math.min(this.lastPlaytime, this.sound.currentTime);
      let end = Math.max(this.lastPlaytime, this.sound.currentTime);

      if (this.lastPlaytime === end) {
        return;
      }
      
      // Update lastPlayTime to keep up to date with drawn played time
      this.lastPlaytime = end;

      // Normalize the songTime to the canvas width
      this._updateSegment(this._timeToPixels(start), this._timeToPixels(end), this.COLOR_SOUND);
    }

    // Visually updates the segment from start to end with the given color
    // start and end are params representing position in pixels that need to be drawn
    _updateSegment(start, end, color) {
      for (let x = start; x < end; x++) {

        // Get the data value from sound data set coresponding to the current position
        const sampleInd = Math.floor(x * this.sampleInd_base );
        const value = Math.floor(this.value_base * this.data.samples[sampleInd] );
        
        // The second for is not needed as it is drawing a rectangle
        // It is enough to compute Y axis values
        // it start from value and goes to (this.canvas - value) - value + 1
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, value, 1, this.canvasHeight - 2*value + 1);
      }
    }

    handleCanvasClickEvent(e) {
      // Get the sound time corresponding to the mouse position within canvas
      this.currentSeek = this._pixelsToTime(e.offsetX);

      let start = Math.min(this.lastPlaytime, this.currentSeek);
      let end = Math.max(this.lastPlaytime, this.currentSeek);
      
      // Check if mouse click was before or after currentPlayTime
      // aka rewind or fast forward
      let color = this.lastPlaytime > this.currentSeek
        ? this.COLOR_UNSOUND 
        :  this.COLOR_SOUND;

      // Update current time position
      this.lastPlaytime = this.currentSeek;
      // Update sound time
      this.sound.seek(this.currentSeek);

      console.log('before h', this.lastPlaytime, this.sound.currentTime);
      this._updateSegment(this._timeToPixels(start), this._timeToPixels(end), color);
      console.log('handled', this._timeToPixels(start), this._timeToPixels(end));
    }

    _timeToPixels(timeValue) {
      return Math.floor(timeValue * this.canvasWidth / this.sound.duration);
    }

    _pixelsToTime(offset) {
      return Math.floor(offset * this.sound.duration / this.canvasWidth);
    }

    _initBaseValues() {
      this.sampleInd_base = this.data.width / this.canvasWidth;
      this.value_base = this.canvasHeight / this.data.height / 2;

      this.lastPlaytime = 0;
      this.currentSeek = 0;
    }

    _initConst() {
      this.COLOR_UNSOUND = '#333333';
      this.COLOR_SOUND = '#ff6600';
      this.TimeUpdateEvent = 'timeUpdate';
    }

    _bindTimeUpdateEvent() {
          this.sound.on(this.TimeUpdateEvent, this.update, this);
    }

    _unbindTimeUpdateEvent() {
          this.sound.off(this.TimeUpdateEvent);
    }
  };

  // adds .on, .off, .trigger
  _.assign(Waveform.prototype, SC.Events);

  SC.Waveform = Waveform;

}());
