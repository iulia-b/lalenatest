/**
 * A view of a waveform.
 */
(function () {

  class Waveform {

    constructor({ sound, canvas }) {
      this.sound = sound;
      this.canvas = canvas;
      const jqcanvas = $(this.canvas);
      this.canvasHeight = jqcanvas.height();
      this.canvasWidth = jqcanvas.width();

      jqcanvas.on('click', e => this.handleCanvasClickEvent(e));

      this.data = this.sound.waveformData;

      this.sound.on('timeUpdate', this.update, this);

      this.initBaseValues();
      this.initConst();
    }

    // Draw the canvas the first time. This is called once only, and before any calls to `update()`.
    render() {
      this.ctx = this.canvas.getContext('2d');

      this.updateSegment(0, this.canvas.width);
    }

    updateSegment(start, end) {
      let colorBase = this.sound.currentTime / this.sound.duration * this.canvasWidth;
      for (let x = start; x < end; x++) {

        const sampleInd = Math.floor(x * this.sampleInd_base);
        const value = Math.floor(this.value_base * this.data.samples[sampleInd] );
        
        this.ctx.fillStyle = x < colorBase
                            ? this.COLOR_SOUND 
                            : this.COLOR_UNSOUND;
        // The second for is not needed as it is drawing a rectangle
        // It is enough to compute Y axis values
        // it start from value and goes to (this.canvas - value) - value + 1                            
        this.ctx.fillRect(x, value, 1, this.canvasHeight - 2*value + 1);
      }
    }

    // Update the visual state of the waveform so that it accurately represents the play progress of its sound.
    update() {
     
      //this.ctx.clearRect(0, 0, Infinity, Infinity);
      let start = Math.min(this.lastPlaytime, this.sound.currentTime);
      let end = Math.max(this.lastPlaytime, this.sound.currentTime);

      this.updateSegment(start, end);

      //this.lastPlaytime = this.sound.currentTime;
      
    }

    seek() {
      
    }

    handleCanvasClickEvent(e) {
      this.sound.currentTime = e.offsetX;
    }

    initBaseValues() {      
      this.sampleInd_base = this.data.width / this.canvasWidth;
      this.value_base = this.canvasHeight / this.data.height / 2;

      this.lastPlaytime = 0;
      this.currentSeek = 0;
    }

    initConst() {
      this.COLOR_UNSOUND = '#333333';
      this.COLOR_SOUND = '#ff6600';
    }
  };

  // adds .on, .off, .trigger
  _.assign(Waveform.prototype, SC.Events);

  SC.Waveform = Waveform;

}());
