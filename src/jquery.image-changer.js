 ;(function(root, factory){
  "use strict";

  // CommonJS module.
  if( typeof module === "object" && typeof module.exports === "object" ){
    factory(require("jquery"));

  // AMD module.
  }else if( typeof define === "function" && define.amd ){
    define(["jquery"], factory);

  // Browser globals. root = window
  }else{
    factory(root.jQuery);
  }


}(this, function($){
  "use strict";

  var version = "2.0.6",

  // Default Options
  defaults = {
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
  },

  optionKeys = $.map(defaults, function(v, k){ return k; }),

  // Namespace
  ns = "ic",

  // Events
  MouseEvent = {
    ROLL_OVER: "mouseenter." + ns,
    ROLL_OUT : "mouseleave." + ns,
    CLICK    : "click." + ns
  },

  TouchEvent = {
    TOUCH_START: "touchstart." + ns,
    TOUCH_END  : "touchend." + ns,
    TOUCH_MOVE : "touchmove." + ns
  },

  // Classes
  ClassSet = {
    image: ns + "-image",
    inner: ns + "-inner",
    on   : ns + "-on",
    off  : ns + "-off"
  },

  // touch device?
  isTouch = ("ontouchstart" in window),

  // lt IE7?
  ltIe7 = window.addEventListener === undefined && document.querySelectorAll === undefined;




  /**
   * =========================================================
   * Utilities
   * =========================================================
   */
  function sliceArray(array, start, end){
    return Array.prototype.slice.call(array, start, end !== undefined ? end : array.length);
  }

  function isEmpty(val){
    return !val || val === "" || val === 0;
  }
  
  function hasProp(obj, key){
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
  }

  function pregQuote(str, delimiter){
    return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  }

  function imageTypesToRegex(imageTypes){
    var reg = $.type(imageTypes) === "string" ? imageTypes.split("|") : imageTypes.concat();
    return "\\." + reg.join("\|\\.");
  }





  /**
   * =========================================================
   * Transition
   * =========================================================
   */
  var Transition = {
    // Builtin Transitions
    builtin: {},

    // transition base
    base: {
      defaults: {
        duration: 150,
        easing: "linear",
        opacity: 0
      },
      initialize: function(params){
        params = params;
        this.$on.css("opacity", 0);
      },
      on: function(params, done){
        params = params;
        this.$on.css("opacity", 1);
        this.$off.css("opacity", 0);
        done.call();
      },
      off: function(params, done){
        params = params;
        this.$on.css("opacity", 0);
        this.$off.css("opacity", 1);
        done.call();
      },
      destroy: function(){
      }
    }
  };




  /**
   * =========================================================
   * ImageChanger
   * =========================================================
   */
  function ImageChanger(){
    // Call Global API
    if( $.type(arguments[0]) === "string" ){
      return ImageChanger.callAPI.apply(this, arguments);

    // Generation of instance
    }else{
      this.version = version;
      this.options = null;
      this.transition = null;
      this.imageTypes = "";

      this.$elem = null;
      this.$img = null;
      this.$parant = null;
      this.$on = null;
      this.$off = null;

      this.status = {
        active : false,
        animate: false,
        enable : false,
        loaded : false,
        error  : false
      };

      this.touchTimer = false;

      this.on = "";
      this.off = "";

      // Initialize
      this._initialize.apply(this, arguments);
    }
  }

  /**
   * Initialize
   * @param jQueryObject 
   * @param object
   */
  ImageChanger.prototype._initialize = function($elem, options){
    this.$elem = $elem;
    this.options = options;
    
    // beforeInit
    if( this._callbackApply("beforeInit", options.beforeInit) === false ){
      return false;
    }

    // Initialize
    this.$img = $elem.find("img");
    this.$parent = this.$img.parent();
    this.transition = this._getTransition();
    this.imageTypes = imageTypesToRegex(options.imageTypes);

    // acquisition of the src attribute
    var src = "";
    if( options.backgroundImage ){
      src = this.$elem.css("background-image") || "";
      src = src.match(/url\((\S+)\)/) ? RegExp.$1 : "";
      src = src.replace(/"/g, "");
    }else{
      src = this.$img.attr("src");
    }

    // return false if the empty
    if( isEmpty(src) ) return false;

    // `startOn`
    var on = this._hasSuffix(src);

    if( on ){
      this.on = src;
      this.off = this._removeSuffix(src);
      this.status.active = true;
    }else{
      this.on = this._addSuffix(src);
      this.off = src;
    }

    // build HTML
    this._buildHtml();

    // load image
    $("<img>")
      .on("load", $.proxy(this._loadSuccess, this))
      .on("error", $.proxy(this._loadError, this))
      .attr("src", on ? this.off : this.on );
  };

  /**
   * Build HTML elements
   * @return void
   */
  ImageChanger.prototype._buildHtml = function(){
    var $elem = this.$elem,
        $inner,
        $image,
        $off,
        $on,
        contents = $elem.html(),
        size = {
          width: $elem.width(),
          height: $elem.height()
        },
        position;


    // for background image
    if( this.options.backgroundImage === true ){
      var style = {
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        display: "inline-block",
        width: size.width,
        height: size.height
      };

      position = $elem.css("position");
      position = position != "static" ? position : "relative";

      // save original DOM
      style.zIndex = 3;
      $inner = $("<span>").addClass(ClassSet.inner).css(style).html(contents);

      // off image
      style.zIndex = 2;
      style.backgroundImage = "url("+this.off+")";
      $off = $("<span>").addClass(ClassSet.off).css(style);

      // on image
      style.zIndex = 1;
      style.backgroundImage = "url("+this.on+")";
      $on = $("<span>").addClass(ClassSet.on).css(style);

      // append
      $elem
        .css({
          "background-image": "transparent",
          "position": position
        })
        .append($inner)
        .append($off)
        .append($on);


    // for <img>
    }else{
      var styleOn = {
            position: "absolute",
            zIndex: 1
          },
          styleOff = {};

      // off image
      $off = this.$img;
      position = $off.css("position");

      // on image
      $on = $( $("<div>").append($off.clone()).html() ) // ie7 jQuery.clone() bug fix
        .addClass(ClassSet.on)
        .attr("src", this.on);

      // wrap
      $off.wrap('<span class="'+ClassSet.image+'" style="position:relative; display:inline-block; /display:inline;"></span>');
      $image = this.$elem.find(ClassSet.image);

      if( position === "static" ){
        styleOff.position = "relative";
        styleOn.top = 0;
        styleOn.left = 0;

      }else{
        styleOn.top = $off.css("top");
        styleOn.right = $off.css("right");
        styleOn.bottom = $off.css("bottom");
        styleOn.left = $off.css("left");
      }

      $on.css(styleOn);
      $off.css(styleOff);

      // append
      $off.css("z-index", 2).addClass(ClassSet.off);
      this.$elem.find("."+ClassSet.image).append($on);
    }

    this.$on = $on;
    this.$off = $off;
    this.$inner = $inner;
    this.$image = $image;

    // In the case of active image at the start
    if( this.status.active ){
      this.$off.attr("src", this.off).css("opacity", 0);
    }
  };

  /**
   * Remove HTML elements
   * @return void
   */
  ImageChanger.prototype._unbuildHtml = function(){
    if( this.options.backgroundImage === true ){
      this.$elem.css({
        "background-image": "",
        "position": ""
      });
      this.$inner.remove();
      this.$on.remove();
      this.$off.remove();

    }else{
      this.$img.unwrap();
      this.$on.remove();
      this.$off
        .css({
          "position": "",
          "z-index": ""
        })
        .removeClass(ClassSet.off);
    }
  };

  /**
   * Handler of image load completion
   * @param eventObj
   * @return void
   */
  ImageChanger.prototype._loadSuccess = function(){
    this.status.enable = this.status.loaded = true;

    // bind events
    this._bindEvents();

    // transition intialize
    this.transition.initialize.call(this, $.extend({}, this.transition.defaults, this.options.transition));

    // afterInit
    this._callbackApply("afterInit", this.options.afterInit, "success");
  };

  /**
   * Handler of image load error
   * @param eventObj
   * @return void
   */
  ImageChanger.prototype._loadError = function(){
    this.status.error = true;

    // afterInit
    this._callbackApply("afterInit", this.options.afterInit, "error");
  };

  /**
   * Set some events
   * @return void
   */
  ImageChanger.prototype._bindEvents = function(){
    if( this.options.hover === true ){
      if( isTouch ){
        this.$elem
          .on(TouchEvent.TOUCH_START, $.proxy(this._onTouchStartHandler, this))
          .on(TouchEvent.TOUCH_END, $.proxy(this._onTouchEndHandler, this))
          .on(TouchEvent.TOUCH_MOVE, $.proxy(this._onTouchMoveHandler, this));
      }else{
        this.$elem
          .on(MouseEvent.ROLL_OVER, $.proxy(this._onRollOverHandler, this))
          .on(MouseEvent.ROLL_OUT, $.proxy(this._onRollOutHandler, this));
      }
    }
  };

  /**
   * Release some events
   * @return void
   */
  ImageChanger.prototype._unbindEvents = function(){
    if( this.options.hover === true ){
      if( isTouch ){
        this.$elem
          .off(TouchEvent.TOUCH_START)
          .off(TouchEvent.TOUCH_END)
          .off(TouchEvent.TOUCH_MOVE);
      }else{
        this.$elem
          .off(MouseEvent.ROLL_OVER)
          .off(MouseEvent.ROLL_OUT);
      }
    }
  };

  /**
   * RollOver
   * @return void
   */
  ImageChanger.prototype._onRollOverHandler = function(){
    this.onImage();
  };

  /**
   * RollOut
   * @return void
   */
  ImageChanger.prototype._onRollOutHandler = function(){
    this.offImage();
  };

  /**
   * TouchStart
   * @return void
   */
  ImageChanger.prototype._onTouchStartHandler = function(){
    this.onImage();
  };

  /**
   * TouchEnd
   * @return void
   */
  ImageChanger.prototype._onTouchEndHandler = function(){
    this.offImage();
  };

  /**
   * TouchMove
   * @return void
   */
  ImageChanger.prototype._onTouchMoveHandler = function(){
    if( this.touchTimer ) clearTimeout(this.touchTimer);
    this.touchTimer = setTimeout($.proxy(this.offImage, this), 200);
  };

  /**
   * Execution of callback
   * @param string
   * @param function
   * @param [param1, param2, ...]
   * @return mixed
   */
  ImageChanger.prototype._callbackApply = function(){
    var type = arguments[0],
        callback = arguments[1],
        params = sliceArray(arguments, 2),
        f = $.isFunction(callback) ? callback : function(){},
        v = f.apply(this, params);

    // Fire Custom Event
    var e = new $.Event(ns + "." + type);
    e.target = this.$elem;
    this.$elem.trigger(e, this);

    return v;
  };

  /**
   * Have the suffix
   * @param string
   * @return boolean
   */
  ImageChanger.prototype._hasSuffix = function(src){
    return __hasSuffix(src, this.options.suffix, this.imageTypes);
  };

  /**
   * Add the suffix
   * @param string
   * @return string
   */
  ImageChanger.prototype._addSuffix = function(src){
    return __addSuffix(src, this.options.suffix, this.imageTypes);
  };

  /**
   * Remove the suffix
   * @param string
   * @return string
   */
  ImageChanger.prototype._removeSuffix = function(src){
    return __removeSuffix(src, this.options.suffix, this.imageTypes);
  };

  /**
   * Start transition
   * @param string
   * @return void
   */
  ImageChanger.prototype._transition = function(type, callback){
    var _this = this,
        params = $.extend({}, _this.transition.defaults, _this.options.transition || {});

    _this.transition[type].call(_this, params, function(){
      callback.call(_this);
    });
  };

  /**
   * Get transition
   * if empty create a new transition object
   * @return void
   */
  ImageChanger.prototype._getTransition = function(){
    var transition = this.options.transition;

    // not animations
    if( transition === false || transition === "none" ){
      return $.extend({}, Transition.base);

    // search buildint transitions
    }else if( hasProp(Transition.builtin, transition.type) ){
      return Transition.builtin[transition.type];

    // custom transition
    }else if( transition.type === "custom" ){
      return $.extend({}, Transition.base, transition);
    }

    throw new Error("[ImageChanger] :: Is invalid specification of transition.");
  };

  /**
   * Switching of the image is determined whether or not valid
   * @return boolean
   */
  ImageChanger.prototype.isChangeEnable = function(){
    return !this.status.error && this.status.enable;
  };

  /**
   * Switch the image
   * @param function
   * @return void
   */
  ImageChanger.prototype.toggle = function(callback){
    if( this.status.active ){
      this.offImage(callback);
    }else{
      this.onImage(callback);
    }
  };

  /**
   * To active image
   * @param function
   * @return void
   */
  ImageChanger.prototype.onImage = function(callback){
    if( !this.isChangeEnable() || this.status.active ) return false;

    // beforeChange & beforeOnImage
    if( this._callbackApply("beforeChange", this.options.beforeChange, "on") === false ) return false;
    if( this._callbackApply("beforeOnImage", this.options.beforeOnImage) === false ) return false;

    this.status.active = true;
    this.status.animate = true;

    // change animation
    this._transition("on", function(){
      this.status.animate = false;

      // afterChange & afterOnImage
      this._callbackApply("afterChange", this.options.afterChange, "on");
      this._callbackApply("afterOnImage", this.options.afterOnImage);

      if( $.isFunction(callback) ) callback.call(this);
    });
  };

  /**
   * To default image
   * @param function
   * @return void
   */
  ImageChanger.prototype.offImage = function(callback){
    if( !this.isChangeEnable() || !this.status.active ) return false;

    // beforeChange & beforeOffImage
    if( this._callbackApply("beforeChange", this.options.beforeChange, "off") === false ) return false;
    if( this._callbackApply("beforeOffImage", this.options.beforeOffImage) === false ) return false;

    this.status.active = false;
    this.status.animate = true;

    // change animation
    this._transition("off", function(){
      this.status.animate = false;

      // afterChange & afterOffImage
      this._callbackApply("afterChange", this.options.afterChange, "off");
      this._callbackApply("afterOffImage", this.options.afterOffImage);

      if( $.isFunction(callback) ) callback.call(this);
    });
  };

  /**
   * Temporarily disable this plugin
   * @return void
   */
  ImageChanger.prototype.disable = function(){
    this.status.enable = false;
  };

  /**
   * To enable
   * @return void
   */
  ImageChanger.prototype.enable = function(){
    if( !this.status.error ) this.status.enable = true;
  };

  /**
   * Destroy this plugin
   * @return void
   */
  ImageChanger.prototype.destroy = function(){
    if( !this.$elem.data("imageChanger") ) return false;

    // transition
    this.transition.destroy.call(this);

    // destroy all events. and DOM(styles)
    this._unbindEvents();
    this._unbuildHtml();

    // set status
    this.status.enable = false;

    // remove data
    this.$elem.removeData("imageChanger");
  };




  /**
   * =========================================================
   * Global API
   * =========================================================
   */
  var imageTypesReg = imageTypesToRegex(defaults.imageTypes);



  /**
   * Check have the suffix
   * @param string | jQueryObject
   * @param string
   * @param string
   * @return boolean
   */
  function __hasSuffix(target, suffix, imageTypes){
    suffix = suffix || defaults.suffix;
    imageTypes = imageTypes || imageTypesReg;
    if( $.type(target) === "string" ){
      return target.match(new RegExp("^(.+)" + suffix + "(" + imageTypes + ")$", "gi")) ? true : false;
    }
    return false;
  }

  /**
   * Add the suffix
   * @param string | jQueryObject
   * @param string
   * @param string
   * @return string | array
   */
  function __addSuffix(target, suffix, imageTypes){
    suffix = suffix || defaults.suffix;
    imageTypes = imageTypes || imageTypesReg;

    if( $.type(target) === "string" ){
      if( __hasSuffix.apply(this, arguments) ) return target;
      return target.replace(new RegExp("^(.+)(" + imageTypes + ")$", "gi"), "$1" + suffix + "$2");

    }else if( target && target["jquery"] ){
      var $this, src, results = [];

      target.each(function(){
        $this = $(this);
        if( $this.is("img") ){
          src = __addSuffix($this.attr("src"), suffix, imageTypes);
          $this.attr("src", src);
          results.push(src);
        }else{
          results = results.concat(__addSuffix($this.find("img"), suffix, imageTypes));
        }
      });

      return results;
    }

    return false;
  }

  /**
   * Remove the suffix
   * @param string | jQueryObject
   * @param string
   * @param string
   * @return string | array
   */
  function __removeSuffix(target, suffix, imageTypes){
    suffix = suffix || defaults.suffix;
    imageTypes = imageTypes || imageTypesReg;

    if( $.type(target) === "string" ){
      if( !__hasSuffix.apply(this, arguments) ) return target;
      return target.replace(new RegExp("^(.+)(" + suffix + ")(" + imageTypes + ")$", "gi"), "$1$3");

    }else if( target && target["jquery"] ){
      var $this, src, results = [];

      target.each(function(){
        $this = $(this);
        if( $this.is("img") ){
          src = __removeSuffix($this.attr("src"), suffix, imageTypes);
          $this.attr("src", src);
          results.push(src);
        }else{
          results = results.concat(__removeSuffix($this.find("img"), suffix, imageTypes));
        }
      });

      return results;
    }

    return false;
  }

  /**
   * Toggle the suffix
   * @param string | jQueryObject
   * @param string
   * @param string
   * @return string | array
   */
  function __toggleSuffix(target, suffix, imageTypes){
    suffix = suffix || defaults.suffix;
    imageTypes = imageTypes || imageTypesReg;

    if( $.type(target) === "string" ){
      return __hasSuffix.apply(this, arguments) ? 
        __removeSuffix.apply(this, arguments) :
        __addSuffix.apply(this, arguments);

    }else if( target && target["jquery"] ){
      var $this, src, results = [];

      target.each(function(){
        $this = $(this);
        if( $this.is("img") ){
          src = __toggleSuffix($this.attr("src"), suffix, imageTypes);
          $this.attr("src", src);
          results.push(src);
        }else{
          results = results.concat(__toggleSuffix($this.find("img"), suffix, imageTypes));
        }
      });

      return results;
    }

    return false;
  }

  /**
   * Run the API from the method name
   * @param string
   * @param [arg1, arg2, ...]
   * @return mixed
   */
  ImageChanger.callAPI = function(){
    var method = arguments[0],
        params = sliceArray(arguments, 1);

    switch( method ){
      case "addSuffix"    : return __addSuffix.apply(this, params);
      case "removeSuffix" : return __removeSuffix.apply(this, params);
      case "toggleSuffix" : return __toggleSuffix.apply(this, params);
      default: 
        throw new Error("[ImageChanger] :: Is invalid specification of Global API.");
    }
  };

  /**
   * register built-in transition.
   * @param string
   * @param object
   * @return void
   */
  ImageChanger.registerTransition = function(name, transition){
    Transition.builtin[name] = $.extend({}, Transition.base, transition);
  };

  /**
   * unregister built-in transition
   * @param string
   * @return void
   */
  ImageChanger.unregisterTransition = function(name){
    delete Transition.builtin[name];
  };





  /**
   * =========================================================
   * Built in transitions
   * =========================================================
   */

  // fade
  ImageChanger.registerTransition("fade", {
    initialize: function(params){
      this.$on.css("opacity", 0);
    },
    on: function(params, done){
      this.$on.css("opacity", 1);
      
      this.$off
        .stop()
        .animate({
          "opacity": params.opacity
        }, params.duration, params.easing, done);
    },
    off: function(params, done){
      this.$on
        .stop()
        .animate({
          "opacity": 1
        }, params.duration / 2, params.easing);

      this.$off
        .stop()
        .animate({
          "opacity": 1
        }, params.duration, params.easing, done);
    },
    destroy: function(){
      this.$off.stop(true,true).css("opacity", "");
      this.$on.stop(true,true).css("opacity", "");
    }
  });


  // wink
  ImageChanger.registerTransition("wink", {
    defaults: {
      duration: 150,
      easing: "swing",
      opacity: 0.4
    },
    initialize: function(params){
      this.$on.css("opacity", 0);
    },
    on: function(params, done){
      if( this.$off.is(":animated") ){
        done.call();
      }else{
        this.$on
          .stop()
          .animate({
            "opacity": 1
          }, params.duration, params.easing)
          .animate({
            "opacity": 0
          }, params.duration, params.easing);

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
      this.$on.stop(true,true).css("opacity", "");
      this.$off.stop(true,true).css("opacity", "");
    }
  });


  // slide
  ImageChanger.registerTransition("slide", {
    defaults: {
      duration: 150,
      easing: "swing",
      direction: "top",
      display: "inline-block"
    },
    initialize: function(params){
      var position = this.$elem.css("position") === "static" ? "relative" : this.$elem.css("position"),
          display = this.$elem.css("display") === "inline" ? params.display : this.$elem.css("display");

      this.$elem.css({
        "position": position,
        "overflow": "hidden",
        "display": display
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


  // Export global api.
  $.imageChanger = $.imageChanger || ImageChanger;


  // Register imageChanger method for $.fn
  $.fn.imageChanger = function(options){
    return this.each(function(){
      
      var $this = $(this),
          dataOptions = {},
          val;

      if( !$this.data("imageChanger") ){

        // Parse custom data attributes.
        $.each(optionKeys, function(i, d){
          val = $this.data( $.camelCase(ns + "-" + d.toLowerCase()) );
          if( val !== undefined ){
            dataOptions[d] = val;
          }
        });

        // Create ImageChanger instance
        $this.data("imageChanger", new ImageChanger($this, $.extend({}, defaults, options, dataOptions)));
      }
    });
  };


}));