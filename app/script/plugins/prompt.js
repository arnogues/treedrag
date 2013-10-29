;(function ( $, window, document, undefined ) {

	var pluginName = "prompt",
		defaults = {
			promptListSelector: '.js-promptList',
			promptList: [],
			promptTpl: '<p><label><input type="radio" name="promptchoice" value="{{value}}"/> {{text}}</label></p>',
			errors: {
				err1: pluginName + ': _generatePromptList ->  \'aPrompList\' bad parameter type'
			},
			preventSubmit: true,
			notifListener: 'body'
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
			this._generatePromptList(this.options.promptList);
			this._setEvents();
		},
		_setElements: function(){
			this.promptList = this.element.find(this.options.promptListSelector);
			this.submitButton = this.element.find('[type="submit"]');
		},
		_generatePromptList: function(aPromptList){
			if(!(aPromptList instanceof Array)) throw new Error(this.options.errors.err1);

			this.promptListValues = aPromptList;

			var promptList = '<div>';
			for (var i = 0, l = aPromptList.length; i < l; i++) {
				promptList += this._substitute(this.options.promptTpl, aPromptList[i]);
			}
			promptList += '</div>';
			this.promptList.html(promptList);
		},
		_deletePromptList: function(){
			this.promptList.html('');
		},
		_setEvents: function () {
			this.element.bind('submit', $.proxy(this._onSubmit, this));
			this.promptList.on('click', 'label:nth-child(1)', $.proxy(this._onChange, this));
		},
		_substitute: function (str, object) {
			return str.replace((/\{\{(.+?)\}\}/g), function (match, name) {
				return object[name] || '';
			});
		},
		_onSubmit: function(e){
			if(this.options.preventSubmit){
				e.preventDefault();
			}
			var val = this.element.serializeArray();
			$(this.options.notifListener).trigger(pluginName + '_submit', [this.promptListValues, val[0].value]);
		},
		_onChange: function(){
			this._activateButton();
		},
		_activateButton: function(){
			this.submitButton.removeAttr('disabled');
		},
		refresh: function(aPromptList){
			this._deletePromptList();
			this._generatePromptList(aPromptList);
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
