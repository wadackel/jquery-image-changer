jquery-image-changer 
====================

[![npm version](https://badge.fury.io/js/jquery-image-changer.svg)](http://badge.fury.io/js/jquery-image-changer)
[![Build Status](https://travis-ci.org/tsuyoshiwada/jquery-image-changer.svg?branch=master)](https://travis-ci.org/tsuyoshiwada/jquery-image-changer)

![jquery-image-changer](https://raw.githubusercontent.com/tsuyoshiwada/jQuery.imageChanger/images/plugin.png)


Simple jQuery plug-in that the switching of the image with the animation.


## Demo

[demo](http://tsuyoshiwada.github.io/jquery-image-changer/)


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
		type: "fade"
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
	transition: false
});
```

![wink transition](https://raw.githubusercontent.com/tsuyoshiwada/jquery-image-changer/images/wink.gif)

**wink:**

```javascript
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
To do the registration you can use the `$.imageChanger.registerTransition()`.


**Example `$.imageChanger#registerTransition()`**

```javascript
// Register Custom Transition.
$.imageChanger.registerTransition("example", {
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
* **[2015.06.15]** Fix IE7 bug `<a>` click does not respond. And add animation of PNG image to demo page.
* **[2015.04.05]** Support `bower` and `npm` install. And some bug fixes.
* **[2015.01.31]** Fix IE7 `slide` transition bugs.
* **[2015.01.27]** Support the option specified in the custom data attributes.
* **[2015.01.04]** First release.


## TODO
* Switching of multiple image.
* Provide global API. (Example: `$.imageChanger("toggle", $(selector))`)



## Licence
Released under the [MIT Licence](https://github.com/tsuyoshiwada/jQuery.imageChanger/blob/master/LICENCE)


## Author
[tsuyoshi wada](https://github.com/tsuyoshiwada/)
