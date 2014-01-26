/**
 * webapp cropper
 *
 * Mobile webapp image copper Plug-in, can crop, zoom in/out and rotate images from album or camera.
 *
 * Copyright (c) 2014 Vitrum Zhu <vitrum.cn@gmail.com>
 * Released under the MIT license
 */
;(function(window, document, Math) {
	var rAF = window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame      ||
        window.mozRequestAnimationFrame         ||
        window.oRequestAnimationFrame           ||
        window.msRequestAnimationFrame          ||
        function (callback) { window.setTimeout(callback, 1000 / 60); };
	var utils = (function () {

	})();

	function WACropper (el, options) {
		this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style;                // cache style for better performance

        this.options = {

                resizeScrollbars: true
        };
	})();

})();