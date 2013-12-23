/**
 *
 * @param value
 * @returns {boolean}
 */
var isBoolean = function (value) {
    return typeof value == 'boolean';
};

/**
 *
 * @param value
 * @returns {String}
 */
var trimString = function (value) {
    if (angular.isString(value))
        return value.replace(/^\s*/, '').replace(/\s*$/, '');
    return "";
};

/**
 * @param value
 * @returns {*|Boolean|boolean}
 */
var isValidString = function (value) {
    return (angular.isString(value) && trimString(value) !== "");
};

/**
 * processUseOverride returns true if the override flag is set.
 * this is used to activated the override functionality.
 * @param override
 * @returns {}
 */
var processUseOverride = function (override) {
    return isBoolean(override);
};

/**
 * process override only takes true or false as valid input.
 * any other input will resolve as true.
 * this function is used to override the global flag for displaying logs
 * */
var processOverride = function (override) {
    return override !== false;
};

/**
 *
 * @param {string=} className
 * @returns {string}
 */
var getLogPrefix = function (/**{String=}*/className) {
    var formatMessage = "";
    var separator = " >> ";
    var format = "MMM-dd-yyyy-h:mm:ssa";
    var now = $filter('date')(new Date(), format);
    if (!isValidString(className)) {
        formatMessage = "" + now + separator;
    } else {
        formatMessage = "" + now + "::" + className + separator;
    }
    return formatMessage;
};

/**
 *
 * @param enabled
 * @param override
 * @returns {boolean}
 */
var activateLogs = function (enabled, override) {
    if(isBoolean(enabled) && isBoolean(override)){
        return override;
    }
    return false;
};

/**
 *
 * @param _$log
 * @param useOverride
 * @param _override
 * @param className
 * @param enabled
 */
var printOverrideLogs = function (_$log, useOverride, _override, className, enabled) {
    var instance = (isValidString(className)) ? className : "this instance";
    if (!enabled && useOverride && _override) {
        _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING ENABLED - $log enabled for " + instance);
    } else if (enabled && useOverride && !_override) {
        _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING DISABLED - $log disabled for " + instance);
    }
};

/**
 *
 * @type {string[]}
 */
var logMethods = ['log', 'info', 'warn', 'debug', 'error'];

/**
 *
 * @type {string[]}
 */
var allowedMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

/**
 *
 * @param {Object} oSrc
 * @param {Array=} aMethods
 * @param {Function=} func
 * @param {Array} aParams
 * @returns {{}}
 */
var createLobObj = function(oSrc, aMethods, /**Function=*/func, /*Array=*/aParams) {
    var resultSet = {};
    angular.forEach(aMethods, function (value) {
        if (angular.isDefined(aParams)) {
            var params = [];
            angular.copy(aParams, params);
            params.unshift(oSrc[value]);
            resultSet[value] = func.apply(null, params);
        } else {
            resultSet[value] = oSrc[value];
        }
    });
    return resultSet;
};