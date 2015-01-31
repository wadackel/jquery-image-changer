/**
 * =======================================================
 * imageChanger - builtin transitions
 * =======================================================
 */
;(function($, window, undefined){
	"use strict";


	// fade
	$.imageChanger.registerTransition("fade", {
		on: function(params, done){
			this.$off
				.stop()
				.animate({
					"opacity": params.opacity
				}, params.duration, params.easing, done);
		},
		off: function(params, done){
			this.$off
				.stop()
				.animate({
					"opacity": 1
				}, params.duration, params.easing, done);
		},
		destroy: function(){
			this.$off.stop(true,true).css("opacity", "");
		}
	});


	// wink
	$.imageChanger.registerTransition("wink", {
		defaults: {
			duration: 150,
			easing: "swing",
			opacity: 0.4
		},
		on: function(params, done){
			if( this.$off.is(":animated") ){
				done.call();
			}else{
				this.$off
					.stop()
					.animate({
						"opacity": params.opacity
					}, params.duration, params.easing)
					.animate({
						"opacity": 1
					}, params.duration, params.easing, done);
			}
		},
		off: function(params, done){
			params = params;
			done.call();
		},
		destroy: function(){
			this.$off.stop(true,true).css("opacity", "");
		}
	});


	// slide
	$.imageChanger.registerTransition("slide", {
		defaults: {
			duration: 150,
			easing: "swing",
			direction: "top",
			display: "inline-block"
		},
		initialize: function(params){

			var position = this.$elem.css("position") === "static" ? "relative" : this.$elem.css("position");

			this.$elem.css({
				"position": position,
				"overflow": "hidden",
				"display": params.display
			});

			var size = {
				width: this.$elem.width(),
				height: this.$elem.height()
			};

			switch( params.direction ){
				case "top":
					this.$off.css({"top": 0});
					this.$on.css({"top": size.height});
					break;
				case "right":
					this.$off.css({"left": 0});
					this.$on.css({"left": -size.width});
					break;
				case "bottom":
					this.$off.css({"top": 0});
					this.$on.css({"top": -size.height});
					break;
				case "left":
					this.$off.css({"left": 0});
					this.$on.css({"left": size.width});
					break;
			}
		},
		on: function(params, done){
			var size = {
				width: this.$elem.width(),
				height: this.$elem.height()
			};

			switch( params.direction ){
				case "top":
					this.$off.stop().animate({"top": -size.height}, params.duration, params.easing);
					this.$on.stop().animate({"top": 0}, params.duration, params.easing, done);
					break;
				case "right":
					this.$off.stop().animate({"left": size.width}, params.duration, params.easing);
					this.$on.stop().animate({"left": 0}, params.duration, params.easing, done);
					break;
				case "bottom":
					this.$off.stop().animate({"top": size.height}, params.duration, params.easing);
					this.$on.stop().animate({"top": 0}, params.duration, params.easing, done);
					break;
				case "left":
					this.$off.stop().animate({"left": -size.width}, params.duration, params.easing);
					this.$on.stop().animate({"left": 0}, params.duration, params.easing, done);
					break;
			}
		},
		off: function(params, done){
			var size = {
				width: this.$elem.width(),
				height: this.$elem.height()
			};

			switch( params.direction ){
				case "top":
					this.$off.stop().animate({"top": 0}, params.duration, params.easing);
					this.$on.stop().animate({"top": size.height}, params.duration, params.easing, done);
					break;
				case "right":
					this.$off.stop().animate({"left": 0}, params.duration, params.easing);
					this.$on.stop().animate({"left": -size.width}, params.duration, params.easing, done);
					break;
				case "bottom":
					this.$off.stop().animate({"top": 0}, params.duration, params.easing);
					this.$on.stop().animate({"top": -size.height}, params.duration, params.easing, done);
					break;
				case "left":
					this.$off.stop().animate({"left": 0}, params.duration, params.easing);
					this.$on.stop().animate({"left": size.width}, params.duration, params.easing, done);
					break;
			}
		},
		destroy: function(){
			var emptyPosition = {
				"top": "",
				"right": "",
				"bottom": "",
				"left": ""
			};

			this.$off.stop(true,true).css(emptyPosition);
			this.$on.stop(true,true).css(emptyPosition);

			this.$elem.css({
				"position": "",
				"overflow": "",
				"display": ""
			});
		}
	});


}(jQuery, window));
