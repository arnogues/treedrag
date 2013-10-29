/**
 * Treedrag.
 */

var Treedrag = function () {
	this.init.apply(this, arguments);
};

Treedrag.prototype = {
	constructor: Treedrag.prototype.constructor,
	options: {
		limitToParent: true
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
			var options = $.extend({}, _this.options, {
				zoneId: this.zoneId
			});
			new DragInitializer(this, options);
		});

		new DragDrop(this.$element, this.options);

		new Toggler(this.$element);
	},

	addEvents: function () {

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