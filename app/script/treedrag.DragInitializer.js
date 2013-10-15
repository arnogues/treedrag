/**
 * Apply data-draggable and data-droppable atrributes on a ul>li list ul are droppables, li are draggables
 * This class is a simple initializer and generator of attributes and element for drag and drop
 * It needs a ul>li (and multilevel ul>li>ul>li) to work properly
 * It helps a lot for simplifying the drag and drop after
 */
  var zoneId = 0;

DragInitializer = function () {
  this.init.apply(this, arguments);
  };

DragInitializer.prototype = {
  constructor: DragInitializer.prototype.constructor,
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
    },

    applyProperties: function (ul, level, id) {
      var _this = this;
      var $ul = $(ul);
      if (!$ul.data('id')) {
        $ul.attr('data-id', 'droppable_' + (id || '0'));
      }
      var newLevel = this.options.limitToParent ? $ul.data('id') + '_' + level : level;

      //  .addClass('treedrag-droppable');
      $ul.children().each(function () {
        $(this)
            .attr({
              'data-draggable': true,
              'data-level':level,
              'data-draggable-type': newLevel
            })
            .addClass('treedrag-draggable');

        var firstUl = $(this).find('ul:first');
        var id = $(this).attr('data-id');
        if (firstUl.length) {
          _this.applyProperties(firstUl, level+1, id);
        }
      });

      if (!$ul.data('treedrag-empty-droppable')) {
        var $li = $('<li class="empty-droppable"></li>');
        $ul.data('treedrag-empty-droppable', $li);
        $ul.append($li);
        $li.attr({
          'data-droppable': true,
          'data-droppable-accept': newLevel,
          'data-level': level
        });
      }

      // set toggle classes for Toggler object
      $ul.find('h2').addClass('treedrag-toggle');
    }
  };
