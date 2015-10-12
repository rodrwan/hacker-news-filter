(function () {
  'use strict';

  angular.module('HackerNews.drv.searcher')

  .directive('searcher', function (HackerNewsApi) {
    return {
      restrict: 'E',
      link: function (scope, elem) {
        elem.bind('keyup', function (v) {
          if (v.keyCode === 13) {
            HackerNewsApi.one(scope.query).getList().then(function (topics) {
              scope.$emit('topics', topics);
            });
          }
        });

        scope.search = function () {
          HackerNewsApi.one(scope.query).getList().then(function (topics) {
            scope.$broadcast('topics', topics);
          });
        };
      },
      templateUrl: 'build/app/components/searcher/searcher.html'
    };
  });
})();
