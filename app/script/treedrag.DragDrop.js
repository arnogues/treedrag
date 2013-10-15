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

    this.emptydroppables = this.$element.find('.empty-droppable');

    this.addEvents();
  },

  addEvents: function () {
    var _this = this;
    var elms = this.$element.find('li');

    elms.drag('init', $.proxy(this.onDragInit, this));
    elms.drag('start', $.proxy(this.onDragStart, this));
    elms.drag($.proxy(this.onDrag, this));
    elms.drag('end', $.proxy(this.onDragEnd, this));

    elms.drop('init', $.proxy(this.onDropInit, this));
    /*elms.drop('start', $.proxy(this.onDropStart, this));
    elms.drop($.proxy(this.onDrop, this));
    elms.drop('end', $.proxy(this.onDropEnd, this));*/

    $.drop({
      tolerance: function (event, proxy, target) {
        var test = event.pageY > ( target.top + target.height / 2 );
        $.data(target.elem, "drop+reorder", test ? "insertAfter" : "insertBefore");
        return this.contains(target, [ event.pageX, event.pageY ]);
      }
    });
  },

  // =============
  // DRAG methods
  // ==============
  onDragInit: function (ev, dd) {
    var currentLevel = this.currentLevel = $(dd.target).data('level');
    this.emptydroppables.filter(function() {
      return $(this).data('level')==currentLevel;
    }).show();
  },

  onDragStart:function(ev, dd) {
    var $elm = $(dd.drag);
    this.createPhantom($elm);
    this.setElemPos($elm, dd);
    $elm.css('width', $elm.width());
    $elm.addClass('treedrag-isdragging');
    this.$element.append($elm);
  },

  onDrag: function (ev, dd) {
    this.setElemPos($(dd.drag), dd);

    var drop = dd.drop[0],
        method = $.data( drop || {}, "drop+reorder" );
    if ( drop && ( drop != dd.current || method != dd.method ) ){
      if(this.phantom) this.phantom[ method ]( drop );
      dd.current = drop;
      dd.method = method;
      dd.update();
    }

   // console.dir(dd);

  },

  onDragEnd:function(ev, dd) {
    this.phantom.replaceWith(dd.target);
    $(dd.target).removeClass('treedrag-isdragging');
  },

  // =============
  // DROP methods
  // ==============
  onDropInit: function (ev, dd) {
    return  !( dd.target == dd.drag) ;
  },
  onDropStart: function (ev, dd) {
    console.log("dropstart");
  },
  onDrop: function (ev, dd) {
    console.log("drop");
  },
  onDropEnd: function (ev, dd) {
    console.log("dropend");
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
};

