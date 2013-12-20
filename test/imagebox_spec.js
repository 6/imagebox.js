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
  });
});
