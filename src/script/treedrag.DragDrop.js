/**
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
      _this.startDrag(e, this);
    });

    $(document)
        .on('mouseup', function (e) {
          _this.stopDrap(e);
        })
        .on('mousemove', function (e) {
          _this.move(e);
        });

    this.$element.on('mouseenter', '.treedrag-droppable', function (e) {
      _this.onDroppableEnter(e, this);
    });
  },

  onDroppableEnter: function (e,droppable) {
    this.currentDroppable = $(droppable);
    if (this.isDragging) {
      this.saveSameLevelElementsPositions();
    }
  },

  startDrag: function (e, elm) {
    e.preventDefault();
    e.stopPropagation();
    var $elm = $(elm);
    //init dragging and save main infos
    this.isDragging = true;
    this.currentDraggedElement = $elm;
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
  },

  stopDrap: function (e) {
    e.preventDefault();
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
      this.draggableElementsToCheck = [];
      this.droppablesList.removeClass('treedrag-droppable-isaccepting');
    }
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
    var selector = '.treedrag-draggable[data-draggable-type=' + this.currentDraggedElement.data('draggable-type') + ']';
    listElm = this.currentDroppable.find(selector).not('.treedrag-phantom').not(this.currentDraggedElement);
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
      if(this.draggableElementsToCheck.length>0) {
        this.draggedElementPhantom.insertBefore(this.draggableElementsToCheck[0].elm);
      } else {
        this.currentDroppable.append(this.draggedElementPhantom);
      }
    }
  },


  /* =========================
   * Droppable methods
   ========================= */
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
    this.droppablesList = this.$element.find('.treedrag-droppable[data-droppable-accept=' + this.currentDraggedElement.data('draggable-type') + ']');
    this.droppablesList.addClass('treedrag-droppable-isaccepting')
  }
};

