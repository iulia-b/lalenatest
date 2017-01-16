(function main() {

  const longSound = new SC.Sound(SC.longSound)
  const shortSound = new SC.Sound(SC.shortSound)
  const shortWaveform = new SC.Waveform({
    canvas: document.getElementById('waveform-short'),
    sound: shortSound
  });
  const longWaveform = new SC.Waveform({
    canvas: document.getElementById('waveform-long'),
    sound: longSound
  });

  shortWaveform.render();
  longWaveform.render();

  $('#play-button-short').on('click', function () {
    shortSound.toggle();
    $(this).toggleClass('sc-button-pause sc-button-play');
  });

  $('#play-button-long').on('click', function () {
    longSound.toggle();
    $(this).toggleClass('sc-button-pause sc-button-play');
  });


}());
