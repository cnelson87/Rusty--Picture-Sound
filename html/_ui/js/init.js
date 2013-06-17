
var PICSOU = PICSOU || {};

PICSOU.main = {
	init: function() {
		var self = this;
		//console.log('PICSOU.main.init');
		//$.event.trigger('PICSOU:main:initialized');

		// element references
		var elHeroTabs = $('#hero-tabs');
		var elModalImageTriggers = $('.modal-image-trigger');
		var elModalVideoTriggers = $('.modal-video-trigger');

		// init hero tabs
		if (elHeroTabs.length) {
			var heroTabs = new CNJS.UI.TabSwitcher(elHeroTabs);
		}

		// init modal images
		if (elModalImageTriggers.length) {
			var modalImages = new CNJS.UI.ModalImage(elModalImageTriggers);
		}

		// init modal videos
		if (elModalVideoTriggers.length) {
			var modalVideos = new CNJS.UI.ModalVideo(elModalVideoTriggers);
		}

	}
};

$(function() {
	PICSOU.main.init();
});
