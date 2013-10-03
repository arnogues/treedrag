;(function($) {/**
 * DragDrop
 *
 * This class plays with the elements setted previously by the PropertiesSetter class
 * It uses draggable and droppable properties
 */

var DragDrop = function () {
  this.init.apply(this, arguments);
};

DragDrop.prototype = {
  constructor: DragDrop.prototype.constructor,
  options: {
    limitToParent: true
  },

  init: function (element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, this.options, options);

    this.addEvents();
  },

  addEvents: function () {
    var _this = this;
    this.$element.on('mousedown', '.treedrag-draggable', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.isWaitingDrag = true;
      _this.currentDraggedElement = $(this);
    });

    $(document)
        .on('mouseup', function (e) {
          _this.stopDrap(e);
        })
        .on('mousemove', function (e) {
          _this.startDrag(e, this);
          _this.move(e);
        });

    this.$element.on('mouseenter', '.treedrag-droppable', function (e) {
      _this.onDroppableEnter(e, this);
    });
  },

  onDroppableEnter: function (e, droppable) {
    this.currentDroppable = $(droppable);
    if (this.isDragging) {
      this.saveSameLevelElementsPositions();
    }
  },

  startDrag: function (e, elm) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isWaitingDrag) {
      this.isWaitingDrag = false;
      var $elm = this.currentDraggedElement;
      //init dragging and save main infos
      this.isDragging = true;
      //this.currentDraggedElement = $elm;
      this.startMouseOffset = {
        left: e.pageX - $elm.position().left,
        top: e.pageY - $elm.position().top
      };
      //create phantom
      var phantom = this.draggedElementPhantom = $elm.clone();
      phantom.addClass('treedrag-phantom');
      $elm.after(phantom);

      //set props and move the $elm to the parent this.$element to avoid problems of z-index with ie7
      $elm.addClass('treedrag-isdragging');
      $elm.css('width', phantom.width());
      this.$element.append($elm);

      this.saveAllDroppablePositions();
      this.saveSameLevelElementsPositions();
      this.move(e);
    }

  },

  stopDrap: function (e) {
    //setTimeout($.proxy(function() {
    e.preventDefault();
    this.isWaitingDrag = false;
    if (this.isDragging) {
      this.isDragging = false;
      //reset styles and put the element at it's previous place
      this.currentDraggedElement
          .css({
            'left': '',
            'top': '',
            'width': ''
          })
          .removeClass('treedrag-isdragging');
      this.draggedElementPhantom.replaceWith(this.currentDraggedElement);
      this.$element.find('.treedrag-phantom').remove();
      this.draggableElementsToCheck = [];
      this.droppablesList.removeClass('treedrag-droppable-isaccepting');
    }
    //},this),10);
  },

  move: function (e) {
    if (this.isDragging) {
      var mOffset = this.startMouseOffset;
      var props = {
        'left': e.pageX - mOffset.left,
        'top': e.pageY - mOffset.top
      };
      this.currentDraggedElementProps = props;
      this.currentDraggedElement.css(props);
      var currentProps = this.currentDraggedElement.position();
      this.getCurrentDroppableWhileDragging(currentProps);
      this.checkDraggedPosition(currentProps);
    }
  },

  saveSameLevelElementsPositions: function () {
    var _this = this, listElm;
    //var selector = '.treedrag-draggable[data-draggable-type=' + this.currentDraggedElement.data('draggable-type') + ']';
    listElm = this.currentDroppable
        .find('.treedrag-draggable')
        .not('.treedrag-phantom').not(this.currentDraggedElement)
        .filter(function () {
          return $(this).data('draggable-type') == _this.currentDraggedElement.data('draggable-type');
        });
    this.draggableElementsToCheck = listElm
        .map(function () {
          var $elm = $(this);
          return {
            //top: $elm.position().top,
            childrenNum: $elm.parent().children.length,
            elm: $elm
          }
        });
  },

  /* =========================
   * Draggable methods
   ========================= */
  checkDraggedPosition: function (props) {
    var checkedElm, left, top, keepElm;
    top = props.top;
    if (this.draggableElementsToCheck.length) {
      for (var i = 0; i < this.draggableElementsToCheck.length; i++) {
        checkedElm = this.draggableElementsToCheck[i];
        var checkedTop = checkedElm.elm.position().top;
        if (top >= checkedTop) {
          keepElm = checkedElm;
        }
      }
    }

    if (keepElm) {
      this.draggedElementPhantom.insertAfter(keepElm.elm);
    } else {
      if (this.draggableElementsToCheck.length > 0) {
        this.draggedElementPhantom.insertBefore(this.draggableElementsToCheck[0].elm);
      } else {
        if (!this.options.limitToParent || this.options.limitToParent && this.currentDroppable.data('droppable-accept') == this.draggedElementPhantom.data('draggable-type')) {
          this.currentDroppable.append(this.draggedElementPhantom);
        }
      }
    }
  },


  /* =========================
   * Droppable methods
   ========================= */
  checkDroppableAccept: function () {

  },

  getCurrentDroppableWhileDragging: function (props) {
    var droppable, keepElm, droppablePosition, top = props.top, left = props.left;
    if (this.isDragging) {
      var list = this.droppablesList;
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          droppable = $(list[i]);
          droppablePosition = droppable.position();
          if (top >= droppablePosition.top && left >= droppablePosition.left) {
            keepElm = droppable;
          }
        }
      }
      if (keepElm && this.currentDroppable != keepElm) {
        this.currentDroppable = keepElm;
        this.saveSameLevelElementsPositions();
      }
    }

  },

  saveAllDroppablePositions: function () {
    var _this = this;
    this.droppablesList = this.$element.find('.treedrag-droppable').filter(function () {
      return $(this).data('droppable-accept') == _this.currentDraggedElement.data('draggable-type')
    });
    this.droppablesList.addClass('treedrag-droppable-isaccepting')
  }
};


/**
 * Apply data-draggable and data-droppable atrributes on a ul>li list ul are droppables, li are draggables
 * @constructor
 */
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



/**
 * Treedrag.
 */

var Treedrag = function () {
  this.init.apply(this, arguments);
};

Treedrag.prototype = {
  constructor: Treedrag.prototype.constructor,
  options: {
    limitToParent:true
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


    });
    new DragDrop(this.$element,{
      limitToParent:_this.options.limitToParent
    });

    new Toggler(this.$element);
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
};})(jQuery);