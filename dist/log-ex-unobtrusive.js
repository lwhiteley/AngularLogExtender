/**
 * Log Unobtrusive Extension v0.0.2-sha.4939417
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
angular.module("log.extension.uo", []).config(['$provide',
    function($provide) {
        // Register our $log decorator with AngularJS $provider
        //scroll down to the Configuration section to set the log settings
        $provide.decorator('$log', ["$delegate", "$filter",
            function($delegate, $filter) {
                /** 
                 * Encapsulates functionality to extends $log and expose functionality
                 * needed throughout the AngularJS app
                 **/
                var logEnhancerObj = function() {
                    /**
                     * checks if a variable is of @type {boolean}
                     * @param value
                     * @returns {boolean}
                     */
                    var isBoolean = function(value) {
                        return typeof value == 'boolean';
                    };

                    /**
                     * Trims whitespace at the beginning and/or end of a string
                     * returns an empty string if the value passed is not of type {string}
                     * @param value
                     * @returns {String}
                     */
                    var trimString = function(value) {
                        if (angular.isString(value))
                            return value.replace(/^\s*/, '').replace(/\s*$/, '');
                        return "";
                    };

                    /**
                     * This method checks if a variabble is of type {string}
                     * and if the string is not an empty string
                     * @param value
                     * @returns {*|Boolean|boolean}
                     */
                    var isValidString = function(value) {
                        return (angular.isString(value) && trimString(value) !== "");
                    };

                    /**
                     * processUseOverride returns true if the override flag is set.
                     * this is used to activated the override functionality.
                     * @param override
                     * @returns {}
                     */
                    var processUseOverride = function(override) {
                        return isBoolean(override);
                    };

                    /**
                     * process override only takes true or false as valid input.
                     * any other input will resolve as true.
                     * this function is used to override the global flag for displaying logs
                     * */
                    var processOverride = function(override) {
                        return override !== false;
                    };

                    /**
                     * This method is responsible for generating the prefix of
                     * all extended $log messages pushed to the console
                     * @param {string=} className
                     * @returns {string}
                     */
                    var getLogPrefix = function( /**{String=}*/ className) {
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
                     * This method checks if the global enabled flag and
                     * the override flag are set as type {boolean}
                     * variables. Once both are set it returns the
                     * value of the override flag to control $log outputs
                     * returns false as default.
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
                     * This method handles printing out a message to
                     * indicate if a $log instance is using an override
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
                     * original $log methods exposed after extended $log instance is set
                     * @type {string[]}
                     */
                    var logMethods = ['log', 'info', 'warn', 'debug', 'error'];

                    /**
                     * publicly allowed methods for the extended $log object.
                     * this give the developer the option of using special features
                     * such as setting a className and overriding log messages.
                     * More Options to come.
                     * @type {string[]}
                     */
                    var allowedMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

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
                        var resultSet = {};
                        angular.forEach(aMethods, function(value) {
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
                    /**
                     * Runs functionality for transforming the AngularJS $log
                     * returns entended $log object
                     * @param $log {Object}
                     **/
                    var enhanceLogger = function($log) {

                        /**
                         * Partial application to pre-capture a logger function
                         * @param logFn
                         * @param className
                         * @param override
                         * @param useOverride
                         * @returns {Function}
                         */
                        var prepareLogFn = function(logFn, className, override, useOverride) {
                            var enhancedLogFn = function() {
                                var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
                                if (activate) {
                                    var args = Array.prototype.slice.call(arguments);
                                    var formatMessage = getLogPrefix(className);
                                    args.unshift(formatMessage);
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
                        var _$log = createLogObj($log, logMethods);


                        /**
                         * Support to generate class-specific logger instance with/without className or override
                         *
                         * @param {string=} className Name of object in which $log.<function> calls is invoked.
                         * @param {boolean=} override activates/deactivates component level logging
                         * @returns {*} Logger instance
                         */
                        var getInstance = function( /*{string=}**/ className, /**{boolean=}*/ override) {
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


                        //declarations and functions , extensions
                        var enabled = false;

                        /** 
                         * Extends the AngularJS $log object. Tranforms native methods and add
                         * configuration methofds
                         * @param $log
                         * @param function (with transformation rules)
                         **/
                        angular.extend($log, createLogObj($log, logMethods, prepareLogFn, [null, false, false]));

                        /**
                         * Add special methods to AngularJS $log
                         * @type {getInstance}
                         */
                        $log.getInstance = getInstance;

                        /**
                         * Accepts a boolean to enable/disable logging globally for
                         * the AngularJS App
                         * @param flag {boolean}
                         */
                        $log.enableLog = function(flag) {
                            enabled = flag;
                        };

                        /**
                         * Returns true if logging is enabled or false when logging is not enabled
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
                $delegate.enableLog(true);

                if ($delegate.logEnabled()) {
                    $delegate.log("CONFIG: LOGGING ENABLED GLOBALLY");
                }
                return logEnhancer.exposeSafeLog($delegate);
            }
        ]);
    }
]);
