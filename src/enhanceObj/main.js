/**
 * checks if a variable is of @type {boolean}
 * @param value
 * @returns {boolean}
 */
var isBoolean = function (value) {
    return typeof value == 'boolean';
};

/**
 * Trims whitespace at the beginning and/or end of a string
 * @param value - string to be trimmed
 * @returns {String} - returns an empty string if the value passed is not of type {String}
 */
var trimString = function (value) {
    if (angular.isString(value))
        return value.replace(/^\s*/, '').replace(/\s*$/, '');
    return "";
};

/**
 * This method checks if a variable is of type {string}
 * and if the string is not an empty string
 * @param value
 * @returns {*|Boolean|boolean}
 */
var isValidString = function (value) {
    return (angular.isString(value) && trimString(value) !== "");
};

/**
 * processUseOverride returns true if the override flag is set.
 * this is used to activate the override functionality.
 * @param override
 * @returns {}
 */
var processUseOverride = function (override) {
    return isBoolean(override);
};

/**
 * processOverride only takes true or false as valid input.
 * any other input will resolve as true.
 * this function is used to override the global flag for displaying logs
 * */
var processOverride = function (override) {
    return override !== false;
};

/**
 * This method checks if the global enabled flag and the override flag are set as type {boolean}
 * variables. If both are set it returns the value of the override flag to control $log outputs
 * @param {boolean} enabled
 * @param {boolean} override
 * @returns {boolean}
 */
var activateLogs = function (enabled, override) {
    if(isBoolean(enabled) && isBoolean(override)){
        return override;
    }
    return false;
};

/**
 * This method handles printing out a message to indicate if a $log instance is using an override
 * if logging is disabled globally & an override of true is set,
 *  then a message will be displayed for the specific $log instance
 * if logging is enabled globally & an override of false is set,
 *  then a message will be displayed for the specific $log instance
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
 * This generic method builds $log objects for different uses around the module 
 * and AngularJS app. It gives the capability to specify which methods to expose
 * when using the $log object in different sections of the app.
 * @param {Object} oSrc
 * @param {Array=} aMethods
 * @param {Function=} func
 * @param {Array=} aParams
 * @returns {{}}
 */
var createLogObj = function(oSrc, aMethods, /**{Function=}*/func, /**{*Array=}*/aParams) {
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