// for PhantomJS
var isTouch = "ontouchstart" in window;


function commonBeforeEach(){
  this.$fixture = $("#qunit-fixture").append([
    '<a class="rollover" href="index.html">',
      '<img src="images/btn.png" alt="Button" />',
    '</a>'
  ].join("\n"));
  this.$el = $(".rollover", this.$fixture);
}

function globalApiBeforeEach(){
  this.$fixture = $("#qunit-fixture").append([
    '<a class="rollover" id="rollover-1" href="index.html">',
      '<img src="images/btn_1.png" alt="Button" />',
    '</a>',

    '<a class="rollover" id="rollover-2" href="index.html">',
      '<img src="images/btn_2.png" alt="Button" />',
    '</a>',

    '<a class="rollover" id="rollover-3" href="index.html">',
      '<img src="images/btn_3.jpg" alt="Button" />',
    '</a>'
  ].join("\n"));

  this.$el = $(".rollover", this.$fixture);
  this.$rollover1 = $("#rollover-1", this.$fixture);
  this.$rollover2 = $("#rollover-2", this.$fixture);
  this.$rollover3 = $("#rollover-3", this.$fixture);
}

function convertAbsUrl(relativePath){
  var img = document.createElement("img");
  img.src = relativePath;
  return img.src;
}



QUnit.module("Global API - addSuffix", {
  beforeEach: globalApiBeforeEach
});

QUnit.test("should suffix is added", function(assert){
  // basic
  assert.strictEqual($.imageChanger("addSuffix", "./path/img.jpg"), "./path/img_on.jpg", "added `_on`");
  assert.strictEqual($.imageChanger("addSuffix", "./path/img_on.jpg"), "./path/img_on.jpg", "no change");

  // basic + suffix
  assert.strictEqual($.imageChanger("addSuffix", "./path/img.jpg", "_active"), "./path/img_active.jpg", "added `_active`");
  assert.strictEqual($.imageChanger("addSuffix", "./path/img_active.jpg", "_active"), "./path/img_active.jpg", "no change");
});

QUnit.test("should `_on` is added to all of the images", function(assert){
  var results = $.imageChanger("addSuffix", this.$el);
  assert.deepEqual(results, [
    "images/btn_1_on.png",
    "images/btn_2_on.png",
    "images/btn_3_on.jpg"
  ]);
});

QUnit.test("should `_active` is added to all of the images", function(assert){
  var results = $.imageChanger("addSuffix", this.$el, "_active");
  assert.deepEqual(results, [
    "images/btn_1_active.png",
    "images/btn_2_active.png",
    "images/btn_3_active.jpg"
  ]);
});



QUnit.module("Global API - removeSuffix", {
  beforeEach: globalApiBeforeEach
});

QUnit.test("should suffix is removed", function(assert){
  // basic
  assert.strictEqual($.imageChanger("removeSuffix", "./path/img.jpg"), "./path/img.jpg", "no change");
  assert.strictEqual($.imageChanger("removeSuffix", "./path/img_on.jpg"), "./path/img.jpg", "removed `_on`");

  // basic + suffix
  assert.strictEqual($.imageChanger("removeSuffix", "./path/img.jpg", "_active"), "./path/img.jpg", "no change");
  assert.strictEqual($.imageChanger("removeSuffix", "./path/img_active.jpg", "_active"), "./path/img.jpg", "removed `_active`");
});

QUnit.test("should `_on` is removed to all of the images", function(assert){
  $.imageChanger("addSuffix", this.$el);
  var results = $.imageChanger("removeSuffix", this.$el);
  assert.deepEqual(results, [
    "images/btn_1.png",
    "images/btn_2.png",
    "images/btn_3.jpg"
  ]);
});

QUnit.test("should `_active` is removed to all of the images", function(assert){
  $.imageChanger("addSuffix", this.$el, "_active");
  var results = $.imageChanger("removeSuffix", this.$el, "_active");
  assert.deepEqual(results, [
    "images/btn_1.png",
    "images/btn_2.png",
    "images/btn_3.jpg"
  ]);
});



QUnit.module("Global API - toggleSuffix", {
  beforeEach: globalApiBeforeEach
});

QUnit.test("should suffix is toggled", function(assert){
  // basic
  assert.strictEqual($.imageChanger("toggleSuffix", "./path/img.jpg"), "./path/img_on.jpg", "added `_on`");
  assert.strictEqual($.imageChanger("toggleSuffix", "./path/img_on.jpg"), "./path/img.jpg", "removed `_on`");

  // basic + suffix
  assert.strictEqual($.imageChanger("toggleSuffix", "./path/img.jpg", "_active"), "./path/img_active.jpg", "added `_active`");
  assert.strictEqual($.imageChanger("toggleSuffix", "./path/img_active.jpg", "_active"), "./path/img.jpg", "removed `_active`");
});

