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

    $ul.height() == 0 ? Toggler.openDroppable($ul) : Toggler.closeDroppable($ul);
  }
};

Toggler.openDroppable = function(droppable) {
  droppable.stop().dequeue().animate({
    'height': droppable[0].scrollHeight
  },500, function() {
    droppable.height('');
  });
};

Toggler.closeDroppable = function(droppable) {
  droppable.stop().dequeue().animate({
    height:0
  });
};


