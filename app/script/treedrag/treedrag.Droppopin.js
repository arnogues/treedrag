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
    this.overrideDragDrop = $.proxy(this.overrideDragDrop, this);
  },


  overrideDragDrop: function (treedrag) {
    var _this = this;
    treedrag.old_onDragEnd = treedrag.onDragEnd;
    treedrag.onDragEnd = function (ev, dd) {
      treedrag.old_onDragEnd(ev, dd);
      _this.close();
      _this.currentZone.append(_this.currentDropCat);
    }
  },


  addEvents: function () {
    var _this = this;
    this.zones.drop('init', function (ev, dd) {
      _this.dragInProgress = true;
      var res = $(dd.drag).data('zone-id') != $(dd.target).data('zone-id');
      return res;
    });
    this.zones.drop("start", function (ev, dd) {
      var drag = $(dd.drag);
      var zone = $(dd.target);
      //console.log(drag.data('draggable-type'), '[data-id=' + drag.data('draggable-type') + ']', );
      //debugger;
      var foundCat = zone.find('[data-id=' + drag.data('draggable-type') + ']');
      if (!foundCat.length) {
        foundCat = $(dd.drag).data('original-parent').clone(true);
        foundCat.find('ul:first').empty();
      } else {
        foundCat = foundCat.parents('.treedrag-draggable').eq(0);
      }
      _this.currentDropCat = foundCat;
      _this.currentZone = zone;

      _this.open(zone);
    });
  },


  open: function (zone, dropParent) {
    this.createPopin();
    $(zone).append(this.popin);
    this.popin.show();
    this.popin.empty().append(this.currentDropCat);
    console.log('show');
  },

  close: function () {
    if (this.popin) {
      this.popin.hide();
    }
  },

  createPopin: function () {
    if (!this.popin) {
      this.popin = $('<div class="treedrag_droppopin"></div>').hide();
    }
  }
};
