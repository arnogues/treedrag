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

  overrideDragDrop: function (dragDropInstance) {
    this.dragdropInstance = dragDropInstance;
    var _this = this;

    dragDropInstance.old_onDropInit = dragDropInstance.onDropInit;
    dragDropInstance.onDropInit = function (ev, dd) {
      var dragType = $(dd.drag).data("draggable-type");
      return dragType == $(dd.target).data('id') || dragType == $(dd.target).data("droppable-accept");
    };

    dragDropInstance.old_onDragEnd = dragDropInstance.onDragEnd;
    dragDropInstance.onDragEnd = function (ev, dd) {
      var drag = $(dd.drag);
      var zone = $(dd.drop);
      var draged = $(dd.target);

      //Restor style
      draged.css('width', '');
      //Restor element
      this.phantom.replaceWith(draged);


      console.log(zone.data("zone-id"), drag.data("zone-id"));

      switch (drag.data("level")) {
        case 1:
          var foundCat = zone.find('[data-id=' + drag.data('id') + ']');
          if(foundCat.length) {
            //merge categories
            var catChildren = drag.find('ul > li').not('.empty-droppable');
            foundCat.find('> ul').append(catChildren);
            drag.remove();
          } else {
            zone.append(drag);
          }
          break;

        case 2 :
          if (_this.currentZone && _this.currentZone.data('zone-id') == zone.data('zone-id')) return;
          var foundCat = zone.find('[data-id=' + drag.data('draggable-type') + ']');
          if (!foundCat.length) {
            //Si pas de cat trouvée dans la zone en question, on duplique la cat original, on la déplace dans la popin et
            // on laisse une copie sur la zone en cours, cela permet de garder tous les events sans se prendre la tête
            foundCat = $(dd.drag).data('original-parent').clone(true, true);
            foundCat.find('ul:first').children('li').not('.empty-droppable').remove();
            zone.append(foundCat);
          }
          $(dd.drag).insertBefore(foundCat.find('.empty-droppable'));
          _this.currentDropCat = foundCat;
          _this.currentZone = zone;
      }

      _this.zones.find('.empty-droppable')
          .removeClass('active')
          .each(function () {
            $(this).appendTo($(this).parent());
          });
      _this.dragdropInstance.phantom.remove();

      //Class gestion
      $(dd.target).removeClass('treedrag-isdragging');

      _this.currentZone = null;
      _this.currentDropCat = null;
      _this.newCatHasBeenCreated = false;

      _this.dragdropInstance.dragdropResetEvents();
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
      //if ($(dd.drag).data('level') == 1) return false;
      _this.dragInProgress = true;
      return  $(dd.drag).data('zone-id') != $(dd.target).data('zone-id');
    });



  }
};
