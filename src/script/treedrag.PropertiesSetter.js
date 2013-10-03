/**
 * Apply data-draggable and data-droppable atrributes on a ul>li list ul are droppables, li are draggables
 * @constructor
 */
(function () {
  var zoneId = 0;

  PropertiesSetter = function () {
    this.init.apply(this, arguments);
  };

  PropertiesSetter.prototype = {
    constructor: PropertiesSetter.prototype.constructor,
    options: {
      /**
       * Limit the draggable objet to be dropped only into the same parent in another zone
       * @type Boolean
       */
      limitToParent: true
    },

    init: function (element, options) {
      this.$element = $(element);
      this.options = $.extend(true, {}, this.options, options);
      this.applyProperties(this.$element.find('ul:first'), 1);
      this.zoneId = zoneId++;

      this.addEvents();
    },

    addEvents: function () {

    },

    applyProperties: function (ul, level, id) {
      var _this = this;
      if (!$(ul).data('id')) {
        $(ul).attr('data-id', 'droppable_' + (id || '0'));
      }
      var newLevel = this.options.limitToParent ? $(ul).data('id') + '_' + level : level;
      $(ul)
          .attr({
            'data-droppable': true,
            'data-droppable-accept': newLevel
          })
          .addClass('treedrag-droppable');
      $(ul).children().each(function () {
        $(this)
            .attr({
              'data-draggable': true,
              'data-draggable-type': newLevel
            })
            .addClass('treedrag-draggable');

        var firstUl = $(this).find('ul:first');
        var id = $(this).attr('data-id');
        if (firstUl.length) {
          _this.applyProperties(firstUl, level+1, id);
        }
      });

      // set toggle classes for Toggler object
      $(ul).find('h2').addClass('treedrag-toggle');
    }
  };
})();