/**
 * Treedrag.
 */

var Treedrag = function () {
  this.init.apply(this, arguments);
};

Treedrag.prototype = {
  constructor: Treedrag.prototype.constructor,
  options: {
    limitToParent:false
  },

  zoneId: 0,

  init: function (element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.zones = this.$element.find('.treedrag-zone');

    this.install();
    this.addEvents();
  },

  install: function () {
    var _this = this;
    this.zones.each(function () {
      $(this).attr('data-zone-id', this.zoneId++);
      new PropertiesSetter(this, {
        zoneId: this.zoneId,
        limitToParent:_this.options.limitToParent
      });

      new DragDrop(this,{
        limitToParent:_this.options.limitToParent
      });
    });
  },

  addEvents: function () {

  }
};

/**
 * jquery plugin declaration
 */
$.fn.treedrag = function () {
  $(this).each(function (options) {
    $(this).data('treedrag', new Treedrag(this, options));
  });
  return this;
};

