/*jshint bitwise:false */

/**
 * Color utility methods
 *
 * Mostly taken from [this stack overflow question][1].
 *
 * [1]: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 *
 * @package ivh.starRating
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.starRating').service('ivhStarColorUtils', [function() {
  'use strict';

  var exports = {};

  /**
   * Lighten or darken a hex color
   *
   * Input colors must be of the form '#123456'
   *
   * @param {String} color The color
   * @param {Number} percent Amount to lighten/dark color [-100,100]
   * @return {String} hex color string
   */
  exports.shade = function(color, percent) {
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
  };

  return exports;
}]);
