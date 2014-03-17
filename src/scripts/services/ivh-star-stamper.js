
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
