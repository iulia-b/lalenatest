window.addEventListener("DOMContentLoaded", function() {

	var control = document.getElementsByClassName('profile controls')[0];
	var userProfile = document.getElementsByClassName('user-profile')[0];
	var playingMode = document.getElementsByClassName('playing-mode')[0];
	var overlay = playingMode.getElementsByClassName('overlay')[0];
	var pauseButton = playingMode.getElementsByClassName('button pause')[0];
	var playButton = userProfile.getElementsByClassName('button play')[0];

	var initHandlers = function() {
		control.onclick = function() {
			var pb = playingMode.getElementsByClassName('button play')[0];
			playButton.toggle();
			userProfile.slideUp();
			pauseButton.classList.add('fadeOut');

			isPlaying = true;
		};

		playingMode.onclick = function() {
			var pb = playingMode.getElementsByClassName('button play')[0];			
			overlay.toggle();
			pb.toggle();
			//	pauseButton.toggle();
			if (isPlaying) {
				pauseButton.classList.remove('fadeOut');				
			} else {
				pauseButton.classList.add('fadeOut');
			}
			isPlaying = !isPlaying;
		}
	}

	var initDomMethods = function(hide) {
		HTMLElement.prototype.slideUp = function() {
			this.classList.add('slideUp');
		}

		HTMLElement.prototype.toggle = function() {
			if (this.classList.contains('hide')) {
				this.classList.remove('hide');
			} else {
				this.classList.add('hide');
			}
		}
	}

	initDomMethods();
	initHandlers();

	var seek = function() {
		var demo = document.getElementById('demo');
		var img = document.getElementById('waveform');
		var ctx = demo.getContext('2d'),
		w = demo.width,
		h = demo.height,
		img = new Image,
		x = 0,
		url = 'assets/waveform.png',
		grd = ctx.createLinearGradient(0, 0, 0, h);

		grd.addColorStop(0, 'rgba(255, 255, 255, .1)');
		grd.addColorStop(.2, 'rgba(255, 85, 0, .3)');
		grd.addColorStop(.5, 'rgb(255, 85, 0)');
		grd.addColorStop(.7, 'rgba(255, 85, 0, .3)');
		grd.addColorStop(1, 'rgba(255, 255, 255, .1)');

		img.crossOrigin = 'anonymous';
		img.onload = loop;
		img.src = url;
	}

	var loop = function() {
		x++;        // sync this with actual progress

		// since we will change composite mode and clip:
		ctx.save();

		// clear background with black
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, w, h);

		// remove waveform, change composite mode
		ctx.globalCompositeOperation = 'destination-atop';
		ctx.drawImage(img, 0, 0, w, h);

		// fill new alpha, same mode, different region.
		// as this will remove anything else we need to clip it
		ctx.fillStyle = grd;
		ctx.beginPath();
		ctx.rect(0, 0, x, h);
		ctx.clip();    /// et clipping
		ctx.fill();    /// use the same rect to fill

		// remove clip and use default composite mode
		ctx.restore();

		// loop until end
		if (x < w) requestAnimationFrame(loop);
		}

}, false);