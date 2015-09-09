jquery-image-changer
====================

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/jquery-image-changer.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/jquery-image-changer)
[![npm version](https://img.shields.io/npm/v/jquery-image-changer.svg?style=flat-square)](http://badge.fury.io/js/jquery-image-changer)
[![Bower](https://img.shields.io/bower/v/jquery-image-changer.svg?style=flat-square)](http://bower.io/search/?q=jquery-image-changer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/master/LICENSE)

![jquery-image-changer](https://raw.githubusercontent.com/tsuyoshiwada/jQuery.imageChanger/images/plugin.png)


Simple jQuery plug-in that the switching of the image with the animation.


## Demo

[see jquery-image-changer demo](http://tsuyoshiwada.github.io/jquery-image-changer/)


## Features

* Switch the image of on and off in the hover events  
	(You can be disabled in the options)
* Can change the suffix
* Support for some of the transition
* Extension of transition
* Support for `background-image` switching
* Disabled in the 404 error
* Support callback and custom events
* Support enable and disable methods
* Support destroy method
* Other it will provide some utility API.


## Install

### npm

```
$ npm install jquery-image-changer
```

### Bower

```
$ bower install jquery-image-changer
```


## Usage

### Load jQuery and jquery.image-changer.js

```html
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="jquery.image-changer.min.js"></script>
```

### Set up HTML
```html
<a class="rollover" href="http://example.com" ><img src="path/to/image.jpg" alt="image"></a>
```

### Call the imageChanger()
```javascript
$(document).ready(function(){
	$(".rollover").imageChanger();
});
```


## Options

### Defaults

```javascript
$(selector).imageChanger({
	suffix         : "_on", // img.png => img_on.png
	hover          : true,
	transition     : {
		type: "fade",
		duration: 150,
		easing: "linear",
		opacity: 0
	},
	backgroundImage: false,
	imageTypes     : "jpg|jpeg|gif|png",

	// Callbacks
	beforeInit     : false,
	afterInit      : false,
	beforeChange   : false,
	afterChange    : false,
	beforeOnImage  : false,
	afterOnImage   : false,
	beforeOffImage : false,
	afterOffImage  : false
});
```

### suffix
Suffix of the active image.  
**Default: `"_on"`**  
**Type: `string`**

### hover
Switch the image `hover` events.  
Touch events will be used in the case of touch devices.  
**Default: `true`**  
**Type: `boolean`**

### transition
Specifies the transition.    
**Default: fade**  
**Type: `object`**

![fade transition](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/images/fade.gif)

```javascript
// Simple
$(selector).imageChanger(
	transition: "fade"
);

// More options
$(selector).imageChanger({
	transition: {
		type    : "fade",
		duration: 150,
		easing  : "linear",
		opacity : 0
	}
});
```

![none transition](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/images/none.gif)

**not animations:**

```javascript
$(selector).imageChanger({
	transition: false //false | "none" | "default"
});
```

![wink transition](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/images/wink.gif)

**wink:**

```javascript
// Simple
$(selector).imageChanger(
	transition: "wink"
);

// More options
$(selector).imageChanger({
	transition: {
		type    : "wink",
		duration: 150,
		easing  : "swing",
		opacity : 0.4
	}
});
```

**slide:**

![slide transition](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/images/slide.gif)

```javascript
// Simple
$(selector).imageChanger(
	transition: "slide"
);

// More options
$(selector).imageChanger({
	transition: {
		type     : "slide",
		duration : 150,
		easing   : "swing",
		direction: "top", // "top" | "bottom" | "left" | "right"
		display  : "inline-block"
	}
});
```

### backgroundImage
switching of the background image.  
**Default: `false`**  
**Type: `boolean`**

### imageTypes
Specifies the extension of the corresponding image.  
**Default: `"jpg|jpeg|gif|png"`**  
**Type: `string | array`**


## Data attributes
You can specify the options for each element after the `data-ic`.

### Example

**HTML**

```html
<a class="rollover" href="http://example.com" data-ic-suffix="_active" data-ic-transition='{"type":"wink"}'><img src="path/to/image.jpg" alt="image"></a>
```


## Custom Events
You will receive an event using the `jQuery#on()`.

```javascript
var $rollover = $(selector);

$rollover.on("ic.****", function(e, ic){
	// do something...
});
```

* `"ic.beforeInit"`
* `"ic.afterInit"`
* `"ic.beforeChange"`
* `"ic.afterChange"`
* `"ic.beforeOnImage"`
* `"ic.afterOnImage"`
* `"ic.beforeOffImage"`
* `"ic.afterOffImage"`



## Data API
To use `ImageChanger` $.fn.data use delegate function.

```javascript
var ic = $(selector).imageChanger().data("imageChanger");

ic.toggle();   //Toggle the image
ic.onImage();  //To active image
ic.offImage(); //To default image
ic.disable();  //Temporarily disable this plugin
ic.enable();   //To enable
ic.destroy();  //Destroy this plugin
```



## Global API
Will provide an API that does not depend on the elements. (version added: `2.0.6`)

```javascript
/**
 * $.imageChanger("addSuffix", target, [suffix]);
 * - target: string | jQueryObject
 * - suffix: string
 */
$.imageChanger("addSuffix", "path/img.jpg");                    // -> "path/img_on.jpg"
$.imageChanger("addSuffix", "path/img.jpg", "_active");         // -> "path/img_active.jpg"
$.imageChanger("addSuffix", "path/img_on.jpg");                 // -> "path/img_on.jpg"
$.imageChanger("addSuffix", $(selector));                       // -> will add the "_on" to all of the images.
$.imageChanger("addSuffix", $(selector), "_active");            // -> will add the "_active" to all of the images.

/**
 * $.imageChanger("removeSuffix", target, [suffix]);
 * - target: string | jQueryObject
 * - suffix: string
 */
$.imageChanger("removeSuffix", "path/img_on.jpg");                // -> "path/img.jpg"
$.imageChanger("removeSuffix", "path/img.jpg");                   // -> "path/img.jpg"
$.imageChanger("removeSuffix", "path/img_active.jpg", "_active"); // -> "path/img.jpg"
$.imageChanger("removeSuffix", $(selector));                      // -> will remove the "_on" of all of the images.
$.imageChanger("removeSuffix", $(selector), "_active");           // -> will remove the "_active" of all of the images.

/**
 * $.imageChanger("toggleSuffix", target, [suffix]);
 * - target: string | jQueryObject
 * - suffix: string
 */
$.imageChanger("toggleSuffix", "path/img.jpg");                   // -> "path/img_on.jpg"
$.imageChanger("toggleSuffix", "path/img_on.jpg");                // -> "path/img.jpg"
$.imageChanger("toggleSuffix", "path/img.jpg", "_active");        // -> "path/img_active.jpg"
$.imageChanger("toggleSuffix", "path/img_active.jpg", "_active"); // -> "path/img.jpg"
$.imageChanger("toggleSuffix", $(selector));                      // -> will toggle the "_on" of all of the images.
$.imageChanger("toggleSuffix", $(selector), "_active");           // -> will toggle the "_active" of all of the images.
```



## Custom Transitions

* **`initialize()`** - Implement the initialization of style and DOM structure
* **`on()`** - You implement the switch to the active image
* **`off()`** - You implement the switch to the default image
* **`destroy()`** - Implementation for returning to the default. (Called when `ImageChanger#destroy()`)

Please execute the callback function that comes in when you are finished animation argument.


**Example `type:"custom"`**

```javascript
$(selector).imageChanger({
	transition: {
		type: "custom",

		// default parametors
		defaults: {
			easing: "swing",
			duration: 150
		},

		initialize: function(params){
			this.$elem.css("overflow", "hidden");
			this.$on.css({
				"top": -20,
				"opacity": 0
			});
		},

		on: function(params, done){
			this.$off.stop().animate({
				"top": -20,
				"opacity": 0
			}, params.duration, params.easing);

			this.$on.stop().animate({
				"top": 0,
				"opacity": 1
			}, params.duration, params.easing, done);
		},

		off: function(params, done){
			this.$off.stop().animate({
				"top": 0,
				"opacity": 1
			}, params.duration, params.easing);

			this.$on.stop().animate({
				"top": -20,
				"opacity": 0
			}, params.duration, params.easing, done);
		}
	}
});
```

In addition, it can be registered as a builtin transition.  
To do the registration you can use the `$.imageChanger("registerTransition", ...)`.


**Example `$.imageChanger("registerTransition", ...)`**

```javascript
// Register Custom Transition.
$.imageChanger("registerTransition", {
	defaults: {
		// default parametors...
	},

	initialize: function(params){
	},

	on: function(params, done){
		done.call();
	},

	off: function(params, done){
		done.call();
	},

	destroy: function(params){
	}
});

// Use Custom Transition.
$(selector).imageChanger({
	transition: {
		type: "example"
	}
});
```

**Notes:**
`$.imageChanger.registerTransition()` It is deprecated. at version `2.0.7`.


## Requirements
`jQuery 1.7.2 +`


## Browser Support
* IE7 +
* Firefox
* Chrome
* Safari
* iOS5 +
* Android2.3 +


## Notes
### If lower than Firefox version 35.0
Bug occurs during the animation.  
It can be solved by adding the following CSS.

```css
.ic-on,
.ic-off {
  box-shadow:0 0 1px rgba(255, 255, 255, .01);
  background-color:rgba(255, 255, 255, 1);
}
```



## Change Log

### v2.0.7 (Jul 15, 2015)
Add 3 Global API. (`addSuffix`, `removeSuffix`, `toggleSuffix`)

### v2.0.5 (Jun 15, 2015)
Fix IE7 bug `<a>` click does not respond. And add animation of PNG image to demo page.

### v2.0.3 (Apr 5, 2015)
Support `bower` and `npm` install. And some bug fixes.

### v2.0.2 (Jan 31, 2015)
Fix IE7 `slide` transition bugs.

### v2.0.1 (Jan 27, 2015)
Support the option specified in the custom data attributes.

### v2.0.0 (Jan 4, 2015)
First release.


## Author
[tsuyoshi wada](https://github.com/tsuyoshiwada/)
