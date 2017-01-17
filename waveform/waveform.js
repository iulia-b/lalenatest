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

      this.sound.on('timeUpdate', this.update, this);
    }

    // Draw the canvas the first time. This is called once only, and before any calls to `update()`.
    render() {
      this.update();
    }

    // Update the visual state of the waveform so that it accurately represents the play progress of its sound.
    update() {
      const data = this.sound.waveformData;
      const ctx = this.canvas.getContext('2d');

      ctx.clearRect(0, 0, Infinity, Infinity);

      for (let x = 0; x < this.canvas.offsetWidth; x++) {

        const sampleInd = Math.floor(x * data.width / this.canvasWidth);
        const value = Math.floor(this.canvasHeight * data.samples[sampleInd] / data.height / 2);

        for (let y = value; y < this.canvasHeight - value; y++) {
          ctx.fillStyle = x < this.sound.currentTime / this.sound.duration * this.canvasWidth ? '#f60' : '#333';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  };

  // adds .on, .off, .trigger
  _.assign(Waveform.prototype, SC.Events);

  SC.Waveform = Waveform;

}());
