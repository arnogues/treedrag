/**
 *
 */

var Droppopin = function () {
  this.init.apply(this, arguments);
};

Droppopin.prototype = {
  constructor: Droppopin.prototype.constructor,
  options: {
  },

  init: function (options) {
    this.options = $.extend(true, {}, this.options, options);
    this.zones = this.options.zones;

    this.addEvents();
  },

  addEvents: function () {
    var _this = this;
    this.zones.drop('init', function (ev, dd) {
      var res = $(dd.drag).data('zone-id') != $(dd.target).data('zone-id');
      return res;
    });
    this.zones.drop("start", function (ev, dd) {
      var drag = $(dd.drag);
      var zone = $(dd.target);
      //debugger;

      //if (drag.data('zone-id') == zone.data('zone-id')) {
        _this.open(zone);
      //}
    });

    this.zones.drop("end", function() {
      _this.close();
    });
  },

  overrideDragDrop: function (treedrag) {

  },

  open: function (zone, dropParent) {
    this.createPopin();

    $(zone).append(this.popin);
    this.popin.show();
  },

  close: function () {
    this.popin.hide();
  },

  createPopin: function () {
    if (!this.popin) {
      this.popin = $('<div class="treedrag_droppopin"></div>').hide();
    }
  }
};
