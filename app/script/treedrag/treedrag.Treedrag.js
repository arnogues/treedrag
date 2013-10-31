/**
 * Treedrag.
 */

var Treedrag = function () {
	this.init.apply(this, arguments);
};

Treedrag.prototype = {
	constructor: Treedrag.prototype.constructor,
	options: {
		limitToParent: true,
		notifListener: 'body',
		onInit: function(){}
	},

	zoneId: 0,

	init: function (element, options) {
		this.$element = $(element);
		this.options = $.extend(true, {}, this.options, options);
		this.zones = this.$element.find('.treedrag-zone');

		this.install();
		this.addEvents();

		this.options.onInit.call(this);
	},

	install: function () {
		var _this = this;
		this.zones.each(function () {
			$(this).attr('data-zone-id', this.zoneId++);
			var options = $.extend({}, _this.options, {
				zoneId: this.zoneId
			});
			$(this).data('DragInitializer', new DragInitializer(this, options));
		});

		this.$element.data('DragDrop', new DragDrop(this.$element, this.options));

		new Toggler(this.$element);
	},

	addEvents: function () {

	},

	merge: function(elements, into){
//		console.log('merge', elements, into);
		var ul = '<ul></ul>',
			level = into.element.data('level') + 1,
			emptySibling = into.element.parent().find('.empty-droppable');

		if(into.element.find('ul').length){
			ul = into.element.find('ul');
		}else{
			ul = into.element.append(ul).find('ul');
		}

		for (var i = 0, l = elements.length; i < l; i++) {
			var element = elements[i].element;
			element.data('level', level);
			ul.append(elements[i].element);
		}

		if(!ul.find('.empty-droppable').length){
			var empty = emptySibling.clone();
			ul.append(empty);
			this.$element.data('DragDrop').refreshEmptyDroppable();
			this.$element.data('DragDrop').addEvents(empty);
		}


		var dragZone = into.element.closest('.treedrag-zone');
		dragZone.data('DragInitializer').applyProperties(into.element, level);

		/*elements.each(function(){
			ul += this;
		});

		ul += '</ul>';

		into.append(ul);*/
	}
};

/**
 * jquery plugin declaration
 */
$.fn.treedrag = function (options) {
	$(this).each(function () {
		$(this).data('treedrag', new Treedrag(this, options));
	});
	return this;
};