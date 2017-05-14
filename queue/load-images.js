SC.loadImages = (() => {
  /**
   * Given an array of urls, load these images. When they are all loaded (or errored), then resolve a deferred with an
   * array of image elements ready to be drawn onto the canvas.
   *
   * If the returned deferred object is rejected, we should stop loading these images.
   *
   * @param {Array.<String>} urls
   * @return {Deferred}      This is resolved with {Array.<Image>}
   */
  function loadImages(urls) {
    log(`Starting to load ${urls.length} images`);

    const allDone = $.Deferred();
    const startTime = Date.now();
    const deferreds = urls.map(loadImage);

    $.when.apply($, deferreds).then((...images) => {
      log(`Loading ${urls.length} took ${Date.now() - startTime}ms`);

      // pick out the Image elements from the resolution values of each deferred,
      // and resolve the overall deferred with these images.
      allDone.resolve(images.filter(Boolean));
    });

    allDone.fail(() => {
      log(`Loading ${urls.length} images cancelled`);
    });

    return allDone;
  }

  /**
   * Given a single URL, return a deferred which is resolved once the image is loaded or its loading has failed.
   *
   * For our purposes, a failed load is okay. If the load is successful, the deferred is resolved with an Image element.
   *
   * @param {String} url
   * @return {Deferred}
   */
  function loadImage(url) {
    const deferred = $.Deferred();
    const img = new Image();

    img.onload = () => deferred.resolve(img);
    img.onerror = deferred.resolve; // no img means it failed, but that's okay, we just won't draw it.

    // start loading the image
    img.src = url;

    return deferred;
  }

  // for some debugging messages
  function log(str) {
    $('#log').append($('<li></li>').text(str));
  }

  return loadImages;
})();