QUnit.test("should `_on` is toggled to all of the images", function(assert){
  var results;

  $.imageChanger("addSuffix", this.$rollover2);

  results = $.imageChanger("toggleSuffix", this.$el);
  assert.deepEqual(results, [
    "images/btn_1_on.png",
    "images/btn_2.png",
    "images/btn_3_on.jpg"
  ]);

  results = $.imageChanger("toggleSuffix", this.$el);
  assert.deepEqual(results, [
    "images/btn_1.png",
    "images/btn_2_on.png",
    "images/btn_3.jpg"
  ]);
});

QUnit.test("should `_active` is toggled to all of the images", function(assert){
  var results;

  $.imageChanger("addSuffix", this.$rollover1, "_active");
  $.imageChanger("addSuffix", this.$rollover3, "_active");

  results = $.imageChanger("toggleSuffix", this.$el, "_active");
  assert.deepEqual(results, [
    "images/btn_1.png",
    "images/btn_2_active.png",
    "images/btn_3.jpg"
  ]);

  results = $.imageChanger("toggleSuffix", this.$el, "_active");
  assert.deepEqual(results, [
    "images/btn_1_active.png",
    "images/btn_2.png",
    "images/btn_3_active.jpg"
  ]);
});




QUnit.module("Core", {
  beforeEach: commonBeforeEach
});


QUnit.test("should be chainable", function(assert){
  assert.strictEqual(this.$el.imageChanger(), this.$el);
});


QUnit.test("should initialization callback is executed", function(assert){
  var _this = this,
      done1 = assert.async(),
      done2 = assert.async(),
      $elError = _this.$el.clone();

  $elError.find("img").attr("src", "hoge.jpg");
  _this.$fixture.append( $elError );

  _this.$el.imageChanger({
    beforeInit: function(){
      assert.ok(true, "before the initialization - success");
    },
    afterInit: function(status){
      assert.strictEqual( status, "success", "after the initialization - success" );
      done1();
    }
  });

  $elError.imageChanger({
    beforeInit: function(){
      assert.ok(true, "before the initialization - 404 error");
    },
    afterInit: function(status){
      assert.strictEqual( status, "error", "after the initialization - 404 error");
      done2();
    }
  });
});


QUnit.test("should be construction of a DOM elements", function(assert){
  var _this = this,
      done = assert.async();

  _this.$el.imageChanger({
    afterInit: function(){
      assert.strictEqual( $("> span.ic-image", this.$elem).size(), 1 );
      assert.strictEqual( $("> span.ic-image > img.ic-off", this.$elem).size(), 1 );
      assert.strictEqual( $("> span.ic-image > img.ic-on", this.$elem).size(), 1 );
      done();
    }
  });
});


QUnit.test("should custom data attribute is priority", function(assert){
  var _this = this;

  _this.$fixture.append( _this.$el.clone().addClass("suffix").attr("data-ic-suffix", "_active") );
  _this.$fixture.append( _this.$el.clone().addClass("imagetypes").attr("data-ic-imagetypes", "jpg|gif") );

  $(".rollover", _this.$fixture)
    .imageChanger({
      suffix: "_on",
      imageTypes: ["jpg", "jpeg", "png"]
    })
    .each(function(){
      var $this = $(this),
          ic = $this.data("imageChanger");

      if( $this.hasClass("suffix") ){
        assert.strictEqual( ic.options.suffix, "_active" );
      }else{
        assert.strictEqual( ic.options.suffix, "_on" );
      }

      if( $this.hasClass("imagetypes") ){
        assert.strictEqual( ic.options.imageTypes, "jpg|gif" );
      }else{
        assert.deepEqual( ic.options.imageTypes, ["jpg", "jpeg", "png"] );
      }
    });
});


QUnit.test("it should be a path suffix has been added", function(assert){
  var _this = this,
      done1 = assert.async(),
      done2 = assert.async();

  _this.$el.clone().imageChanger({
    suffix: "_testSuffix",
    afterInit: function(status){
      assert.strictEqual( status, "error" );
      assert.strictEqual( convertAbsUrl( this.$off.attr("src") ), convertAbsUrl("./images/btn.png") );
      assert.strictEqual( convertAbsUrl( this.$on.attr("src") ), convertAbsUrl("./images/btn_testSuffix.png") );
      done1();
    }
  });

  _this.$el
    .clone()
    .find("img")
      .attr("src", "./path/to/image.sample.jpg")
      .end()
    .imageChanger({
      suffix: ".test-suffix",
      afterInit: function(status){
        assert.strictEqual( status, "error" );
        assert.strictEqual( convertAbsUrl( this.$off.attr("src") ), convertAbsUrl("./path/to/image.sample.jpg") );
        assert.strictEqual( convertAbsUrl( this.$on.attr("src") ), convertAbsUrl("./path/to/image.sample.test-suffix.jpg") );
        done2();
      }
    });

});


