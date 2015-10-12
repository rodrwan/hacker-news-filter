(function () {
  'use strict';

  angular.module('HackerNews.srv.apiConnection')

  .factory('HackerNewsApi', function (Restangular) {
    return Restangular.service('query');
  });
})();
