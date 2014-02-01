
//declarations and functions , extensions
/**
 * Used to enable/disable logging
 * @type {boolean}
 */
var enabled = false;

/**
 * Extends the $log object with the transformed native methods
 * @param $log - $log instance
 * @param {function} createLogObj -  defines transformation rules
 **/
angular.extend($log, createLogObj($log, allowedMethods, prepareLogFn, [null, false, false, false, null]));

/**
 * Extend the $log with the {@see getInstance} method
 * @type {getInstance}
 */
$log.getInstance = getInstance;

/**
 * The following method enable/disable logging globally
 * @param {boolean} flag - boolean flag specifying if log should be enabled/disabled
 */
$log.enableLog = function (flag) {
    enabled = flag;
};

/**
 * The following returns the status of the {@see enabled}
 * @returns {boolean} - returns global enabled flag
 */
$log.logEnabled = function () {
    return enabled;
};