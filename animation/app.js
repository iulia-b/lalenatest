window.addEventListener("DOMContentLoaded", function() {

	var control = document.getElementById('profile-controls');
	var userProfile = document.getElementById('user-profile');
	var playingMode = document.getElementById('playing-mode');
	var overlay = playingMode.getElementsByClassName('overlay')[0];
	var pauseButton = playingMode.getElementsByClassName('button pause')[0];
	var playButton = userProfile.getElementsByClassName('button play')[0];

	var initHandlers = function() {
		control.addEventListener('click', function() {
			playButton.toggle();
			userProfile.slideUp();

			pauseButton.toggleClass('fadeTransition');
			pauseButton.toggleClass('fadeOut');
		});

		playingMode.addEventListener('click', function() {
			overlay.toggle();
			pauseButton.toggleClass('pause', 'play');
			pauseButton.toggleClass('fadeTransition');
			pauseButton.toggleClass('fadeOut');
		});
	}

	var initDomMethods = function(hide) {
		HTMLElement.prototype.slideUp = function() {
			this.classList.add('slideUp');
		}

		HTMLElement.prototype.toggle = function() {
			this.toggleClass('hide');
		}

		HTMLElement.prototype.toggleClass = function() {
			for (var i = 0; i < arguments.length; i++) {
				if (this.classList.contains(arguments[i])) {
					this.classList.remove(arguments[i]);
				} else {
					this.classList.add(arguments[i]);
				}
			}
		}
	}

	initDomMethods();
	initHandlers();


}, false);