/*
	TITLE: Carousel

	DESCRIPTION: standard carousel

	USAGE: new CNJS.UI.Carousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	VERSION: 0.1.0

	AUTHORS: Chris Nelson

	DEPENDENCIES:
		- jQuery 1.8+
		- class.js
		- cnjs.js

*/

CNJS.UI.Carousel = Class.extend({
    init: function($element, objOptions) {
		var self = this;

		// defaults
		this.$window = CNJS.Config.$window;
		this.elContainer = $element;
		this.options = $.extend({
			initialIndex: 0,
			itemsPerGroup: 1,
			visibleItems: 1,
			selectorNavPrev: 'a.nav-prev',
			selectorNavNext: 'a.nav-next',
			selectorInnerTrack: 'ul.carousel-inner-track',
			selectorItems: 'li',
			disabledClass: 'disabled',				// str: set css class for disabled prev/next nav
			autoRotate: false,						// bool: auto rotate thru all items
			autoRotateInterval: 6000,				// num: delay (in milliseconds) between auto rotations
			maxAutoRotations: 1,					// num: stop auto rotation after x cycles
			animDuration: 400,
			animEasing: 'swing',
			customEventPrfx: 'CNJS:UI:Carousel'
	    }, objOptions || {});

		// element references
		this.elNavPrev = this.elContainer.find(this.options.selectorNavPrev);
		this.elNavNext = this.elContainer.find(this.options.selectorNavNext);
		this.elInnerTrack = this.elContainer.find(this.options.selectorInnerTrack);
		this.elItems = this.elInnerTrack.find(this.options.selectorItems);

		// setup & properties
		this.containerID = this.elContainer.attr('id');
		this._isInitialized = false;				// bool: is widget initialized yet?
		this._isAnimating = false;					// bool: is widget currently animating?
		this._len = this.elItems.length;
		if (this.options.initialIndex >= this._len) {this.options.initialIndex = 0;}
		this.scrollAmt = this.elItems.outerWidth() * -1;
		this.setAutoRotation = null;
		this.rotationInterval = null;
		this.autoRotationCounter = null;
		this.currentIndex = this.options.initialIndex;
		this.lastIndex = this._len - this.options.visibleItems;

		this._initDisplay();

        delete this.init;
    },

/**
*	Private Methods
**/
	_initDisplay: function() {
		var self = this;
		var leftPos = this.scrollAmt * this.currentIndex;
		var currentIndex = this.currentIndex;
		var count = this.currentIndex + this.options.visibleItems;
		var elItem;

		// add aria attributes
		this.elContainer.attr({'role':'tablist', 'tabindex':'-1', 'aria-multiselectable':'false'});
		this.elItems.attr({'role':'tabpanel', 'tabindex':'-1', 'aria-expanded':'false', 'aria-hidden':'true'});
		this.elNavPrev.attr({'role':'button', 'aria-controls': this.containerID});
		this.elNavNext.attr({'role':'button', 'aria-controls': this.containerID});
		this.updateItems();

		// disable nav links if not enough visible items
		this.updateNav();
		if (this._len <= this.options.visibleItems) {
			this.elNavPrev.addClass(this.options.disabledClass);
			this.elNavNext.addClass(this.options.disabledClass);
		}

		// adjust initial position
		this.elInnerTrack.css({left: leftPos});

		// auto-rotate items
		if (this.options.autoRotate) {
			this.rotationInterval = this.options.autoRotateInterval;
			this.autoRotationCounter = this._len * this.options.maxAutoRotations;
			this.setAutoRotation = setInterval(function(){
				self._autoRotation();
			}, self.rotationInterval);
		}

		this._isInitialized = true;

		$.event.trigger(this.options.customEventPrfx + ':isInitialized', [this.elContainer]);

		this._bindEvents();

	},

	_bindEvents: function() {
		var self = this;

		this.elNavPrev.bind('click', function(e){
			e.preventDefault();
			if (!self.elNavPrev.hasClass(self.options.disabledClass) && !self._isAnimating) {
				self.__clickNavPrev(e);
			}
		});
		this.elNavNext.bind('click', function(e){
			e.preventDefault();
			if (!self.elNavNext.hasClass(self.options.disabledClass) && !self._isAnimating) {
				self.__clickNavNext(e);
			}
		});

	},
	_autoRotation: function () {
		this.currentIndex++;
		if (this.currentIndex === this._len) {this.currentIndex = 0;}
		this.updateCarousel();
		this.autoRotationCounter--;
		if (this.autoRotationCounter === 0) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
	},

/**
*	Event Handlers
**/
	__clickNavPrev: function(e) {
		var self = this;

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
		this.currentIndex = this.currentIndex - this.options.itemsPerGroup;
		this.updateCarousel();

	},
	__clickNavNext: function(e) {
		var self = this;

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}
		this.currentIndex = this.currentIndex + this.options.itemsPerGroup;
		this.updateCarousel();

	},

/**
*	Public Methods
**/
	updateCarousel: function() {
		var self = this;
		var leftPos = this.scrollAmt * this.currentIndex;

		this._isAnimating = true;

		this.updateNav();

		this.elItems.attr({'aria-expanded':'false', 'aria-hidden':'true'});

		this.elInnerTrack.animate({
			left: leftPos
		}, self.options.animDuration, self.options.animEasing, function(){
			self.updateItems();
			self._isAnimating = false;
		});

		$.event.trigger(this.options.customEventPrfx + ':carouselUpdated', [this.currentIndex]);

	},
	updateItems: function() {
		var self = this;
		var currentIndex = this.currentIndex;
		var count = this.currentIndex + this.options.visibleItems;
		var elItem;

		for (var i=currentIndex; i<count; i++) {
			elItem = $(this.elItems[i]);
			elItem.attr({'aria-expanded':'true', 'aria-hidden':'false'});
			if (i === currentIndex && this._isInitialized) {
				elItem.focus();
			}
		}

	},
	updateNav: function() {
		var self = this;

		this.elNavPrev.removeClass(this.options.disabledClass);
		this.elNavNext.removeClass(this.options.disabledClass);

		if (this.currentIndex <= 0) {
			this.elNavPrev.addClass(this.options.disabledClass);
		}
        if (this.currentIndex >= this.lastIndex) {
			this.elNavNext.addClass(this.options.disabledClass);
        }

	}

});
// end Carousel

// start MultiCarouselController
CNJS.UI.MultiCarouselController = Class.extend({
    init: function($elements, objOptions) {
		this.elContainers = $elements;
		this.options = objOptions;
		this.arrCarousels = [];
		var elContainer;
		for (var i=0, len = this.elContainers.length; i<len; i++) {
			elContainer = $(this.elContainers[i]);
			this.arrCarousels[i] = new CNJS.UI.Carousel(elContainer, this.options);
		}
	}
});
