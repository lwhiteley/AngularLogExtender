/**
 * Partial application to pre-capture a logger function
 * @param {Function} logFn - $log method
 * @param {*} className - name of the component class ($controller, $service etc.)
 * @param {boolean} override - flag that overrides the global enable flag
 * @param {boolean} useOverride - flag that defines logic to consider using the override
 * @param {string} colorCss - css styles for coloring log methods
 * @param {boolean} useTemplate - enables/disables the template engine
 * @returns {Function} - returns function with specific rules for a log metod
 */
var prepareLogFn = function (logFn, className, override, useOverride, useTemplate, colorCss) {
	var enhancedLogFn = function () {
		var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
		if (activate) {
			var args = Array.prototype.slice.call(arguments);
			// perform filter of sensitive values within objects and arrays
			// if at least one filter key is available
			if (filterConfig.logFilters.length > 0) {
				args = filterSensitiveValues(args);
			}
			var prefix = getLogPrefix(className);
			if (validateTemplateInputs(useTemplate, args)) {
				var data = (supplant.apply(null, args));
				data = (itypeof(data) === 'string') ? [data] : data;
				args = data;
			}
			if (itypeof(colorCss) === 'string' && validateColorizeInputs(args)) {
				args = colorify(args[0], colorCss, prefix);
			} else {
				args.unshift(prefix);
			}

			if (logFn) {
				logFn.apply(null, args);
			}
		}
	};

	// Only needed to support angular-mocks expectations
	enhancedLogFn.logs = [];
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
 * @param {boolean=} useTemplate - enables/disables the template engine
 * @param {String=} colorCss - css styles for coloring log methods
 * @returns {*} $log instance - returns a custom log instance
 */
var getInstance = function (/*{*=}*/className, /*{boolean=}*/override, /*{boolean=}*/useTemplate, /*{String=}*/colorCss) {
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
