// Provider functions that will be exposed to allow overriding of default $logProvider functionality

/**
 * Enables/disables global logging
 * @param flag
 */
var enableLogging = function (flag) {
    enableGlobally = flag;
};
