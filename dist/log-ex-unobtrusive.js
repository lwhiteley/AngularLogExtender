/**
 * Log Unobtrusive Extension v0.0.7-sha.7aac651
 *
 * Used within AngularJS to enhance functionality within the AngularJS $log service.
 *
 * @original-author  Thomas Burleson
 * @contributor Layton Whiteley
 * @contributor A confused individual <ferronrsmith@gmail.com>
 * @website http://www.theSolutionOptimist.com
 * (c) 2013 https://github.com/lwhiteley/AngularLogExtender
 * License: MIT
 *
 * Modifications made by @contributor Layton Whiteley:
 * - Modified to be a full stand-alone Angular Application for reuse
 * - Has global and feature level activation/disabling for $log
 * - Created and tested with AngularJS v.1.2.3
 */
angular.module("log.ex.uo", []).provider('logEx', ['$provide',
    function($provide) {

        // Creates an injector function that can be used for retrieving services as well as for dependency injection
        var $injector = angular.injector(['ng']);

        // Used the $injector defined to retrieve the $filterProvider
        var $filter = $injector.get('$filter');

        /**
         * Used to enable logging globally
         * @type {boolean}
         */
        var enableGlobally = false;

        /**
         * Used to activate logPrefix overriding
         * @type {boolean}
         */
        var logPrefixOverride = false;

        /**
         * Used to force log-ex to use the default log prefix rules
         * @type {boolean}
         */
        var useDefaultPrefix = false;

        /**
         * Used to store custom log prefix rules
         * @type {null | Function}
         */
        var customLogPrefixFn = null;

        /**
         * current browser's user agent
         * @type {string}
         */
        var userAgent = navigator.userAgent;

        /**
         * default log methods available
         * @type {string[]}
         */
        var defaultLogMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

        /**
         * list of browsers that support colorify
         * @type {string[]}
         */
        var colorifySupportedBrowsers = ['chrome', 'firefox'];

        /**
         * flag to activate/deactivate default log method colors
         * @type {boolean}
         */
        var useDefaultColors = true;

        /**
         * default colours for each log method
         * @type {object}
         */
        var defaultLogMethodColors = {
            log: 'color: green;',
            info: 'color: blue',
            warn: 'color: #CC9933;',
            debug: 'color: brown;',
            error: 'color: red;'
        };

        /**
         * publicly allowed methods for the extended $log object.
         * this give the developer the option of using special features
         * such as setting a className and overriding log messages.
         * More Options to come.
         * @type {string[]}
         */
        var allowedMethods = defaultLogMethods;

        /**
         * Trims whitespace at the beginning and/or end of a string
         * @param {String} value - string to be trimmed
         * @returns {String} - returns an empty string if the value passed is not of type {String}
         */
        var trimString = function(value) {
            if (itypeof(value) === 'string')
                return value.replace(/^\s*/, '').replace(/\s*$/, '');
            return "";
        };

        /**
         * The itypeof operator returns a string indicating the type of the unevaluated operand.
         * @param {*} val - object to be evaluated
         * @returns {String} -  returns a string with the type of the evaluated operand
         */
        var itypeof = function(val) {
            return Object.prototype.toString.call(val).replace(/(\[|object|\s|\])/g, "").toLowerCase();
        };

        /**
         * checks if a variable is of @type {boolean}
         * @param {boolean} value - flag to be evaluated
         * @returns {boolean} - returns true if evaluated object is a boolean
         */
        var isBoolean = function(value) {
            return itypeof(value) === 'boolean';
        };

        /**
         * This method checks if a variable is of type {string}
         * and if the string is not an empty string
         * @param {string} value - string to be evaluated
         * @returns {*|Boolean|boolean} - returns true if string is not null or empty
         */
        var isValidString = function(value) {
            return (itypeof(value) === 'string' && trimString(value) !== "");
        };

        /**
         * checks if @param1 is a substring of @param2
         * @param {string} sub - partial string that may be a sub string
         * @param {string} full - full string that may have the unevaluated substring
         * @returns {boolean} - returns true if a substring is found in the ful string
         */
        var isSubString = function(sub, full) {
            if (itypeof(sub) === 'string' && itypeof(full) === 'string') {
                if (full.toLowerCase().indexOf(sub.toLowerCase()) != -1) {
                    return true;
                }
            }
            return false;
        };

        /**
         * The following method checks if useTemplate value is true and
         * if the log arguments array length is two
         * @param {boolean} useTemplate - flag that configures the usage of the template engine
         * @param {*[]} args - list of log arguments that should match pattern creating template strings
         * @returns {boolean} - returns true if log arguments match template pattern and useTemplate is set to true
         */
        var validateTemplateInputs = function(useTemplate, args) {
            return isBoolean(useTemplate) && useTemplate && args.length == 2;
        };
        /**
         * supplant is a string templating engine that replaces patterns
         * in a string with values from a template object
         * @param {string} template - string with patterns to be replaced by values
         * @param {object} values - object with values to replace in template string
         * @param {RegExp=} pattern - custom regular expression of pattern to replace in template string
         * @returns {string} - returns formatted string if template and values match the required pattern
         */
        var supplant = function(template, values, /*{RegExp=}*/ pattern) {
            var criteria1 = itypeof(template) !== 'string' && itypeof(values) !== 'object';
            var criteria2 = itypeof(template) !== 'string' || itypeof(values) !== 'object';
            if (criteria1 || criteria2) {
                return Array.prototype.slice.call(arguments);
            }

            pattern = itypeof(pattern) === 'regexp' ? pattern : /\{([^\{\}]*)\}/g;

            return template.replace(pattern, function(a, b) {
                var p = b.split('.'),
                    r = values;

                try {
                    for (var s in p) {
                        r = r[p[s]];
                    }
                } catch (e) {
                    r = a;
                }

                return (typeof r === 'string' || typeof r === 'number') ? r : a;
            });
        };

        /**
         * Checks if the current browser is a part of the supported browser list for adding colors
         * @returns {boolean} - returns true if the current browser supports colorify
         */
        var isColorifySupported = function() {
            for (var i = 0; i < colorifySupportedBrowsers.length; i++) {
                if (isSubString(colorifySupportedBrowsers[i], userAgent)) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Stores flag to know if current browser is colorify supported
         * @type {boolean}
         */
        //TODO: Need to refactor this into a self-invoking function
        var isColorifySupportedBrowser = isColorifySupported();

        /**
         * The following method checks if the log arguments array length is one and the element is a string
         * @param {*[]} args - unevaluated log method arguments array that should contain only one element of type {string}
         * @returns {boolean} - returns true if args match the above criteria
         */
        var validateColorizeInputs = function(args) {
            return (args.length == 1 &&
                itypeof(args[0]) === 'string');
        };

        /**
         * The following method does partial validation to ensure css string contains known keys
         * @param {string} css - css string to be evaluated
         * @returns {boolean} - returns true if string contains any supported keys
         */
        var containsColorCssKeys = function(css) {
            return isSubString('color', css) || isSubString('background', css) || isSubString('border', css);
        };

        /**
         * The following method does partial validation to ensure css string is valid
         * @param {string} value - css string to be evaluated
         * @returns {boolean} - returns true if string has css format
         */
        var validateColorCssString = function(value) {
            return (itypeof(value) === 'string' && isSubString(':', value) &&
                trimString(value).length > 6) && containsColorCssKeys(value);
        };

        /**
         * The following takes a string a returns an array as parameter if browser is supported
         * e.g. Expected outcome $log.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
         * @param {string} message - string to be coloured
         * @param {string} colorCSS - css string to apply to message
         * @param {string} prefix - log prefix to be prepended to message
         * @returns {*[]} - returns colorify formatted array if all inputs are valid else returns array with the original message
         */
        var colorify = function(message, colorCSS, prefix) {
            prefix = (itypeof(prefix) === 'string' ? prefix : '');
            var canProcess = isColorifySupportedBrowser && validateColorCssString(colorCSS) && itypeof(message) === 'string';
            var output = canProcess ? ('' + prefix + message) : message;
            return canProcess ? (["%c" + output, colorCSS]) : [output];
        };

        /**
         * This is the default method responsible for formatting the prefix of all extended $log messages pushed to the console
         * @see overrideLogPrefix to override the logPrefix
         * @param {string=} className - name of the component class ($controller, $service etc.)
         * @returns {string} - formatted string that will be prepended to log outputs
         */
        var defaultLogPrefixFn = function( /**{String=}*/ className) {
            var separator = " >> ",
                format = "MMM-dd-yyyy-h:mm:ssa",
                now = $filter('date')(new Date(), format);
            return "" + now + ((itypeof(className) !== 'string') ? "" : "::" + className) + separator;
        };

        /**
         * This method is responsible for generating the prefix of all extended $log messages pushed to the console
         * @param {string=} className - name of the component class ($controller, $service etc.)
         * @returns {string} - formatted string that will be prepended to log outputs
         */
        var getLogPrefix = function( /**{String=}*/ className) {
            var prefix = '';
            if ((!isBoolean(useDefaultPrefix) || !useDefaultPrefix) &&
                isBoolean(logPrefixOverride) && logPrefixOverride &&
                angular.isFunction(customLogPrefixFn)) {
                prefix = customLogPrefixFn(className);
            } else {
                prefix = defaultLogPrefixFn(className);
            }
            return prefix;
        };
        // Register our $log decorator with AngularJS $provider
        //scroll down to the Configuration section to set the log settings
        $provide.decorator('$log', ["$delegate",
            function($delegate) {
                /** 
                 * Encapsulates functionality to extends $log and expose additional functionality
                 **/
                var logEnhancerObj = function() {
                    /**
                     * processUseOverride returns true if the override flag is set.
                     * this is used to activate the override functionality.
                     * @param {boolean} override - unevaluated override flag
                     * @returns {boolean} - returns true if override is a boolean
                     */
                    var processUseOverride = function(override) {
                        return isBoolean(override);
                    };

                    /**
                     * processOverride only takes true or false as valid input.
                     * any other input will resolve as true.
                     * this function is used to override the global flag for displaying logs
                     * @param {boolean} override - unevaluated override flag
                     * @returns {boolean} - returns true if override is not equal to false
                     */
                    var processOverride = function(override) {
                        return override !== false;
                    };

                    /**
                     * The following method checks if the global enabled flag and the override flag are set as type {boolean}
                     * variables. If both are set it returns the value of the override flag to control $log outputs
                     * @param {boolean} enabled - global flag that activates/deactivates logging
                     * @param {boolean} override - flag that overrides the global enabled flag
                     * @returns {boolean} - returns override if both params are booleans else returns {boolean=} false
                     */
                    var activateLogs = function(enabled, override) {
                        if (isBoolean(enabled) && isBoolean(override)) {
                            return override;
                        }
                        return false;
                    };

                    /**
                     * The following method handles printing a message to the console indicating
                     * if a $log instance is using an override.
                     * If logging is disabled globally & an override of true is set,
                     * then a message will be displayed for the specific $log instance
                     * if logging is enabled globally & an override of false is set,
                     * then a message will be displayed for the specific $log instance
                     * @private for internal use only
                     * @param _$log - $log instance
                     * @param useOverride - flag that defines logic to regard using the override
                     * @param _override - flag that overrides the global enabled flag
                     * @param className - name of the component class ($controller, $service etc.)
                     * @param enabled - global flag that activates/deactivates logging
                     */
                    var printOverrideLogs = function(_$log, useOverride, _override, className, enabled) {
                        var instance = (isValidString(className)) ? className : "this instance";
                        if (!enabled && useOverride && _override) {
                            _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING ENABLED - $log enabled for " + instance);
                        } else if (enabled && useOverride && !_override) {
                            _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING DISABLED - $log disabled for " + instance);
                        }
                    };

                    /**
                     * Converts an array to a object literal
                     * @private for internal use only
                     * @param {*[]} arr - array to be transformed to object literal
                     * @returns {{getInstance: (exports.packets.noop|*|container.noop|noop|)}}
                     */
                    var arrToObject = function(arr) {
                        var result = {};
                        if (angular.isArray(arr)) {
                            result = {
                                getInstance: angular.noop
                            };
                            angular.forEach(arr, function(value) {
                                result[value] = angular.noop;
                            });
                        }
                        return result;
                    };

                    /**
                     * General purpose method for building $log objects.
                     * This method also provides the capability to specify the log methods to expose
                     * @private for internal use only
                     * @param {Object} oSrc - $log instance
                     * @param {Array=} aMethods - list of $log methods
                     * @param {Function=} func - function that defines rules for custom $log instance
                     * @param {Array=} aParams - parameters to be used in prepareLogFn
                     * @returns {Object} - returns a $log instance
                     */
                    var createLogObj = function(oSrc, aMethods, /**{Function=}*/ func, /**{*Array=}*/ aParams) {
                        var resultSet = {},
                            oMethods = arrToObject(aMethods);
                        angular.forEach(defaultLogMethods, function(value) {
                            var res;
                            if (angular.isDefined(aParams)) {
                                var params = [];
                                angular.copy(aParams, params);
                                params.unshift(oSrc[value]);
                                if (isColorifySupportedBrowser && useDefaultColors) {
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
                    /**
                     * Contains functionality for transforming the AngularJS $log
                     * returns extended $log object
                     * @param $log {Object} - original angular $log to be enhanced
                     **/
                    var enhanceLogger = function($log) {

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
                        var prepareLogFn = function(logFn, className, override, useOverride, useTemplate, colorCss) {
                            var enhancedLogFn = function() {
                                var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
                                if (activate) {
                                    var args = Array.prototype.slice.call(arguments);
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

                                    if (logFn) logFn.apply(null, args);
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
                        var getInstance = function( /*{*=}*/ className, /*{boolean=}*/ override, /*{boolean=}*/ useTemplate, /*{String=}*/ colorCss) {
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


                        //declarations and functions , extensions
                        /**
                         * Used to enable/disable logging
                         * @type {boolean}
                         */
                        var enabled = false;

                        /**
                         * Extends the $log object with the transformed native methods
                         * @param $log - $log instance
                         * @param {function} createLogObj -  defines transformation rules
                         **/
                        angular.extend($log, createLogObj($log, allowedMethods, prepareLogFn, [null, false, false, false, null]));

                        /**
                         * Extend the $log with the {@see getInstance} method
                         * @type {getInstance}
                         */
                        $log.getInstance = getInstance;

                        /**
                         * The following method enable/disable logging globally
                         * @param {boolean} flag - boolean flag specifying if log should be enabled/disabled
                         */
                        $log.enableLog = function(flag) {
                            enabled = flag;
                        };

                        /**
                         * The following returns the status of the {@see enabled}
                         * @returns {boolean} - returns global enabled flag
                         */
                        $log.logEnabled = function() {
                            return enabled;
                        };
                        return $log;
                    };
                    //---------------------------------------//

                    /**
                     * The following function exposes the $decorated logger to allow the defaults to be overridden
                     * @param $log - $log instance
                     * @returns {*} - returns $log instance fitted for external configurations and regular use
                     */
                    var exposeSafeLog = function($log) {
                        return createLogObj($log, allowedMethods);
                    };
                    // add public methods to logEnhancerObj
                    this.enhanceLogger = enhanceLogger;
                    this.exposeSafeLog = exposeSafeLog;
                };
                //=======================================================================//
                // Configuration Section
                //=======================================================================//
                var logEnhancer = new logEnhancerObj();
                logEnhancer.enhanceLogger($delegate);

                // ensure false is being passed for production deployments
                // set to true for local development
                $delegate.enableLog(enableGlobally);

                if ($delegate.logEnabled()) {
                    $delegate.log("CONFIG: LOGGING ENABLED GLOBALLY");
                }
                return logEnhancer.exposeSafeLog($delegate);
            }
        ]);


        // Provider functions that will be exposed to allow overriding of default $logProvider functionality

        /**
         * Used externally to enable/disable logging globally
         * @param {boolean} flag - flag that sets whether logging is enabled/disabled
         */
        var enableLogging = function(flag) {
            enableGlobally = isBoolean(flag) ? flag : false;
        };

        /**
         * Configure which log functions can be exposed at runtime
         * @param {*[]} arrMethods - list of methods that can be used
         */
        var restrictLogMethods = function(arrMethods) {
            if (angular.isArray(arrMethods)) {
                // TODO: should do validation on this to ensure valid properties are passed in
                allowedMethods = arrMethods;
            }
        };

        /**
         * Modify the default log prefix
         * @param {Function} logPrefix - function that defines the rule for a custom log prefix
         */
        var overrideLogPrefix = function(logPrefix) {
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
        var disableDefaultColors = function(flag) {
            useDefaultColors = (isBoolean(flag) && flag) ? false : true;
        };

        /**
         * Used to set a custom color to a specific $log method
         * @param {String} methodName - method name of the log method to assign a custom color
         * @param {String} colorCss - css string that defines what colour to be set for the specified log method
         */
        var setLogMethodColor = function(methodName, colorCss) {
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
        var overrideLogMethodColors = function(overrides) {
            if (itypeof(overrides) === 'object') {
                angular.forEach(overrides, function(colorCss, method) {
                    setLogMethodColor(method, colorCss);
                });
            }
        };

        /**
         * Used to force default log prefix functionality
         * @param {boolean} flag - when passed true, it forces log-ex to use the default log prefix
         */
        var useDefaultLogPrefix = function(flag) {
            if (isBoolean(flag)) {
                useDefaultPrefix = flag;
            }
        };


        /**
         * Default $get method necessary for provider to work
         * @type {Function}
         */
        this.$get = function() {
            return {
                name: 'Log Unobtrusive Extension',
                version: '0.0.7-sha.7aac651',
                enableLogging: enableLogging,
                restrictLogMethods: restrictLogMethods,
                overrideLogPrefix: overrideLogPrefix,
                disableDefaultColors: disableDefaultColors,
                setLogMethodColor: setLogMethodColor,
                overrideLogMethodColors: overrideLogMethodColors,
                useDefaultLogPrefix: useDefaultLogPrefix
            };
        };

        // add methods to $provider
        this.enableLogging = enableLogging;
        this.overrideLogPrefix = overrideLogPrefix;
        this.restrictLogMethods = restrictLogMethods;
        this.disableDefaultColors = disableDefaultColors;
        this.setLogMethodColor = setLogMethodColor;
        this.overrideLogMethodColors = overrideLogMethodColors;
        this.useDefaultLogPrefix = useDefaultLogPrefix;
    }
]);
