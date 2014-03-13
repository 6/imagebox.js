describe("ImageBox", function() {
  afterEach(function() {
    // Clear DOM fixture between tests
    $(".container").remove();
  });

  it("exposes itself globally", function() {
    expect(typeof window.ImageBox).toEqual("function");
  });

  context("without a valid container element", function() {
    it("throws an error upon initialization", function() {
      expect(function() { new ImageBox(".container"); }).toThrow("No container element specified.");
    });
  });

  context("without a valid img element", function() {
    beforeEach(function() {
      $("body").append($("<div/>", {class: "container"}));
    });

    it("throws an error upon initialization", function() {
      expect(function() { new ImageBox(".container"); }).toThrow("No <img> found inside container element.");
    });
  });

  context("without img dimensions specified", function() {
    beforeEach(function() {
      var $container = $("<div/>", {class: "container"});
      $container.append($("<img/>"));
      $("body").append($container);
    });

    it("throws an error upon initialization", function() {
      expect(function() { new ImageBox(".container"); }).toThrow("Must specify image width and height.");
    });
  });

  context("with valid container and img elements", function() {
    var $container, $image;

    beforeEach(function() {
      $container = $("<div/>", {class: "container"});
      $image = $("<img/>", {"data-width": "700", "data-height": "400"});
      $container.append($image);
      $("body").append($container);
    });

    var sharedExamplesValidDom = function(createSubject) {
      it("does not throw any errors upon initialization", function() {
        expect(createSubject).not.toThrow();
      });

      it("sets properties correctly", function() {
        var subject = createSubject();
        expect(subject.container).toEqual($container[0]);
        expect(subject.image).toEqual($image[0]);
        expect(subject.imageWidth).toEqual(700);
        expect(subject.imageHeight).toEqual(400);
        expect(subject.scalingType).toEqual("fit");
      });

      it("adds the .imagebox-container class to container", function() {
        expect($container).not.toHaveClass("imagebox-container");

        createSubject();
        expect($container).toHaveClass("imagebox-container");
      });
    };

    context("when initialized with a selector string", function() {
      sharedExamplesValidDom(function() {
        return new ImageBox(".container");
      });
    });

    context("when initialized with a DOM element", function() {
      sharedExamplesValidDom(function() {
        return new ImageBox($container[0]);
      });
    });

    context("on window resize", function() {
      var subject, fitSpy, horizontalOverflowFillSpy;

      beforeEach(function() {
        subject = new ImageBox(".container");
        fitSpy = sinon.spy(subject, 'fit');
        horizontalOverflowFillSpy = sinon.spy(subject, 'horizontalOverflowFill');
      });

      afterEach(function() {
        fitSpy.restore();
        horizontalOverflowFillSpy.restore();
      });

      it("calls the appropriate scaling method", function() {
        expect(fitSpy.called).toBe(false);
        expect(horizontalOverflowFillSpy.called).toBe(false);

        subject.resize();
        expect(fitSpy.calledOnce).toBe(true);
        expect(horizontalOverflowFillSpy.called).toBe(false);

        subject.setScalingType('horizontalOverflowFill');

        expect(fitSpy.calledOnce).toBe(true);
        expect(horizontalOverflowFillSpy.calledOnce).toBe(true);
      });
    });

    describe("#fit", function() {
      it("resizes the image to be fully visible within the container", function() {
        var subject = new ImageBox(".container");

        $container.css({width: 1000, height: 50});
        subject.resize();
        expect($image.width() <= 1000).toBe(true);
        expect($image.height()).toEqual(50);
        expect($image.css("padding-top")).toEqual("0px");

        $container.css({width: 50, height: 1000});
        subject.resize();
        expect($image.height() <= 1000).toBe(true);
        expect($image.width()).toEqual(50);
        expect(parseInt($image.css("padding-top")) > 0).toBe(true);
      });
    });

    describe("#fill", function() {
      it("resizes the image to always be >= container size", function() {
        var subject = new ImageBox(".container", {scalingType: "fill"});

        $container.css({width: 1000, height: 50});
        subject.resize();
        expect($image.width() >= 1000).toBe(true);
        expect($image.height() >= 50).toBe(true);

        $container.css({width: 50, height: 1000});
        subject.resize();
        expect($image.width() >= 50).toBe(true);
        expect($image.height() >= 1000).toBe(true);
      });
    });

    describe("#horizontalOverflowFill", function() {
      it("resizes the image to fill the container horizontally", function() {
        var subject = new ImageBox(".container", {scalingType: "horizontalOverflowFill"});

        $container.css({width: 2000, height: 300});
        subject.resize();
        expect($image.width()).toEqual(2000);
        expect($image.css("padding-top")).toEqual("0px");

        $container.css({width: 100, height: 500});
        subject.resize();
        expect($image.width()).toEqual(100);
        expect(parseInt($image.css("padding-top")) > 0).toBe(true);
      });
    });

    describe("#stretch", function() {
      it("resizes the image to fill the container horizontally and vertically", function() {
        var subject = new ImageBox(".container", {scalingType: "stretch"});

        $container.css({width: 2000, height: 300});
        subject.resize();
        expect($image.width()).toEqual(2000);
        expect($image.height()).toEqual(300);
        expect($image.css("padding-top")).toEqual("0px");

        $container.css({width: 100, height: 500});
        subject.resize();
        expect($image.width()).toEqual(100);
        expect($image.height()).toEqual(500);
        expect($image.css("padding-top")).toEqual("0px");
      });
    });
  });
});
