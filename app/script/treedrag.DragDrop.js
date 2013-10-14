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
    var elms = this.$element.find('.treedrag-draggable');

    elms.drag($.proxy(this.onDrag, this));
    elms.drag('init', $.proxy(this.onDragStart, this));
    elms.drag('end', $.proxy(this.onDragStart, this));

    /*this.$element.on('drag', '.treedrag-draggable', $.proxy(this.onDrag, this));
    this.$element.on('dragstart', '.treedrag-draggable', $.proxy(this.onDragStart, this));
    this.$element.on('dragend', '.treedrag-draggable', $.proxy(this.onDragEnd, this));*/
  },

  onDragStart:function(ev, dd) {
    console.log('ondragstart');
    var $elm = $(dd.drag);
    this.createPhantom($elm);
    this.setElemPos($elm, dd);
    $elm.addClass('treedrag-isdragging');
    $elm.css('width', this.phantom.width());
    this.$element.append($elm);
  },

  onDrag: function (ev, dd) {
    this.setElemPos($(dd.drag), dd);
  },

  onDragEnd:function(ev, dd) {

  },

  onDrop: function (ev, dd) {

  },

  createPhantom:function(element) {
    var $elm = $(element);
    var phantom = this.phantom = $elm.clone();
    phantom.addClass('treedrag-phantom');
    $elm.after(phantom);
  },

  setElemPos : function(elm,dd) {
    elm.css({
      top: dd.offsetY,
      left: dd.offsetX
    })
  }

  /*addEvents: function () {
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
   */
  /* onDroppableEnter: function (e, droppable) {
   this.currentDroppable = $(droppable);
   if (this.isDragging) {
   this.saveSameLevelElementsPositions();
    }
   }*/

  /* startDrag: function (e, elm) {
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

   *//* =========================
   * Draggable methods
   ========================= *//*
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


   *//* =========================
   * Droppable methods
   ========================= *//*
   checkDroppableParents: function () {

   },

   getCurrentDroppableWhileDragging: function (props) {
    var droppable, keepElm, droppablePosition, top = props.top, left = props.left;
    var offset = this.currentDraggedElement[0].offsetWidth / 2;
    if (this.isDragging) {
      var list = this.droppablesList;
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          droppable = $(list[i]);
          droppablePosition = droppable.position();
          if (top >= droppablePosition.top && left >= droppablePosition.left - offset) {
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
    //this.droppablesList = this.$element.find('.treedrag-droppable');
   *//*var level = _this.currentDraggedElement.data('level');
   this.droppablesList = this.$element.find('.treedrag-droppable').filter(function () {
   return $(this).data('level') <= level
   });*//*
   //console.log(this.droppablesList);
   this.droppablesList.addClass('treedrag-droppable-isaccepting')
   }*/
};

