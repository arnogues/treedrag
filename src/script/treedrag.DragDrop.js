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
        })
  },


  startDrag: function (e, elm) {
    e.preventDefault();
    e.stopPropagation();
    var $elm = $(elm);
    this.isDragging = true;
    this.currentDraggedElement = $elm;
    this.startMouseOffset = {
      left: e.pageX - $elm.position().left,
      top: e.pageY - $elm.position().top
    };
    this.saveSameLevelElementsPositons();
    var phantom = this.draggedElementPhantom = $elm.clone();
    phantom.addClass('treedrag-phantom');
    $elm.after(phantom);
    $elm.addClass('treedrag-isdragging');
    $elm.css('width', phantom.width());
    this.$element.append($elm);
    this.move(e);
  },

  stopDrap: function (e) {
    e.preventDefault();
    if (this.isDragging) {
      this.isDragging = false;
      this.currentDraggedElement
          .css({
            'left': '',
            'top': ''
          })
          .removeClass('treedrag-isdragging');
      this.draggedElementPhantom.replaceWith(this.currentDraggedElement);
      this.draggableElementsToCheck = [];
    }
  },

  move: function (e) {
    if (this.isDragging) {
      var mOffset = this.startMouseOffset;

      var props = {
        'left': e.pageX - mOffset.left,
        'top': e.pageY - mOffset.top
      };
      this.currentDraggedElement.css(props);

      this.checkDraggedPosition(props);
    }
  },

  saveSameLevelElementsPositons: function () {
    var _this = this;
    var listElm = this.$element.find('.treedrag-draggable[data-draggable-type=' + this.currentDraggedElement.data('draggable-type') + ']');
    this.draggableElementsToCheck = listElm.filter(function () {
      return this != _this.currentDraggedElement[0];
    })
        .map(function () {
          var $elm = $(this);
          return {
            left: $elm.position().left,
            top: $elm.position().top,
            height: $elm[0].offsetHeight,
            width: $elm[0].offsetWidth,
            elm:$elm
          }
        });
    console.log(this.draggableElementsToCheck);
  },

  checkDraggedPosition: function (props) {
    var checkedElm, left, top, keepElm;
    for (var i = 0; i < this.draggableElementsToCheck.length; i++) {
      checkedElm = this.draggableElementsToCheck[i];
      left = props.left;
      top = props.top;
      if (
          top >= checkedElm.top && top <= checkedElm.top + checkedElm.height
          ) {

        keepElm = checkedElm;
        break;
      }

    }
    if(keepElm)
      this.draggedElementPhantom.insertAfter(keepElm.elm);
  }
};

