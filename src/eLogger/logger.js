/**
 * Partial application to pre-capture a logger function
 * @param logFn - $log instance
 * @param className - name of the $controller class
 * @param override
 * @param useOverride
 * @param colorCss
 * @param useTemplate
 * @returns {Function}
 */
var prepareLogFn = function (logFn, className, override, useOverride, useTemplate, colorCss) {
    var enhancedLogFn = function () {
        var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
        if (activate) {
            var args = Array.prototype.slice.call(arguments);
            var prefix = getLogPrefix(className);
            if(validateTemplateInputs(useTemplate, args)){
                var data = (supplant.apply(null, args));
                data = (itypeof(data) === 'string') ? [data] : data;
                args = data;
            }
            if(itypeof(colorCss) === 'string' && validateColorizeInputs(args)){
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
 * @param {*} className - Name of object in which $log.<function> calls is invoked.
 * @param {boolean=} override - activates/deactivates component level logging
 * @param {boolean=} useTemplate
 * @param {String=} colorCss
 * @returns {*} $log instance
 */
var getInstance = function (/*{*=}*/className, /*{boolean=}*/override,/*{boolean=}*/useTemplate, /*{String=}*/colorCss) {
    if (isBoolean(className)) {
        override = className;
        className = null;
    } else if (itypeof(className) === 'string') {
        className = trimString(className);
    } else {
        className = null;
    }
    var useOverride = processUseOverride(override);
    override = processOverride(override);
    printOverrideLogs(_$log, useOverride, override, className, enabled);
    return createLogObj(_$log, allowedMethods, prepareLogFn, [className, override, useOverride, useTemplate, colorCss]);
};
