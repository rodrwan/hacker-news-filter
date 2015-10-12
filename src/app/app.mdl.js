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

  .config(function MLConfig (SCRAPER_API_URL, RestangularProvider, $mdThemingProvider) {
      RestangularProvider.setBaseUrl(SCRAPER_API_URL);
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
    });
})();
