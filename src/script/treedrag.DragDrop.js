/**
 * Treedrag.
 */

var DragDrop = function () {
  this.init.apply(this, arguments);
};

DragDrop.prototype = {
  constructor: DragDrop.prototype.constructor,
  options: {

  },

  init: function (element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, this.options, options);

    this.addEvents();
  },

  addEvents: function () {

  }
};

