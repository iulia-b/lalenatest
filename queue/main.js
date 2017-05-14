// Code in here shouldn't need to be changed, but might be useful to understand the flow of the demonstration

(function () {
  let manyDeferred;
  let fewDeferred;
  let step = 0;
  const canvas = document.getElementById('waveform');
  const ctx = canvas.getContext('2d');

  // loads 2000 images
  function loadAndShowMany() {
    manyDeferred = SC.loadImages(SC.avatarsMany).done(showImages);
  }

  // loads 10 images
  function loadAndShowFew() {
    ctx.clearRect(0, 0, 645, 60);

    // stop loading the previous avatars
    manyDeferred.reject();
    manyDeferred = null;

    fewDeferred = SC.loadImages(SC.avatarsFew).done(showImages);
  }

  // draw the given array of images onto the waveform
  function showImages(images) {
    images.forEach((img) => { ctx.drawImage(img, Math.random() * 625, 40); });
  }

  // some really dodgy program flow. Nothing to see here.
  function reset() {
    step = 0;
    ctx.clearRect(0, 0, 645, 60);
    fewDeferred.reject();
    fewDeferred = null;
  }

  $('#theButton').on('click', function () {
    switch (step++) {
      case 0:   // start loading a lot of images
        loadAndShowMany();
        this.innerHTML = 'Load only a few';
        break;
      case 1:
        loadAndShowFew();
        this.innerHTML = 'Reset';
        break;
      case 2:
        reset();
        this.innerHTML = 'Start';
    }
  });
}());
