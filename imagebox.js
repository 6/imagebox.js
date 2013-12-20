;(function() {
  function isNullOrUndefined(o) {
    return typeof o === 'undefined' || o === null;
  }

  function hasClass(el, className) {
    return el.className.match(new RegExp('(^| )' + className + '( |$)'));
  }

  var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  function ImageBox(el, options) {
    var self = this;
    options = options || {};

    if (typeof el === "string") {
      el = document.querySelector(el);
    }

    this.container = el;
    if (isNullOrUndefined(this.container)) {
      throw new Error("No container element specified.");
    }

    this.image = el.querySelector("img");
    if (isNullOrUndefined(this.image)) {
      throw new Error("No <img> found inside container element.");
    }

    this.imageWidth = options.imageWidth || parseInt(this.image.getAttribute('data-width'));
    this.imageHeight = options.imageHeight || parseInt(this.image.getAttribute('data-height'));
    if (isNaN(this.imageWidth) || isNaN(this.imageHeight)) {
      throw new Error("Must specify image width and height.");
    }

    this.scalingType = options.defaultScaling || "fit";

    if(!hasClass(this.container, "imagebox-container")) {
      this.container.className += " imagebox-container";
    }

    window.addEventListener('resize', function(){
      self.resize();
    }, false);

    this.resize();
  }

  ImageBox.prototype.setScalingType = function(scalingType) {
    this.scalingType = scalingType;
    this.resize();
  };

  ImageBox.prototype.resize = function() {
    var self = this;
    raf(function() {
      self[self.scalingType]();
    });
  };

  ImageBox.prototype.horizontalFill = function() {
    // Reset styles that may be set from other resize
    this.image.style.height = "";

    this.image.style.width = this.container.clientWidth + "px";
    this.verticallyCenter();
  };

  ImageBox.prototype.fit = function() {
    var newPaddingTop = 0,
        newWidth = this.imageWidth,
        newHeight = this.imageHeight,
        containerWidth = this.container.clientWidth,
        containerHeight = this.container.clientHeight,
        imageAspectRatio = this.imageWidth / this.imageHeight;
    var containerAspectRatio = containerWidth / containerHeight;

    if (imageAspectRatio >= containerAspectRatio) {
      if (this.imageWidth >= containerWidth) {
        newWidth = containerWidth;
        newHeight = this.imageHeight * (containerWidth / this.imageWidth);
      }
    }
    else {
      if (this.imageHeight >= containerHeight) {
        newWidth = this.imageWidth * (containerHeight / this.imageHeight);
        newHeight = containerHeight;
      }
    }

    if (newHeight < containerHeight) {
      newPaddingTop = (containerHeight - newHeight) / 2;
    }

    this.image.style.width = newWidth + "px";
    this.image.style.height = newHeight + "px";
    this.verticallyCenter();
  };

  ImageBox.prototype.verticallyCenter = function() {
    var newPaddingTop = 0,
        resizedImageHeight = this.image.height,
        containerHeight = this.container.clientHeight;
    if(resizedImageHeight < containerHeight) {
      newPaddingTop = (containerHeight - resizedImageHeight) / 2;
    }
    this.image.style.paddingTop = newPaddingTop + "px";
  };

  if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS
    module.exports = exports = ImageBox;
  }
  else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () { return ImageBox; });
  }
  else {
    window.ImageBox = ImageBox;
  }
})();
