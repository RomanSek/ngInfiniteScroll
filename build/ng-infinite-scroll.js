/* ng-infinite-scroll - v1.0.0 - 2014-01-15 */
var mod,
  __slice = [].slice;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var Container, checkWhenEnabled, container, handler, outerHandler, scrollDistance, scrollEnabled, _container_;
        Container = function(container) {
          this.element = angular.element(container);
          this.on = function() {
            var args, _ref;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return (_ref = this.element).on.apply(_ref, args);
          };
          this.off = function() {
            var args, _ref;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return (_ref = this.element).off.apply(_ref, args);
          };
          this.height = function() {
            var args, _ref;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return (_ref = this.element).height.apply(_ref, args);
          };
          if (container === $window) {
            this.bottom = function() {
              return this.element.height() + this.element.scrollTop();
            };
          } else {
            this.bottom = function() {
              return this.element.height() + this.element.offset().top;
            };
          }
          return this;
        };
        container = new Container($window);
        if (attrs.infiniteScrollContainer != null) {
          _container_ = scope.$eval(attrs.infiniteScrollContainer);
          if (_container_ != null) {
            container = new Container(_container_);
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
          containerBottom = container.bottom();
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
