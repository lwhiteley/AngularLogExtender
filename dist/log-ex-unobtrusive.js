/**
 * Log Unobtrusive Extension v0.0.6-sha.9e8db3b
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

        // used to enable logging globally
        var enableGlobally = false;

        // current browser user agent
        var userAgent = navigator.userAgent;

        // default log methods available
        var defaultLogMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

        // list of browsers that support colorify
        var colorifySupportedBrowsers = ['chrome', 'firefox'];

        // flag to activate/deactivate default log method colors
        var useDefaultColors = true;

        // default colours for each log method
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
         * @param value - string to be trimmed
         * @returns {String} - returns an empty string if the value passed is not of type {String}
         */
        var trimString = function(value) {
            if (itypeof(value) === 'string')
                return value.replace(/^\s*/, '').replace(/\s*$/, '');
            return "";
        };

        /**
         * The itypeof operator returns a string indicating the type of the unevaluated operand.
         * @param val {*}
         **/
        var itypeof = function(val) {
            return Object.prototype.toString.call(val).replace(/(\[|object|\s|\])/g, "").toLowerCase();
        };

        /**
         * checks if a variable is of @type {boolean}
         * @param value
         * @returns {boolean}
         */
        var isBoolean = function(value) {
            return itypeof(value) === 'boolean';
        };
        /**
         * This method checks if a variable is of type {string}
         * and if the string is not an empty string
         * @param value
         * @returns {*|Boolean|boolean}
         */
        var isValidString = function(value) {
            return (itypeof(value) === 'string' && trimString(value) !== "");
        };


        /**
         * checks if @param1 is a substring of @param2
         * @param sub
         * @param full
         * @returns {boolean}
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
         * this method checks if useTemplate is truthy and
         * if the log arguments array is equal to 2
         * @param useTemplate
         * @param args
         */
        var validateTemplateInputs = function(useTemplate, args) {
            return isBoolean(useTemplate) && useTemplate && args.length == 2;
        };
        /**
         * supplant is a string templating engine that replaces patterns
         * in a string with values from a template object
         * @param template
         * @param values
         * @param {RegExp=} pattern
         **/
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
         * checks if the browser is a part of the supported browser list
         * @returns {boolean}
         */
        var isColorifySupported = function() {
            for (var i = 0; i < colorifySupportedBrowsers.length; i++) {
                if (isSubString(colorifySupportedBrowsers[i], userAgent)) {
                    return true;
                }
            }
            return false;
        };

        // stores flag to know if current browser is colorify supported
        var isColorifySupportedBrowser = isColorifySupported();


        /**
         * checks if the log arguments array is of length 1 and the element is a string
         * @param args
         * @returns {boolean}
         */
        var validateColorizeInputs = function(args) {
            return (args.length == 1 &&
                itypeof(args[0]) === 'string');
        };

        /**
         * does minor validation to ensure css string is valid
         * @param value
         * @returns {boolean}
         */
        var validateColorCssString = function(value) {
            return (itypeof(value) === 'string' && isSubString(':', value));
        };

        /**
         * takes a string a returns an array as parameters
         * if browser is supported
         * expected outcome $log.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
         * @param message
         * @param colorCSS
         * @param prefix
         * @returns {*[]}
         */
        var colorify = function(message, colorCSS, prefix) {
            prefix = (itypeof(prefix) === 'string' ? prefix : '');
            var canProcess = isColorifySupportedBrowser && validateColorCssString(colorCSS) && itypeof(message) === 'string';
            var output = canProcess ? ('' + prefix + message) : message;
            return canProcess ? (["%c" + output, colorCSS]) : [output];
        };

        /**
         * This method is responsible for generating the prefix of all extended $log messages pushed to the console
         * @param {string=} className - $controller name
         * @returns {string} - formatted string
         */
        var getLogPrefix = function( /**{String=}*/ className) {
            var separator = " >> ",
                format = "MMM-dd-yyyy-h:mm:ssa",
                now = $filter('date')(new Date(), format);
            return "" + now + ((itypeof(className) !== 'string') ? "" : "::" + className) + separator;
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
                     * @param override
                     * @returns {}
                     */
                    var processUseOverride = function(override) {
                        return isBoolean(override);
                    };

                    /**
                     * processOverride only takes true or false as valid input.
                     * any other input will resolve as true.
                     * this function is used to override the global flag for displaying logs
                     * */
                    var processOverride = function(override) {
                        return override !== false;
                    };

                    /**
                     * This method checks if the global enabled flag and the override flag are set as type {boolean}
                     * variables. If both are set it returns the value of the override flag to control $log outputs
                     * @param {boolean} enabled
                     * @param {boolean} override
                     * @returns {boolean}
                     */
                    var activateLogs = function(enabled, override) {
                        if (isBoolean(enabled) && isBoolean(override)) {
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
                     * @param arr
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
                     * This generic method builds $log objects for different uses around the module
                     * and AngularJS app. It gives the capability to specify which methods to expose
                     * when using the $log object in different sections of the app.
                     * @param {Object} oSrc
                     * @param {Array=} aMethods
                     * @param {Function=} func
                     * @param {Array=} aParams
                     * @returns {{}}
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
                     * @param $log {Object}
                     **/
                    var enhanceLogger = function($log) {

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
                         * @param {boolean=} useTemplate
                         * @param {String=} colorCss
                         * @returns {*} $log instance
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
                        var enabled = false;

                        /** 
                         * Extends the $log object with the transformed native methods
                         * @param $log
                         * @param function (with transformation rules)
                         **/
                        angular.extend($log, createLogObj($log, allowedMethods, prepareLogFn, [null, false, false, false, null]));

                        /**
                         * Extend the $log with the {@see getInstance} method
                         * @type {getInstance}
                         */
                        $log.getInstance = getInstance;

                        /**
                         * The following method enable/disable logging globally
                         * @param flag {boolean} - boolean flag specifying if log should be enabled/disabled
                         */
                        $log.enableLog = function(flag) {
                            enabled = flag;
                        };

                        /**
                         * The following returns the status of the {@see enabled}
                         * @returns {boolean}
                         */
                        $log.logEnabled = function() {
                            return enabled;
                        };
                        return $log;
                    };
                    //---------------------------------------//

                    /**
                     * The following function exposes the $decorated logger to allow the defaults to be overridden
                     * @param $log
                     * @returns {*}
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

        var enableLogging = function(flag) {
            enableGlobally = isBoolean(flag) ? flag : false;
        };

        var restrictLogMethods = function(arrMethods) {
            if (angular.isArray(arrMethods)) {
                // TODO: should do validation on this to ensure valid properties are passed in
                allowedMethods = arrMethods;
            }
        };

        var overrideLogPrefix = function(logPrefix) {
            if (angular.isFunction(logPrefix)) {
                // TODO : Validation of the function to ensure it's of the correct format etc
                // TODO : Might want to allow memoization of the default functionality and allow easy toggling of custom vs default
                getLogPrefix = logPrefix;
            }
        };

        var disableDefaultColors = function(flag) {
            useDefaultColors = (isBoolean(flag) && flag) ? false : true;
        };

        var setLogMethodColor = function(methodName, colorCss) {
            if (itypeof(methodName) === 'string' &&
                defaultLogMethodColors.hasOwnProperty(methodName) &&
                validateColorCssString(colorCss)) {

                defaultLogMethodColors[methodName] = colorCss;
            }
        };

        /**
         * default $get method necessary for provider to work
         * not sure what to do with this yet
         **/
        this.$get = function() {
            return {
                name: 'Log Unobtrusive Extension',
                version: '0.0.6-sha.9e8db3b',
                enableLogging: enableLogging,
                restrictLogMethods: restrictLogMethods,
                overrideLogPrefix: overrideLogPrefix,
                disableDefaultColors: disableDefaultColors,
                setLogMethodColor: setLogMethodColor
            };
        };

        /**
         * used externally to enable/disable logging globally
         * @param flag {boolean}
         **/
        this.enableLogging = enableLogging;

        /**
         * Modify the default log prefix
         **/
        this.overrideLogPrefix = overrideLogPrefix;

        /**
         * Configure which log functions can be exposed at runtime
         */
        this.restrictLogMethods = restrictLogMethods;

        /**
         * Turns off default coloring of logs
         */
        this.disableDefaultColors = disableDefaultColors;

        /**
         * Used to set a custom color to a specific $log method
         * @param methodName
         * @param colorCss
         */
        this.setLogMethodColor = setLogMethodColor;

    }
]);
