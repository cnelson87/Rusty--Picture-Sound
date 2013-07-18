
/**
*	set namespace
**/
var PICSOU = PICSOU || {};
var CNJS = CNJS || {};
CNJS.Config = {
	siteRoot: 'http://localhost:8888',
	videoService: 'youtube',
	isIE:  (navigator.userAgent.indexOf('MSIE') >= 0) ? true : false,
	isIE7: (navigator.userAgent.indexOf('MSIE 7') >= 0) ? true : false,
	isIE8: (navigator.userAgent.indexOf('MSIE 8') >= 0) ? true : false,
	isIE9: (navigator.userAgent.indexOf('MSIE 9') >= 0) ? true : false,
	isIDevice: (navigator.platform.indexOf('iPhone')>=0 || navigator.platform.indexOf('iPad')>=0) ? true : false,
	isIPhone: (navigator.userAgent.match(/iPhone/i) !== null) ? true : false,
	isIPad: (navigator.userAgent.match(/iPad/i) !== null) ? true : false,
	defaultAjaxErrorMessage: '<div class="errormessage"><p>Sorry. Ajax request failed.</p></div>'
};
CNJS.UTILS = CNJS.UTILS || {};
CNJS.UI = CNJS.UI || {};

$(function () {
	CNJS.Config.$window = $(window);
	CNJS.Config.$document = $(document);
	CNJS.Config.$html = $('html');
	CNJS.Config.$body = $('body');
	CNJS.Config.$html.removeClass('no-js').addClass('js-enabled');
	CNJS.Config.hasCssAnimations = Modernizr.cssanimations;
	CNJS.Config.hasCssTransitions = Modernizr.csstransitions;
	CNJS.Config.hasCssTransforms = Modernizr.csstransforms;
	CNJS.Config.hasMediaQueries = Modernizr.mq('only all');
	CNJS.Config.hasTouch = Modernizr.touch;
	//CNJS.Config.hasFlash = swfobject.hasFlashPlayerVersion('9.0');
});
