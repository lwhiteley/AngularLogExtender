/**
 * Partial application to pre-capture a logger function
 * @param logFn     - $log instance
 * @param className - name of the $controller class
 * @param override
 * @param useOverride
 * @param colorCss
 * @param activateTemplate
 * @returns {Function}
 */
var prepareLogFn = function (logFn, className, override, useOverride, colorCss, useTemplate) {
    var enhancedLogFn = function () {
        var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
        if (activate) {
            var args = Array.prototype.slice.call(arguments);
            var prefix = getLogPrefix(className);
            if(canTemplate(useTemplate, args)){
                var data = (supplant.apply(null, args));
                data = angular.isString(data) ? [data] : data;
                args = data;
            }
            if(angular.isString(colorCss) && canColorize(args)){
                args = colorify(args[0], colorCss, prefix) ; 
            }else{  
                args.unshift(prefix);
            }
                
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
var _$log = createLogObj($log, allowedMethods);

/**
 * Support to generate class-specific logger instance with/without className or override
 * @param {string=} className - Name of object in which $log.<function> calls is invoked.
 * @param {boolean=} override - activates/deactivates component level logging
 * @returns {*} $log instance
 */
var getInstance = function (/*{string=}*/className, /*{boolean=}*/override, /*{string=}*/colorCss, /*{boolean=}*/useTemplate) {
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
    return createLogObj(_$log, allowedMethods, prepareLogFn, [className, override, useOverride, colorCss, useTemplate]);
};
