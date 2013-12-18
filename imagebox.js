;(function() {
  function applyEach (collection, callbackEach) {
    for (var i = 0; i < collection.length; i++) {
      callbackEach(collection[i]);
    }
  }

  // http://stackoverflow.com/a/384380/223408
  function isNode(o){
    return (
      typeof Node === "object" ? o instanceof Node :
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
    );
  }

  function hasClass(el, className) {
    return el.className.match(new RegExp('(^| )' + className + '( |$)'));
  }

  function ImageBox(el, options) {
    var self = this;
    options = options || {};

    if (el !== undefined) {
      // selector
      if (typeof el === 'string') {
        options.selector = el;
        el = undefined;
      }
      // config object
      else if (!isNode(el)) {
        options = el;
        el = undefined;
      }
    }

    var selector = options.selector || '.imagebox-container';
    var elements = el || document.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error("No elements found with selector: "+selector);
    }
    else if (elements.length > 1) {
      applyEach(elements, function(element) {
        new ImageBox(element, options);
      });
      return;
    }

    this.container = elements[0];
    this.src = options.imageSrc || this.container.getAttribute('data-image-src');
    this.imageWidth = options.imageWidth || this.container.getAttribute('data-image-width');
    this.imageHeight = options.imageHeight || this.container.getAttribute('data-image-height');
    if (typeof this.src === "undefined" || typeof this.imageWidth === "undefined" || typeof this.imageHeight === "undefined") {
      throw new Error("Must specify image src, width, and height");
    }

    if(!hasClass(this.container, "imagebox-container")) {
      this.container.className += " imagebox-container";
    }

    this.image = document.createElement('img');
    this.image.src = this.src;
    this.image.className = options.className || 'imagebox-image';
    this.image.alt = options.alt || this.container.getAttribute('data-alt') || '';

    this.container.appendChild(this.image);

    window.addEventListener('resize', function(){
      self.onWindowResize();
    }, false);

    this.onWindowResize();
  }

  ImageBox.prototype.onWindowResize = function() {
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
