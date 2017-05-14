## Avatar loading

In SoundCloud's current design, we show comments on waveforms by drawing a small avatar of the author of each comment. One problem we have had was with network performance: on certain pages there are very many avatars to load. Sometimes a user will leave the current page before all the avatars have finished loading, however, after starting to load an Image element, there is no way to cancel that action.

In this challenge, we have constructed a contrived example of this situation for you to optimize.

- Run the supplied index.html file.
- Click on the 'Start' button, and 2000 images will start to preload. Depending on your connection speed, this could take up to 30-45 seconds to complete.
- Click the button again before the 2000 images finish loading.
    - This is our way to simulate the user leaving the page, and therefore not needing draw the 2000 images, that is, all further requests to these images should be considered as unwanted.
    - This starts a new load of 10 images.

Because of the naive implementation provided, the 10 images take a very long time to show up, since the browser is still loading the previous images.

Without doing any of the basic diligence a normal developer would do (eg: ask "Why on earth would you load 2000 avatars for a waveform this size??"), come up with a solution which makes the 10 avatars show within a more appropriate amount of time.

### Notes

- Remember that this is a extracted version of a real-life problem, so something which could be applied to the real-life scenario (a page of players on soundcloud.com) is the desired solution:
    - There is a function `window.stop()`, which will cancel all active network requests including the images, however it has the chance of stopping other items from loading, so please do not use this.
    - Consider what would produce the best user experience on a page with many players with different numbers of avatars to load.
- All the code you should need to modify is in the `load-images.js` file.
- We expect this should take roughly two hours.
