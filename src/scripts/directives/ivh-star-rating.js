
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
        var canvasWidth = element[0].offsetWidth
          , canvasHeight = element[0].offsetHeight
          , defs = ivhStarRatingSettings.get();

        var count = parseInt(attrs.ivhStarRatingCount || defs.count, 10)
          , points = parseInt(attrs.ivhStarRatingStarPoints || defs.starPoints, 10)
          , radius = attrs.ivhStarRatingRadius || Infinity
          , gravity = attrs.ivhStarRatingGravity || defs.gravity
          , colorFill = attrs.ivhStarRatingColorFill || defs.colorFill
          , colorUnfill = attrs.ivhStarRatingColurUnfill || defs.colorUnfill
          , colorBorder = attrs.ivhStarRatingColorBorder || ivhStarColorUtils.shade(colorFill, -30);

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
