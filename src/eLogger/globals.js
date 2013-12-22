angular.extend($log, createLobObj($log, logMethods, prepareLogFn, [null, false, false]));

// Add special methods to AngularJS $log
$log.getInstance = getInstance;

//declarations and functions , extensions
var enabled = false;

$log.setGlobalDebugFlag = function (flag) {
    enabled = flag;
};

/**
 * returns true if debugging is enabled or false when debugging is not enabled
 * @author : layton
 */
$log.isEnabled = function () {
    return enabled;
};