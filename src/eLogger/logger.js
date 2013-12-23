/**
 * Partial application to pre-capture a logger function
 * @param logFn
 * @param className
 * @param override
 * @param useOverride
 * @returns {Function}
 */
var prepareLogFn = function (logFn, className, override, useOverride) {
    var enhancedLogFn = function () {
        var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
        if (activate) {
            var args = Array.prototype.slice.call(arguments);
            var formatMessage = getLogPrefix(className);
            args.unshift(formatMessage);
            if(logFn) logFn.apply(null, args);
        }
    };

    // Only needed to support angular-mocks expectations
    enhancedLogFn.logs = [ ];
    return enhancedLogFn;
};

/**
 * Capture the original $log functions; for use in enhancedLogFn()
 * @type {*}
 * @private
 */
var _$log = createLogObj($log, logMethods);


/**
 * Support to generate class-specific logger instance with/without className or override
 *
 * @param {string=} className Name of object in which $log.<function> calls is invoked.
 * @param {boolean=} override activates/deactivates component level logging
 * @returns {*} Logger instance
 */
var getInstance = function (/*{string=}**/className, /**{boolean=}*/override) {
    if (isBoolean(className)) {
        override = className;
        className = null;
    } else if (angular.isString(className)) {
        className = trimString(className);
    } else {
        className = null;
    }
    var useOverride = processUseOverride(override);
    override = processOverride(override);
    printOverrideLogs(_$log, useOverride, override, className, enabled);
    return createLogObj(_$log, logMethods, prepareLogFn, [className, override, useOverride]);
};
