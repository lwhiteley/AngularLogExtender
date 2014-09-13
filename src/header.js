/*
 * %APP_NAME% v%VERSION%
 *
 * %DESCRIPTION%
 *
 * *Module Dependency can be added to a angular project as follows :*
 *```javascript
 *   var app = angular.module('myAngularApp', ['log.ex.uo']);
 *```
 *
 * *Usage :*
 *
 * ```javascript
 *      app.controller('CoreController', ['$scope','$log', function($scope, $log) {
 *          $log.log("Simple Log Extender Example");
 *      }]);
 * ```
 *
 * @original-author  Thomas Burleson
 * @contributor Layton Whiteley
 * @contributor %CONTRIBUTOR%
 * @website http://www.theSolutionOptimist.com
 * (c) %YEAR% %WEBSITE%
 * License: %LICENSE%
 *
 * Modifications made by @contributor Layton Whiteley:
 * - Modified to be a full stand-alone Angular Application for reuse
 * - Has global and feature level activation/disabling for $log
 * - Supported sensitive field filtering
 * - Created and tested with AngularJS versions : %SUPPORTED_VERSIONS%
 */