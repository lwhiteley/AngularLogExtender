/**
 * processUseOverride returns true if the override flag is set.
 * this is used to activate the override functionality.
 * @param {boolean} override - unevaluated override flag
 * @returns {boolean} - returns true if override is a boolean
 */
var processUseOverride = function (override) {
    return isBoolean(override);
};

/**
 * processOverride only takes true or false as valid input.
 * any other input will resolve as true.
 * this function is used to override the global flag for displaying logs
 * @param {boolean} override - unevaluated override flag
 * @returns {boolean} - returns true if override is not equal to false
 */
var processOverride = function (override) {
    return override !== false;
};

/**
 * This method checks if the global enabled flag and the override flag are set as type {boolean}
 * variables. If both are set it returns the value of the override flag to control $log outputs
 * @param {boolean} enabled - global flag that activates/deactivates logging
 * @param {boolean} override - flag that overrides the global enabled flag
 * @returns {boolean} - returns override if both params are booleans else returns {boolean=} false
 */
var activateLogs = function (enabled, override) {
    if(isBoolean(enabled) && isBoolean(override)) {
        return override;
    }
    return false;
};

/**
 * This method handles printing out a message to indicate if a $log instance is using an override
 * if logging is disabled globally & an override of true is set,
 * then a message will be displayed for the specific $log instance
 * if logging is enabled globally & an override of false is set,
 * then a message will be displayed for the specific $log instance
 * @param _$log - $log instance
 * @param useOverride - flag that defines logic to regard using the override
 * @param _override - flag that overrides the global enabled flag
 * @param className - name of the component class ($controller, $service etc.)
 * @param enabled - global flag that activates/deactivates logging
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
 * Converts an array to a object literal
 * @param {*[]} arr - array to be transformed to object literal
 * @returns {{getInstance: (exports.packets.noop|*|container.noop|noop|)}}
 */
var arrToObject = function (arr) {
    var result = {};
    if(angular.isArray(arr)) {
        result = { getInstance:angular.noop };
        angular.forEach(arr, function(value) {
            result[value] = angular.noop;
        });
    }
    return result;
};

/**
 * This generic method builds $log objects for different uses around the module
 * and AngularJS app. It gives the capability to specify which methods to expose
 * when using the $log object in different sections of the app.
 * @param {Object} oSrc - $log instance
 * @param {Array=} aMethods - list of $log methods
 * @param {Function=} func - function that defines rules for custom $log instance
 * @param {Array=} aParams - parameters to be used in prepareLogFn
 * @returns {*{}} - returns a $log instance
 */
var createLogObj = function(oSrc, aMethods, /**{Function=}*/func, /**{*Array=}*/aParams) {
    var resultSet = {},
        oMethods = arrToObject(aMethods);
    angular.forEach(defaultLogMethods, function (value) {
        var res;
        if (angular.isDefined(aParams)) {
            var params = [];
            angular.copy(aParams, params);
            params.unshift(oSrc[value]);
            if(isColorifySupportedBrowser && useDefaultColors) {
                params[5] = validateColorCssString(params[5]) ? params[5] : defaultLogMethodColors[value];
            }
            res = func.apply(null, params);
        } else {
            res = oSrc[value];
        }
        resultSet[value] = angular.isUndefined(oMethods[value]) ? angular.noop : res;
    });
    return resultSet;
};