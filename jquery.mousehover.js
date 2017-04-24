/*
 * jquery.mousehover
 * https://github.com/prantlf/jquery.mousehover
 *
 * Copyright (c) 2017 Ferdinand Prantl
 * Licensed under the MIT license.
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  // Remember the existing mousehover plugin, if there is any, to be able
  // to restore it by calling noConflict.
  var oldMousehover = $.fn.mousehover,
      eventTimeProperty;

  // If the browser supports pointer events, we can detect mouse reliably.
  if (window.onpointerenter) {
    $.fn.mousehover = function (handlerIn, handlerOut) {
      return this.on('pointerenter', function (event) {
                   if (event.pointerType === 'mouse') {
                     handlerIn.call(this, event);
                   }
                 })
                 .on('pointerleave', function (event) {
                   if (event.pointerType === 'mouse') {
                     (handlerOut || handlerIn).call(this, event);
                   }
                 });
    };

  // If the browser has support for touch events, the mouseenter and
  // mouseleave events can be emulated on tapping the display.
  } else if (window.ontouchstart) {
    eventTimeProperty = 'mousehover-start';
    $.fn.mousehover = function (handlerIn, handlerOut) {
      // Store the time of the event, which would shortly preceed the
      // mouseenter event on touch-capable devices, if it were an emulated
      // mouse event caused by tapping the display.
      return this.on('touchend', function() {
                   $(this).data(eventTimeProperty, new Date().getTime());
                 })
                 // If the first event handler remembered its time and the
                 // mouseenter event comes too soon, it was triggered by
                 // tapping and should be ignored.
                 .on('mouseenter', function (event) {
                   var $this = $(this),
                       once = $this.data(eventTimeProperty),
                       now;
                   if (once) {
                     now = new Date().getTime();
                     // The time interval between the touchend event, which
                     // can identify, that the mouseenter event was emulated,
                     // and the mouseenter event itself can vary.
                     if (now - once < 50) {
                       return $(this).removeData(eventTimeProperty);
                     }
                   }
                   // Enable handling of the complementary mouseleave event.
                   $(this).data(eventTimeProperty, true);
                   handlerIn.call(this, event);
                 })
                 // The mouseleave event should call the hover event handler
                 // only if it was triggered by the mouseenter event earlier.
                 .on('mouseleave', function (event) {
                   var $this = $(this);
                   if ($this.data(eventTimeProperty)) {
                     $this.removeData(eventTimeProperty);
                     (handlerOut || handlerIn).call(this, event);
                   }
                 });
    };

  // If the browser has no support for touch events, we can assume, that
  // the only device, which can trigger the mouseenter eveny, is the mouse.
  } else {
    // Default to jQuery.hover on devices with touch capability.
    $.fn.mousehover = $.fn.hover;
  }

  // Restores the earlier mousehover plugin, which had been registered in
  // jQuery before this one. This plugin is returned for explicit usage.
  $.fn.mousehover.noConflict = function () {
    $.fn.mousehover = oldMousehover;
    return this;
  };

  return $;
}));
