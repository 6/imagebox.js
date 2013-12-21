window.context = function() {
  window.describe.apply(this, arguments);
};

window.ccontext = function () {
  window.ddescribe.apply(this, arguments);
};

// Override rAF to execute callback immediately for tests
window.requestAnimationFrame = function(callback) {
  callback();
};
