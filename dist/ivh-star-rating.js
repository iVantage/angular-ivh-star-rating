
/**
 * Continuous star ratings for angular apps
 *
 * @package ivh.starRating
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.starRating', []);


/**
 * Star rating directive
 *
 * Draws continuous percentage based star gauges. Usage:
 *
 * ```
 * <ANY
 *   ivh-star-rating=""
 *   [ivh-star-rating-count=""]
 *   [ivh-star-rating-star-points=""]
 *   [ivh-star-rating-radius=""]
 *   [ivh-star-rating-gravity=""]
 *   [ivh-star-rating-color-fill=""]
 *   [ivh-star-rating-color-unfill=""]
 *   [ivh-star-rating-color-border=""]>
 * </ANY>
 * ```
 *
 */

angular.module('ivh.starRating').directive('ivhStarRating', [
    'ivhStarStamper', 'ivhStarColorUtils', 'ivhStarRatingSettings',
    function(ivhStarStamper, ivhStarColorUtils, ivhStarRatingSettings) {
  'use strict';
  return {
    restrict: 'AE',
    template: '<canvas></canvas>',
    replace: true,
    link: function(scope, element, attrs) {
      var ctx = element[0].getContext('2d');

      var update = function(ratio) {
        var defs = ivhStarRatingSettings.get()
          , points = parseInt(attrs.ivhStarRatingStarPoints || defs.starPoints, 10)
          , gravity = attrs.ivhStarRatingGravity || defs.gravity
          , colorFill = attrs.ivhStarRatingColorFill || defs.colorFill
          , colorUnfill = attrs.ivhStarRatingColurUnfill || defs.colorUnfill
          , colorBorder = attrs.ivhStarRatingColorBorder || ivhStarColorUtils.shade(colorFill, -30)
          , radius = attrs.ivhStarRatingRadius || Infinity
          , count = parseInt(attrs.ivhStarRatingCount || defs.count, 10);

        // Explicit radius forces a width and height
        if(Infinity !== radius) {
          element.attr('height', Math.ceil(radius * 2) + 'px');
          element.attr('width', (Math.ceil(radius * 2) * count) + 'px');
        }

        var canvasWidth = element[0].offsetWidth
          , canvasHeight = element[0].offsetHeight;

        radius = Math.min(
          radius,
          Math.floor(canvasHeight/2),
          Math.floor(canvasWidth/(2*count))
        );

        var yCanvasMidPoint = Math.floor(canvasHeight/2)
          , yStarCenter = yCanvasMidPoint;
        if('down' === gravity) {
          yStarCenter = Math.max(yCanvasMidPoint, canvasHeight - radius);
        } else if('up' === gravity) {
          yStarCenter = Math.min(yCanvasMidPoint, radius);
        }

        var x0 = (0-radius)
          , y0 = 0
          , x1 = (0+radius)
          , y1 = 0
          , gradient = ctx.createLinearGradient(x0, y0, x1, y1)
          , shadedStars = Math.floor(ratio * count);

        ctx.strokeStyle = colorBorder;

        for(var ix = 0; ix < count; ix++) {
          if(ix < Math.floor(shadedStars)) {
            ctx.fillStyle = colorFill;
          } else if(ix > Math.ceil(shadedStars)) {
            ctx.fillStyle = colorUnfill;
          } else {
            var colorStopAt = (100*ratio - (ix*(100/count)))/(100/count)
              , minStop = Math.max(0, colorStopAt - 0.01)
              , maxStop = Math.min(1, colorStopAt + 0.01);

            gradient.addColorStop(0, colorFill);
            if(minStop > 0) { gradient.addColorStop(minStop, colorFill); }
            if(maxStop < 1) { gradient.addColorStop(maxStop, colorUnfill); }
            gradient.addColorStop(1, colorUnfill);

            ctx.fillStyle = gradient;
          }

          ivhStarStamper(
            ctx,
            radius + 2*radius*ix,
            yStarCenter, // Gravity
            radius,
            points,
            0.5
          );
        }
      };

      if(angular.isDefined(attrs.ivhStarRatingRatio)) {
        attrs.$observe('ivhStarRatingRatio', update);
      } else {
        attrs.$observe('ivhStarRating', update);
      }

    }
  };
}]);

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


angular.module('ivh.starRating').service('ivhStarStamper', [function() {
  'use strict';


  /**
   * Add a star to a canvas element
   *
   * Add a star to the given canvas context at (x,y) with the given radius and
   * number of points. Inset should be a ratio between 0 and 1, it controls how
   * deep/shallow the "dips" between star points are - i.e. it represents the
   * length in radii from (x,y) to the closest perimeter point.
   *
   * Largely taken from [here][1].
   *
   * [1]: http://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
   *
   * @see http://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
   * @param {Context} ctx The canvas context
   * @param {Number} x The x position of the star center
   * @param {Number} y The y position of the star center
   * @param {Number=20} radius The star radius in pixels
   * @param {Integer=5} points The number of points on the star
   * @param {Number=0.5} inset The inset ratio, in the range [0,1)
   * @return {Context} The passed canvast context
   */
  var exports = function(ctx, x, y, radius, points, inset) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0,0-radius);
    for (var i = 0; i < points; i++) {
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - (radius*inset));
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - radius);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    return ctx;
  };

  return exports;
}]);
