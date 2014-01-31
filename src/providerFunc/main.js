// Provider functions that will be exposed to allow overriding of default $logProvider functionality

/**
 * Used externally to enable/disable logging globally
 * @param flag - boolean that sets whether logging is enabled/disabled
 */
var enableLogging = function (flag) {
    enableGlobally = isBoolean(flag) ? flag : false;
};

/**
 * Configure which log functions can be exposed at runtime
 * @param arrMethods - array list of methods that can be used
 */
var restrictLogMethods = function (arrMethods) {
    if (angular.isArray(arrMethods)) {
        // TODO: should do validation on this to ensure valid properties are passed in
        allowedMethods = arrMethods;
    }
};

/**
 * Modify the default log prefix
 * @param logPrefix - function that defines the rule for a custom log prefix
 */
var overrideLogPrefix = function (logPrefix) {
    if (angular.isFunction(logPrefix)) {
        // TODO : Validation of the function to ensure it's of the correct format etc
        // TODO : Might want to allow memoization of the default functionality and allow easy toggling of custom vs default
        getLogPrefix = logPrefix;
    }
};

/**
 * Turns off default coloring of logs
 * @param flag - boolean that configures disabling default log colors
 */
var disableDefaultColors = function (flag) {
    useDefaultColors = (isBoolean(flag) && flag) ? false : true;
};

/**
 * Used to set a custom color to a specific $log method
 * @param methodName - method name of the log method to assign a custom color
 * @param colorCss - css string that defines what colour to be set for the specified log method
 */
var setLogMethodColor = function (methodName, colorCss) {
    if (itypeof(methodName) === 'string' &&
        defaultLogMethodColors.hasOwnProperty(methodName) &&
        validateColorCssString(colorCss)) {

        defaultLogMethodColors[methodName] = colorCss;
    }
};

/**
 * Used to set custom colors to multiple $log method
 * @param overrides - object that defines log method color overrides
 */
var overrideLogMethodColors = function (overrides) {
    if (itypeof(overrides) === 'object') {
        angular.forEach(overrides, function(colorCss, method){
            setLogMethodColor(method, colorCss);
        });
    }
};