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
		onInit: function(){},
    mode:''
	},

	zoneId: 0,

	init: function (element, options) {
		this.$element = $(element);
		this.options = $.extend(true, {}, this.options, options);
		this.zones = this.$element.find('.treedrag-zone');

		this.install();
		this.addEvents();

		this.options.onInit.apply(this);

	},

	install: function () {
		var _this = this;
		this.zones.each(function () {
			$(this).attr('data-zone-id', _this.zoneId++);
			var options = $.extend({}, _this.options, {
				zoneId: this.zoneId
			});
      _this.dragInitialiazer = new DragInitializer(this, options);
    });

    switch (this.options.mode) {
      case 'droppopin' :
        this.droppopin = new Droppopin({
          zones:this.zones
        });
        this.dragdrop = new DragDrop(this.$element, $.extend(this.options, {
          overrideFunction : this.droppopin.overrideDragDrop
        }));
        break;
      default :
        this.dragdrop = new DragDrop(this.$element, this.options);
    }
    this.toggler = new Toggler(this.$element);
  },

	addEvents: function () {

	},

	merge: function(){

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