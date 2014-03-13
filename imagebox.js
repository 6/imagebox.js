;(function() {
  function isNullOrUndefined(o) {
    return typeof o === 'undefined' || o === null;
  }

  function hasClass(el, className) {
    return el.className.match(new RegExp('(^| )' + className + '( |$)'));
  }

  function isValidImageDimension(num) {
    return !isNullOrUndefined(num) && !isNaN(num) && num > 0;
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

    this.imageWidth = options.imageWidth || parseInt(this.image.getAttribute('data-width') || this.image.width);
    this.imageHeight = options.imageHeight || parseInt(this.image.getAttribute('data-height') || this.image.height);
    if (!isValidImageDimension(this.imageWidth) || !isValidImageDimension(this.imageHeight)) {
      throw new Error("Must specify image width and height.");
    }

    this.scalingType = options.scalingType || "fit";

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
      self.resetImageStyles();
      self[self.scalingType]();
    });
  };

  ImageBox.prototype.stretch = function() {
    this.image.style.width = this.container.offsetWidth + "px";
    this.image.style.height = this.container.offsetHeight + "px";
  };

  ImageBox.prototype.horizontalOverflowFill = function() {
    this.image.style.width = this.container.offsetWidth + "px";
    var resizedImageHeight = (this.container.offsetWidth / this.imageWidth) * this.imageHeight;
    this.verticallyCenter(resizedImageHeight);
  };

  ImageBox.prototype.fit = function() {
    var newPaddingTop = 0,
        newWidth = this.imageWidth,
        newHeight = this.imageHeight,
        containerWidth = this.container.offsetWidth,
        containerHeight = this.container.offsetHeight,
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
    this.verticallyCenter(newHeight);
  };

  ImageBox.prototype.verticallyCenter = function(resizedImageHeight) {
    var newPaddingTop = 0,
        containerHeight = this.container.offsetHeight;
    if(resizedImageHeight < containerHeight) {
      newPaddingTop = (containerHeight - resizedImageHeight) / 2;
    }
    this.image.style.paddingTop = newPaddingTop + "px";
  };

  ImageBox.prototype.resetImageStyles = function() {
    // Reset styles that may be set from other resize
    this.image.style.height = "";
    this.image.style.width = "";
    this.image.style.paddingTop = "";
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
