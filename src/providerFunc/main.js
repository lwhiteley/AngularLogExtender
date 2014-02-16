// Provider functions that will be exposed to allow overriding of default $logProvider functionality

/**
 * Used externally to enable/disable logging globally
 * @param {boolean} flag - flag that sets whether logging is enabled/disabled
 */
var enableLogging = function (flag) {
    enableGlobally = isBoolean(flag) ? flag : false;
};

/**
 * Configure which log functions can be exposed at runtime
 * @param {*[]} arrMethods - list of methods that can be used
 */
var restrictLogMethods = function (arrMethods) {
    if (angular.isArray(arrMethods)) {
        // TODO: should do validation on this to ensure valid properties are passed in
        allowedMethods = arrMethods;
    }
};

/**
 * Modify the default log prefix
 * @param {Function} logPrefix - function that defines the rule for a custom log prefix
 */
var overrideLogPrefix = function (logPrefix) {
    if (angular.isFunction(logPrefix)) {
        // TODO : Validation of the function to ensure it's of the correct format etc
        customLogPrefixFn = logPrefix;
        logPrefixOverride = true;
    }
};

/**
 * Turns off default coloring of logs
 * @param {boolean} flag - flag that configures disabling default log colors
 */
var disableDefaultColors = function (flag) {
    useDefaultColors = (isBoolean(flag) && flag) ? false : true;
};

/**
 * Used to set a custom color to a specific $log method
 * @param {String} methodName - method name of the log method to assign a custom color
 * @param {String} colorCss - css string that defines what colour to be set for the specified log method
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
 * @param {object} overrides - object that defines log method color overrides
 */
var overrideLogMethodColors = function (overrides) {
    if (itypeof(overrides) === 'object') {
        angular.forEach(overrides, function(colorCss, method){
            setLogMethodColor(method, colorCss);
        });
    }
};

/**
 * Used to force default log prefix functionality
 * @param {boolean} flag - when passed true or flag is not set, it forces log-ex to use the default log prefix
 */
var useDefaultLogPrefix = function (flag) {
    if(angular.isUndefined(flag)){
        useDefaultPrefix = true;
    }else if(isBoolean(flag)){
        useDefaultPrefix = flag;
    }
};

/**
 * Used to enable log backend push functionality
 * @param {boolean} flag - when passed true or flag is not set, it enables log backend push functionality
 */
var enableLogPushService = function (flag) {
    if(angular.isUndefined(flag)){
        logPushSericeEnabled = true;
    }else if(isBoolean(flag)){
        logPushSericeEnabled = flag;
    }
};

/**
 * Used to set specific $log method messages that will be pushed to the api
 * @param {string []} value - allowed log methods for push service
 */
var setAllowedLogPushMethods = function (value) {
    if(itypeof(value) === 'array'){
        defaultLogPushMethods = value;
    }
};

/**
 * Used to set the interval in milliseconds at which to push logs to an api
 * @param {number} value - interval in millis
 */
var setLogPushInterval = function (value) {
    if(itypeof(value) === 'number'){
        logPushInterval = value;
    }
};

/**
 * Used to set API url where logs will be pushed to
 * @param {string} value - api url
 */
var setLogPushApi = function (value) {
    if(itypeof(value) === 'string'){
        logPushApi = value;
    }
};

/**
 * Used to set log push configurations in one method
 * @param {object} value - config options
 */
var logPushConfig = function (value) {
    if(itypeof(value) === 'object'){
        if(value.hasOwnProperty('api')) setLogPushApi(value.api);
        if(value.hasOwnProperty('interval')) setLogPushInterval(value.interval);
        if(value.hasOwnProperty('methods')) setAllowedLogPushMethods(value.methods);
        if(value.hasOwnProperty('enable')) {
            enableLogPushService(value.enable);
        }else{
            enableLogPushService();
        }
    }
};