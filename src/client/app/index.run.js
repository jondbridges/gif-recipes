(function() {
  'use strict';

  angular
    .module('gifRecipes')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
