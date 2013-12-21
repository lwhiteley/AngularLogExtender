angular.extend($log, createLobObj($log, logMethods, prepareLogFn, [null, false, false]));

// Add special methods to AngularJS $log
$log.getInstance = getInstance;


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