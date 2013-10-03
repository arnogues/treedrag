/**
 * Toggler.
 *
 * Find all level element who have the togglable class
 */

var Toggler = function () {
  this.init.apply(this, arguments);
};

Toggler.prototype = {
  constructor: Toggler.prototype.constructor,
  options: {
    limitToParent: true
  },

  zoneId: 0,

  init: function (element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, this.options, options);

    this.addEvents();
  },

  addEvents: function () {
    this.$element.on('click', 'ul .treedrag-toggle', $.proxy(this.onTogglerClick, this));
  },

  onTogglerClick: function (e) {
    var el = e.currentTarget,
        $ul = $(el).parent().find('ul:first');

      $ul.stop().dequeue().animate({
        'height': $ul.height() == 0 ? $ul[0].scrollHeight : 0
      }, 500);
  }
};


