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

    // dragDropInstance.old_onDragInit = dragDropInstance.onDragInit;
    dragDropInstance.onDragInit = function (ev, dd) {
      if (this.options.restrictDropLevel) {
        var currentLevel = this.currentLevel = $(dd.drag).data('level');
        this.emptyTarget = this.emptyDroppables.filter(function () {
          return $(this).data('level') == currentLevel;
        });
      } else {
        this.emptyTarget = this.emptyDroppables;
      }
      $(dd.drag).data('original-parent', $(dd.drag).parents('.treedrag-draggable').eq(0));
    };

    dragDropInstance.old_onDragStart = dragDropInstance.onDragStart;
    dragDropInstance.onDragStart = function (ev, dd) {
      var $elm = $(dd.drag);
      dragDropInstance.createPhantom($elm);
      dragDropInstance.setElemPos($elm, dd);
      $elm.css('width', $elm.width());
      $elm.addClass('treedrag-isdragging');
      dragDropInstance.$element.append($elm);
    };

    dragDropInstance.old_onDropInit = dragDropInstance.onDropInit;
    dragDropInstance.onDropInit = function (ev, dd) {

      var parents = $(dd.drag).parents();
      var isparent = jQuery.inArray(dd.target, parents) > -1;
      var rule = dd.drag != dd.target
          && $(dd.drag).data('zone-id') == $(dd.target).data('zone-id')
          && $(dd.drag).data('level') == $(dd.target).data('level')
          && $(dd.drag).data('draggable-type') == $(dd.target).data('draggable-type')
          && !isparent; // && (dragType == $(dd.target).data('id') || dragType == $(dd.target).data("droppable-accept"));


      return  rule;
    };

    dragDropInstance.old_onDropStart = dragDropInstance.onDropStart;
    dragDropInstance.onDropStart = function (ev, dd) {
		/*console.log(dd)
//		console.log(dd.target, $(dd.target).siblings(), $(dd.target).parent().find('li:not(.treedrag-phantom)').index($(dd.target)))
		if($(dd.target).parent().find('li:not(.treedrag-phantom)').index($(dd.target)) == 0){
			_this.dragdropInstance.phantom.insertBefore(dd.target);

		}else{
			_this.dragdropInstance.phantom.insertAfter(dd.target);

		}*/
    };

	  dragDropInstance.onDrag = function (ev, dd) {
		  this.setElemPos($(dd.drag), dd);

		  if(!( dd.drop[0] == dd.drag || $(dd.drop).data('level') != $(dd.drag).data('level'))){
			  if(dd.drop.length &&  ev.pageY > (parseInt($(dd.drop).offset().top, 10) + parseInt($(dd.drop).height()/2, 10))){
				  _this.dragdropInstance.phantom.insertAfter(dd.drop);
			  }else if(dd.drop.length){
				  _this.dragdropInstance.phantom.insertBefore(dd.drop);
			  }
		  }
	  },


    dragDropInstance.old_onDragEnd = dragDropInstance.onDragEnd;
    dragDropInstance.onDragEnd = function (ev, dd) {
      var foundCat;
      var originalCat;
      var drag = $(dd.drag);
      var zone = $(dd.drop);

      if (zone.length && zone.data("zone-id") != drag.data("zone-id")) {
        switch (drag.data("level")) {
          case 1:
            foundCat = zone.find('[data-id=' + drag.data('id') + ']');
            if (foundCat.length) {
              //merge categories
              var catChildren = drag.find('ul > li').not('.empty-droppable');
              foundCat.find('> ul').append(catChildren);
              drag.detach();
              zone.data('savedcat-' + drag.data('id'), drag);
            } else {
              zone.find('ul:first').append(drag);
            }

            break;

          case 2 :
            if (_this.currentZone && _this.currentZone.data('zone-id') == zone.data('zone-id')) return;
            foundCat = zone.find('[data-id=' + drag.data('draggable-type') + ']');
            if (!foundCat.length) {
              //Si pas de cat trouvée dans la zone en question, on duplique la cat original, on la déplace dans la popin et
              // on laisse une copie sur la zone en cours, cela permet de garder tous les events sans se prendre la tête

              //on verifie si on a pas déjà une ancienne categorie
              var oldCat = zone.data('savedcat-' + drag.data('draggable-type'));
              if (oldCat) {
                foundCat = oldCat;
              } else {
                originalCat = _this.dragdropInstance.phantom.parents('.treedrag-draggable').eq(0);
                foundCat = originalCat.clone(true);
                foundCat.find('ul:first').children('li').not('.empty-droppable').remove();
              }
              zone.find('ul:first').append(foundCat);
              foundCat.data('zone-id', zone.data('zone-id'));
            }
            drag.insertBefore(foundCat.find('.empty-droppable'));
            _this.currentDropCat = foundCat;
            _this.currentZone = zone;
        }
        drag.data('zone-id', zone.data('zone-id'));


        if (!originalCat) {
          originalCat = _this.dragdropInstance.phantom.parents('.treedrag-draggable').eq(0);
        }
        if (originalCat.length) {
          _this.dragdropInstance.phantom.remove();

          var originalCatChildren = originalCat.find('ul:first').children('li').not('.empty-droppable');
          if (originalCatChildren.length == 0) {
            zone.data('savedcat-' + originalCat.data('id'), originalCat);
            originalCat.detach();
          }
        } else {
          _this.dragdropInstance.phantom.remove();
        }


        _this.resetZonesIds();
      } else {
        var draged = $(dd.target);
        //Restor style
        draged.css('width', '');
        //Restor element
        _this.dragdropInstance.phantom.replaceWith(draged);
        _this.resetZonesIds();
      }

      _this.zones.find('.empty-droppable')
          .removeClass('active')
          .each(function () {
            $(this).appendTo($(this).parent());
          });
      drag.data('hasbeendrag',true);
      //Class gestion
      $(dd.target).removeClass('treedrag-isdragging');
      _this.currentZone = null;
      _this.currentDropCat = null;
      _this.newCatHasBeenCreated = false;
      _this.dragdropInstance.dragdropResetEvents();

      _this.dragdropInstance.items.css({
        left: '',
        top: '',
        width: ''
      })
    }
  },

  resetZonesIds: function () {
    this.zones.each(function () {
      var zone = $(this);
      zone.find('[data-zone-id]').data('zone-id', zone.data('zone-id'));
    });
  },


  addEvents: function () {
    var _this = this;
    //this.zones.unbind('dropinit');

    this.zones.drop('init', function (ev, dd) {
      var rule = $(dd.drag).data('zone-id') != $(dd.target).data('zone-id');
      return  rule;
    });

  }
};