QUnit.test("should be changed image by hover events", function(assert){
  var _this = this,
      done1 = assert.async(),
      done2 = assert.async(),
      $elStartOn = _this.$el.clone();

  $elStartOn.find("img").attr("src", "images/btn_on.png");
  _this.$fixture.append( $elStartOn );

  _this.$el.imageChanger({
    hover: true,
    transition: false,
    afterInit: function(status){
      assert.equal( this.$off.css("opacity"), 1, "should before switching opacity is 1" );
      if( isTouch ) this.$elem.trigger("touchstart");
      else          this.$elem.trigger("mouseenter");
    },
    afterOnImage: function(){
      assert.equal( this.$off.css("opacity"), 0, "should after switching opacity is 0" );
      if( isTouch ) this.$elem.trigger("touchend");
      else          this.$elem.trigger("mouseleave");
    },
    afterOffImage: function(){
      assert.equal( this.$off.css("opacity"), 1, "when you have finished switching opacity should be a 1" );
      done1();
    }
  });

  $elStartOn.imageChanger({
    hover: true,
    transition: false,
    afterInit: function(status){
      assert.equal( this.$off.css("opacity"), 0, "should before switching opacity is 0" );
      if( isTouch ) this.$elem.trigger("touchend");
      else          this.$elem.trigger("mouseleave");
    },
    afterOffImage: function(){
      assert.equal( this.$off.css("opacity"), 1, "when you have finished switching opacity should be a 1" );
      if( isTouch ) this.$elem.trigger("touchstart");
      else          this.$elem.trigger("mouseenter");
    },
    afterOnImage: function(){
      assert.equal( this.$off.css("opacity"), 0, "should after switching opacity is 0" );
      done2();
    }
  });

});


QUnit.test("should be value of the position is adjusted", function(assert){
  var _this = this,
      done1 = assert.async()
      done2 = assert.async(),
      done3 = assert.async();

  _this.$el
    .html("Button")
    .css("background-image", "url(./images/btn.png)");

  var $elStatic = _this.$el.clone().css("position", "static"),
      $elAbsolute = _this.$el.clone().css("position", "absolute"),
      $elRelative = _this.$el.clone().css("position", "relative");

  _this.$fixture
    .append( $elStatic )
    .append( $elAbsolute )
    .append( $elRelative );

  $elStatic.imageChanger({
    backgroundImage: true,
    afterInit: function(status){
      assert.strictEqual( this.$elem.css("position"), "relative", "static is converted to relative" );
      done1();
    }
  });

  $elAbsolute.imageChanger({
    backgroundImage: true,
    afterInit: function(){
      assert.strictEqual( this.$elem.css("position"), "absolute", "absolute does not change" );
      done2();
    }
  });

  $elRelative.imageChanger({
    backgroundImage: true,
    afterInit: function(){
      assert.strictEqual( this.$elem.css("position"), "relative", "relative does not change" );
      done3();
    }
  });
});




QUnit.module("data API - onImage()", {
  beforeEach: commonBeforeEach
});

QUnit.test("to be switched to the active image", function(assert){
  var _this = this,
      done = assert.async();

  _this.$el
    .on("ic.afterInit", function(e, ic){
      ic.onImage();
    })
    .on("ic.afterOnImage", function(e, ic){
      assert.ok(true, "after onImage event");
      done();
    })
    .imageChanger();
});




QUnit.module("data API - offImage()", {
  beforeEach: commonBeforeEach
});

QUnit.test("to be switched to the default image", function(assert){
  var _this = this,
      done = assert.async();

  _this.$el.find("img").attr("src", "images/btn_on.png");

  _this.$el
    .on("ic.afterInit", function(e, ic){
      ic.offImage();
    })
    .on("ic.afterOffImage", function(e, ic){
      assert.ok(true, "after offImage event");
      done();
    })
    .imageChanger();
});




QUnit.module("data API - toggle()", {
  beforeEach: commonBeforeEach
});

QUnit.test("should switching a image", function(assert){
  var _this = this,
      done = assert.async();

  _this.$el
    .on("ic.afterInit", function(e, ic){
      ic.toggle();
    })
    .on("ic.afterOnImage", function(e, ic){
      assert.ok(true, "after onImage event");
      ic.toggle();
    })
    .on("ic.afterOffImage", function(e, ic){
      assert.ok(true, "after offImage event");
      done();
    })
    .imageChanger();
});




QUnit.module("data API - disable() / enable()", {
  beforeEach: commonBeforeEach
});

QUnit.test("should enable and disable switches", function(assert){
  var _this = this,
      done = assert.async();

  _this.$el
    .on("ic.afterInit", function(e, ic){
      assert.strictEqual( ic.isChangeEnable(), true );
      ic.disable();
      assert.strictEqual( ic.isChangeEnable(), false );
      ic.enable();
      assert.strictEqual( ic.isChangeEnable(), true );

      done();
    })
    .imageChanger();
});




QUnit.module("data API - destroy()", {
  beforeEach: commonBeforeEach
});

QUnit.test("to be returned to the original state", function(assert){
  var ic = this.$el.imageChanger().data("imageChanger");

  ic.destroy();
  
  assert.strictEqual( this.$el.attr("style"), undefined );
  assert.strictEqual( $("img", this.$el).size(), 1 );
  assert.strictEqual( $("> span.ic-image", this.$el).size(), 0 );
  assert.strictEqual( $("> span.ic-image > img.ic-off", this.$el).size(), 0 );
  assert.strictEqual( $("> span.ic-image > img.ic-on", this.$el).size(), 0 );
});
