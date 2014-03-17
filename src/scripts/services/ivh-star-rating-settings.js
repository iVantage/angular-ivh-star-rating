
angular.module('ivh.starRating').provider('ivhStarRatingSettings', [function() {
  'use strict';

  var defaults = {
    count: 5,
    gravity: 'middle', // top, middle, bottom
    starPoints: 5,
    inset: 0.5,
    colorFill: '#FFD700',
    colorUnfill: '#FFFFFF'
  };

  /**
   * Set default stamp options
   *
   * @param {Object} userDefaults Options hash
   */
  this.setDefaults = function(userDefaults) {
    angular.extend(defaults, userDefaults);
  };

  var exports = {};

  exports.get = function(key) {
    if(!key) { return angular.copy(defaults); }
    return defaults[key];
  };

  this.$get = function() {
    return exports;
  };

}]);
