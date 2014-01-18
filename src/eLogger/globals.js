
//declarations and functions , extensions
var enabled = false;

/** 
 * Extends the $log object with the transformed native methods
 * @param $log
 * @param function (with transformation rules) 
 **/
angular.extend($log, createLogObj($log, allowedMethods, prepareLogFn, [null, false, false, false, null]));

/**
 * Extend the $log with the {@see getInstance} method
 * @type {getInstance}
 */
$log.getInstance = getInstance;

/**
 * The following method enable/disable logging globally
 * @param flag {boolean} - boolean flag specifying if log should be enabled/disabled
 */
$log.enableLog = function (flag) {
    enabled = flag;
};

/**
 * The following returns the status of the {@see enabled}
 * @returns {boolean}
 */
$log.logEnabled = function () {
    return enabled;
};