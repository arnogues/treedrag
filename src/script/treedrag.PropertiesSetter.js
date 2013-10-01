/**
 * Apply data-draggable and data-droppable atrributes on a ul>li list ul are droppables, li are draggables
 * @constructor
 */
(function() {
var zoneId = 0;

PropertiesSetter = function () {
  this.init.apply(this, arguments);
};

PropertiesSetter.prototype = {
  constructor: PropertiesSetter.prototype.constructor,
  options: {

  },

  init: function (element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.applyProperties(this.$element.find('ul:first'),1);
    this.zoneId = zoneId++;

    this.addEvents();
  },

  addEvents: function () {

  },

  applyProperties:function(ul,level) {
    var _this = this;
    $(ul).attr('data-droppable',true).attr('data-droppable-accept', level);
    $(ul).children().each(function() {
       $(this).attr('data-draggable',true).attr('data-draggable-type', level);
      var firstUl = $(this).find('ul:first');
      if(firstUl.length)
        _this.applyProperties(firstUl);
    })
  }
};
});