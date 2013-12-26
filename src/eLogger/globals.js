
//declarations and functions , extensions
var enabled = false;

/** 
 * Extends the AngularJS $log object. Tranforms native methods and add 
 * configuration methofds
 * @param $log
 * @param function (with transformation rules) 
 **/
angular.extend($log, createLogObj($log, logMethods, prepareLogFn, [null, false, false]));

/**
 * Add special methods to AngularJS $log
 * @type {getInstance}
 */
$log.getInstance = getInstance;

/**
 * Accepts a boolean to enable/disable logging globally for
 * the AngularJS App
 * @param flag {boolean}
 */
$log.enableLog = function (flag) {
    enabled = flag;
};

/**
 * Returns true if logging is enabled or false when logging is not enabled
 * @returns {boolean}
 */
$log.logEnabled = function () {
    return enabled;
};