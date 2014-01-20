/* ng-infinite-scroll - v1.0.0 - 2014-01-20 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var bottom, checkWhenEnabled, container, handler, outerHandler, scrollDistance, scrollEnabled, _container_;
        container = angular.element($window);
        bottom = function() {
          return container.height() + container.scrollTop();
        };
        if (attrs.infiniteScrollContainer != null) {
          _container_ = scope.$eval(attrs.infiniteScrollContainer);
          if (_container_ != null) {
            container = elem.parents(_container_);
            bottom = function() {
              return container.height() + container.offset().top;
            };
          }
        }
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var containerBottom, elementBottom, remaining, shouldScroll;
          containerBottom = bottom();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - containerBottom;
          shouldScroll = remaining <= container.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            return scope.$eval(attrs.infiniteScroll);
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        outerHandler = function() {
          return scope.$apply(handler);
        };
        container.on('scroll', outerHandler);
        scope.$on('$destroy', function() {
          return container.off('scroll', outerHandler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);
