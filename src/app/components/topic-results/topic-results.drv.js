(function () {
  'use strict';

  angular.module('HackerNews.drv.topicResults')

  .directive('topicResults', function (HackerNewsApi) {
    return {
      restrict: 'E',
      link: function ($scope) {
        HackerNewsApi.getList().then(function (topics) {
          $scope.topics = topics;
        });

        $scope.$on('topics', function (events, topics) {
          $scope.topics = topics;
        });
      },
      templateUrl: 'build/app/components/topic-results/topic-results.html'
    };
  });
})();
