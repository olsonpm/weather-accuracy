"use strict";


//---------//
// Imports //
//---------//

var TweenLite = require('TweenLite')
    , $ = require('jquery')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var gsapd = nh.gsapDefaults(window);


//-------------//
// Constructor //
//-------------//

function UILogic(state, handles, constants) {
    this.state = state;
    this.handles = handles;
    this.constants = constants;
}


//--------------------//
// Prototyped Methods //
//--------------------//

UILogic.prototype.setFormElementWidths = function setFormElementWidths() {
    this.handles.dialog.find('.content').setChildWidths('.row');
};

UILogic.prototype.initiateTitleClick = function initiateTitleClick() {
    var dialog = this.handles.dialog;

    dialog.find('.title').click(function() {
        var content = dialog.find('.content');

        // if currently animating, then do nothing
        if (dialog.hasClass('animating')) {
            return;
        } else {
            dialog.addClass('animating');
        }

        // if the options are expanded, then we need to retract them
        if (dialog.hasClass('expanded')) {
            content.css('height', 0)
            dialog.removeClass('expanded');
            dialog.addClass('retracted');
            content.removeAttr('style');
            TweenLite.to(dialog.find('.chevron'), gsapd.DURATION, {
                rotation: '180deg'
                , ease: gsapd.EASE
                , onComplete: function() {
                    dialog.removeClass('animating');
                }
            });
        } else { // else the options are retracted, so we need to expand out
            var contentHeight = content.css({
                'display': 'block'
            }).css('height');
            content.css({
                'height': contentHeight
            });

            dialog.removeClass('retracted');
            dialog.addClass('expanded');
            content.removeAttr('style');

            TweenLite.to(dialog.find('.chevron'), gsapd.DURATION, {
                rotation: '0deg'
                , ease: gsapd.EASE
                , onComplete: function() {
                    dialog.removeClass('animating');
                }
            });
        }

        // Unfortunately the animation doesn't work with the svg graphics on-screen
        /*
              // if the options are expanded, then we need to retract them
              if (dialog.hasClass('expanded')) {
                  TweenLite.to(content, gsapd.DURATION, {
                      css: {
                          'height': '0'
                      }
                      , ease: gsapd.EASE
                      , onComplete: function() {
                          dialog.removeClass('expanded');
                          dialog.addClass('retracted');
                          content.removeAttr('style');

                          TweenLite.to(dialog.find('.chevron'), gsapd.DURATION, {
                              rotation: '180deg'
                              , ease: gsapd.EASE
                              , onComplete: function() {
                                  dialog.removeClass('animating');
                              }
                          });
                      }
                  });
              } else { // else the options are retracted, so we need to expand out
                  var contentHeight = content.css({
                      'display': 'block'
                  }).css('height');
                  content.css({
                      'height': 0
                  });


                  TweenLite.to(content, gsapd.DURATION, {
                      css: {
                          'height': contentHeight
                      }
                      , ease: gsapd.EASE
                      , onComplete: function() {
                          dialog.removeClass('retracted');
                          dialog.addClass('expanded');
                          content.removeAttr('style');

                          TweenLite.to(dialog.find('.chevron'), gsapd.DURATION, {
                              rotation: '0deg'
                              , ease: gsapd.EASE
                              , onComplete: function() {
                                  dialog.removeClass('animating');
                              }
                          });
                      }
                  });
              }
              */
    });
};


//---------//
// Exports //
//---------//

module.exports = UILogic;
