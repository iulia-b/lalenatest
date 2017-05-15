SC.loadImages = (() => {
  // Presumably the avatar size of a picture is in avarage 3kb so loading 50 pictures at a time would be efficient network wise
  const BATCH_SIZE = 100;
  
  /**
   * Given an array of urls, load these images. When they are all loaded (or errored), then resolve a deferred with an
   * array of image elements ready to be drawn onto the canvas.
   *
   * If the returned deferred object is rejected, we should stop loading these images.
   *
   * @param {Array.<String>} urls
   * @return {Deferred}      This is resolved with {Array.<Image>}
   */
  function loadImagesBadPerformance(urls) {
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

   function loadImages(urls) {
    log(`Starting to load ${urls.length} images`);

  // Create the deffered so its status can be followed and canceled when promise it's rejected
    const allDone = $.Deferred();
    allDone.fail(() => {
      log(`Loading ${urls.length} images cancelled`);
    });

    // Call worker method that will divide the images in more batches
    loadInBatches(allDone, urls, []);
    
    return allDone;    
  }

  function loadInBatches($q, urls, loaded) {

    // Return loaded array of images if the user does not navigate away
    if (!urls || urls.length === 0) {
      $q.resolve(loaded);
      console.log('Finished batches');
      return;
    }

    // 
    if ($q.state() !== 'pending') {
      $q.reject('Navigating away; cancel loading images');
      console.log('Cancel loading; leaving page');
      return;
    }

    const startTime = Date.now();
    const deferreds = urls.splice(0, BATCH_SIZE).map(loadImage);

    $.when.apply($, deferreds).then((...images) => {
      log(`Loading batch ${loaded.length / 100} took ${Date.now() - startTime}ms`);
      
      loadInBatches($q, urls, loaded.concat(images.filter(Boolean)));
      // pick out the Image elements from the resolution values of each deferred,
      // and resolve the overall deferred with these images.
      // allDone.resolve(images.filter(Boolean));
    }).catch((err) => {
      log(`not necesarily failed but something happened ${err}`);
    });
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
