(function () {
  'use strict';

  angular.module('HackerNews', [
    'restangular',
    'ngMaterial',
    'ngSocial',
    'HackerNews.config',
    'HackerNews.drv.searcher',
    'HackerNews.drv.topicResults'
  ])

  .config(['SCRAPER_API_URL', 'RestangularProvider', '$mdThemingProvider', function MLConfig (SCRAPER_API_URL, RestangularProvider, $mdThemingProvider) {
      RestangularProvider.setBaseUrl(SCRAPER_API_URL);
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
    }]);
})();

(function () {
'use strict'

 angular.module('HackerNews.config', [])

.constant('SCRAPER_API_URL', 'http://hacker-news-filter.herokuapp.com/api')

; })();

(function () {
  'use strict';

  angular.module('HackerNews.drv.searcher', [
    'HackerNews.srv.apiConnection'
  ]);
})();

(function () {
  'use strict';

  angular.module('HackerNews.drv.topicResults', [
    'HackerNews.srv.apiConnection'
  ]);

})();

(function () {
  'use strict';

  angular.module('HackerNews.drv.searcher')

  .directive('searcher', ['HackerNewsApi', function (HackerNewsApi) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('HackerNews.drv.topicResults')

  .directive('topicResults', ['HackerNewsApi', function (HackerNewsApi) {
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
  }]);
})();

(function () {
  'use strict';

  angular.module('HackerNews.srv.apiConnection', [
  ]);
})();

(function () {
  'use strict';

  angular.module('HackerNews.srv.apiConnection')

  .factory('HackerNewsApi', ['Restangular', function (Restangular) {
    return Restangular.service('query');
  }]);
})();
