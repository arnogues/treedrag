;(function ( $, window, document, undefined ) {

	var pluginName = "fluidPopin",
		defaults = {
			propertyName: "value"
		};

	function Plugin ( element, options ) {
		this.element = $(element);
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this._setElements();
			this._setEvents();
		},
		_setElements: function(){
			this.fog = $('#fp-fog');
			this.modalWrapper = $(this.element.attr('href'));
			this.modal = this.modalWrapper.find('.fp-modal');

			this.closer = this.modal.find('.fp-close');
		},
		_setEvents: function () {
			this.element.bind('click', $.proxy(this._linkClickEvent, this));

			this.fog.bind('click', $.proxy(this._fogClickEvent, this));
			this.modalWrapper.bind('click', $.proxy(this._fogClickEvent, this));
			this.modal.bind('click', $.proxy(this._modalClickEvent, this));

			this.closer.bind('click', $.proxy(this._closerClickEvent, this));
		},
		_linkClickEvent: function(e){
			e.preventDefault();
			this.open();
		},
		_fogClickEvent: function(e){
			e.preventDefault();
			this.close();
		},
		_closerClickEvent: function(e){
			e.preventDefault();
			this.close();
		},
		_modalClickEvent: function(e){
			e.stopPropagation();
		},
		open: function(){
			this.fog.addClass('show');
			this.modalWrapper.addClass('show');
		},
		close: function(){
			this.fog.removeClass('show');
			this.modalWrapper.removeClass('show');
		}
	};

	$.fn[ pluginName ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );
