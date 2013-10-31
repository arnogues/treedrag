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
    this.zones.append('<div class="treedrag-zone-fog"></div>');
    this.addEvents();
    this.createPopin();
    this.overrideDragDrop = $.proxy(this.overrideDragDrop, this);
  },

  dragdropResetEvents: function () {
    this.dragdropInstance.removeDropEvents();
    this.dragdropInstance.addDropEvents();
  },

  overrideDragDrop: function (dragDropInstance) {
    this.dragdropInstance = dragDropInstance;
    var _this = this;
    dragDropInstance.old_onDragEnd = dragDropInstance.onDragEnd;
    dragDropInstance.onDragEnd = function (ev, dd) {
      if (_this.newCatHasBeenCreated) {
        //debugger;
      } else {
        if (_this.currentDropCat) {
          var nextSibling = _this.currentDropCat.data('next-sibling');
          if (nextSibling && nextSibling.length) {
            _this.currentDropCat.insertBefore(nextSibling);
          } else {
            _this.currentZone.append(_this.currentDropCat);
          }
          /*if (_this.dragInCatEnabled) {

            $(dd.drag).insertBefore(_this.currentDropCat.find('.empty-droppable'));
            $(dd.drag).css({
              left: 'auto',
              top: 'auto'
            });
          }*/
        }
      }

      _this.close();

      _this.currentZone = null;
      _this.currentDropCat = null;
      _this.newCatHasBeenCreated = false;
      _this.dragInCatEnabled = true;

      dragDropInstance.old_onDragEnd(ev, dd);

    }
  },

  resetZonesIds: function () {
    this.zones.each(function () {
      var zone = $(this);
      zone.find('[data-zone-id]').attr('data-zone-id', zone.attr('data-id'));
    });
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
      if (_this.currentZone && _this.currentZone.data('zone-id') == zone.data('zone-id')) return;

      var foundCat = zone.find('[data-id=' + drag.data('draggable-type') + ']');
      if (!foundCat.length) {
        foundCat = $(dd.drag).data('original-parent').clone(true, true);
        foundCat.find('ul:first').children('li').not('.empty-droppable').remove();
        _this.newCatHasBeenCreated = true;
      } else {
        foundCat = foundCat.parents('.treedrag-draggable').eq(0);
        foundCat.data('next-sibling', foundCat.next());
      }
      _this.currentDropCat = foundCat;
      _this.currentZone = zone;
      zone.addClass('zone-isdraggable');
      _this.open(zone);
    });
  },


  open: function (zone, dropParent) {
    $(zone).append(this.popin);
    this.popin.show();
    this.zones.removeClass('zone-isdraggable');
    this.popin.empty().append(this.currentDropCat);
  },

  close: function () {
    if (this.popin) {
      this.popin.hide();
    }
  },

  createPopin: function () {
    var _this = this;
    if (!this.popin) {
      this.popin = $('<div class="treedrag_droppopin"></div>').hide();
      this.popin.appendTo(this.zones[0]);
      this.popin.drop('init',function() {
        return true;
      });
      /* this.popin.mouseenter(function () {
       _this.dragInCatEnabled = true;
       });*/
      /* this.popin.mouseleave(function () {
       _this.dragInCatEnabled = false;
       });
       this.popin.drop('init',function(ev,dd) {
       console.log("pouet");
       return true;
       });
       this.popin.drop(function(ev,dd) {
       console.log("popin drop start");
       });*/
    }
  }
};
