// <need comment>
angular.extend($log, createLogObj($log, logMethods, prepareLogFn, [null, false, false]));

/**
 * Add special methods to AngularJS $log
 * @type {getInstance}
 */
$log.getInstance = getInstance;

//declarations and functions , extensions
var enabled = false;

/**
 * 
 * @param flag
 */
$log.enableLog = function (flag) {
    enabled = flag;
};

/**
 * Returns true if debugging is enabled or false when debugging is not enabled
 * @returns {boolean}
 */
$log.logEnabled = function () {
    return enabled;
};