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
		limitToParent: true,
		onAfterDrop: function(){},
		onInit: function(){}
	},

	init: function (element, options) {
		this.$element = $(element);
		this.options = $.extend(true, {}, this.options, options);

		this.items = this.$element.find('li');
		this.emptyDroppables = this.items.filter('.empty-droppable');

		this.addEvents();
		console.log('test', this.options.onInit)

//		(this.options.onInit && typeof this.options.onInit == 'function') && ($.proxy(this.options.onInit, this));
	},

	addEvents: function () {
		var _this = this;

		this.items.drag('init', $.proxy(this.onDragInit, this));
		this.items.drag('start', $.proxy(this.onDragStart, this));
		this.items.drag($.proxy(this.onDrag, this));
		this.items.drag('end', $.proxy(this.onDragEnd, this));

		this.items.drop('init', $.proxy(this.onDropInit, this));
		this.items.drop('start', $.proxy(this.onDropStart, this));
		this.items.drop($.proxy(this.onDrop, this));
		this.items.drop('end', $.proxy(this.onDropEnd, this));

		/*$.drop({
		 tolerance: function (event, proxy, target) {
		 var test = event.pageY > ( target.top + target.height / 2 );
		 $.data(target.elem, "drop+reorder", test ? "insertAfter" : "insertBefore");
		 return this.contains(target, [ event.pageX, event.pageY ]);
		 }
		 });*/
	},

	// =============
	// DRAG methods
	// ==============
	onDragInit: function (ev, dd) {
    var currentLevel = this.currentLevel = $(dd.drag).data('level');
    this.emptyTarget = this.emptyDroppables.filter(function () {
      return $(this).data('level') == currentLevel;
    });
	},

	onDragStart: function (ev, dd) {
    if(this.emptyTarget)
      this.emptyTarget.addClass('active');
//		console.log('onDragStart')
		var $elm = $(dd.drag);
		this.createPhantom($elm);
		this.setElemPos($elm, dd);
		$elm.css('width', $elm.width());
		$elm.addClass('treedrag-isdragging');
		this.$element.append($elm);
	},

	onDrag: function (ev, dd) {
//		console.log('onDrag')
		this.setElemPos($(dd.drag), dd);

		var drop = dd.drop[0],
			method = $.data(drop || {}, "drop+reorder");
		/*if ( drop && ( drop != dd.current || method != dd.method ) ){
		 if(this.phantom) this.phantom[ method ]( drop );
		 dd.current = drop;
		 dd.method = method;
		 dd.update();
		 }*/

		// console.dir(dd);

	},

	onDragEnd: function (ev, dd) {
//		console.log('onDragEnd', dd.target, dd.drop[0]);
		$(dd.target).css('width', '');
		this.emptyDroppables.removeClass('active');
		this.emptyDroppables.each(function(){
			$(this).appendTo($(this).parent());
		});
		this.phantom.replaceWith(dd.target);
		$(dd.target).removeClass('treedrag-isdragging');

		if(dd.drop[0]){
			$(dd.target).insertBefore($(dd.drop[0]));
		}
	},

	// =============
	// DROP methods
	// ==============
	onDropInit: function (ev, dd) {
		/*console.log("onDropInit", dd.target, dd.drag)*/
		return  !( dd.target == dd.drag || $(dd.target).data('level') != $(dd.drag).data('level'));
	},
	onDropStart: function (ev, dd) {
//		console.log('onDropStart');
    var currentTarget = $(dd.target);
    currentTarget.parent().find('> .empty-droppable')
        .insertBefore(currentTarget).addClass('dropHover');
  },
	onDropEnd: function (ev, dd) {
//		console.log("dropEnd");
		$(dd.target).parent().find('> .empty-droppable').removeClass('dropHover');
	},
	onDrop: function (ev, dd) {
//		console.log("drop");
		return typeof this.options.onAfterDrop == 'function' ? this.options.onAfterDrop(dd.target, dd.drag) : true;
	},

	createPhantom: function (element) {
		var $elm = $(element);
		var phantom = this.phantom = $elm.clone();
		phantom.data('id', phantom.data('id')+"phantom");
		phantom.addClass('treedrag-phantom');
		$elm.after(phantom);
	},

	setElemPos: function (elm, dd) {
		elm.css({
			top: dd.offsetY,
			left: dd.offsetX
		})
	}
};