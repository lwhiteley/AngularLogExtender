/**
 * Log Extension Unobtrusive
 * v.0.0.2
 *
 * Used within AngularJS to enhance functionality within the AngularJS $log service.
 *
 * @original-author  Thomas Burleson
 * @website http://www.theSolutionOptimist.com
 *
 * Modifications made by @author Layton Whiteley:
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
                var logEnhancerObj = function() {
                    //declarations and functions , extensions
                    var enabled = false;

                    var isBoolean = function(value) {
                        return typeof value == 'boolean';
                    };
                    var trimString = function(value) {
                        if (angular.isString(value))
                            return value.replace(/^\s*/, '').replace(/\s*$/, '');
                    };
                    var isValidString = function(value) {
                        return (angular.isString(value) && trimString(value) !== "");
                    };
                    /**
                     * processUseOverride returns true if the override flag is set.
                     * this is used to activated the override functionality.
                     * */
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

                    var getLogPrefix = function(className) {
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

                    var activateLogs = function(enabled, override) {
                        if (isBoolean(enabled) && override) return true;
                        if (isBoolean(enabled) && !override) return false;
                        return false;
                    };


                    var printOverrideLogs = function(_$log, useOverride, _override, className, enabled) {
                        var instance = (isValidString(className)) ? className : "this instance";
                        if (!enabled && useOverride && _override) {
                            _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING ENABLED - $log enabled for " + instance);
                        } else if (enabled && useOverride && !_override) {
                            _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING DISABLED - $log disabled for " + instance);
                        }
                    };

                    var logMethods = ['log', 'info', 'warn', 'debug', 'error'];

                    var allowedMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

                    var createLobObj = function(oSrc, aMethods, func, aParams) {
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
                    var enhanceLogger = function($log) {


                        // var separator = " >> ";
                        //original methods
                        /**
                         * Partial application to pre-capture a logger function
                         */
                        var prepareLogFn = function(logFn, className, override, useOverride) {
                            var enhancedLogFn = function() {
                                var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
                                if (activate) {
                                    var args = Array.prototype.slice.call(arguments);
                                    var formatMessage = getLogPrefix(className);
                                    args.unshift(formatMessage);
                                    logFn.apply(null, args);
                                }
                            };

                            // Only needed to support angular-mocks expectations
                            enhancedLogFn.logs = [];
                            return enhancedLogFn;
                        };

                        /**
                         * Capture the original $log functions; for use in enhancedLogFn()
                         */
                        var _$log = createLobObj($log, logMethods);

                        /**
                         * Support to generate class-specific logger instance with/without classname or override
                         *
                         * @param className Name of object in which $log.<function> calls is invoked.
                         * @param override activates/deactivates component level logging
                         *
                         * @returns {*} Logger instance
                         */
                        var getInstance = function(className, override) {
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
                            return createLobObj(_$log, logMethods, prepareLogFn, [className, override, useOverride]);
                        };

                        angular.extend($log, createLobObj($log, logMethods, prepareLogFn, [null, false, false]));

                        // Add special methods to AngularJS $log
                        $log.getInstance = getInstance;


                        $log.setGlobalDebugFlag = function(flag) {
                            enabled = flag;
                        };

                        /**
                         * returns true if debugging is enabled or false when debugging is not enabled
                         * @author : layton
                         */
                        $log.isEnabled = function() {
                            return enabled;
                        };
                        return $log;
                    };
                    //---------------------------------------//

                    //added by layton
                    var exposeSafeLog = function($log) {
                        return createLobObj($log, allowedMethods);
                    };
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
                $delegate.setGlobalDebugFlag(true);

                if ($delegate.isEnabled()) {
                    $delegate.log("CONFIG: LOGGING ENABLED GLOBALLY");
                }
                return logEnhancer.exposeSafeLog($delegate);
            }
        ]);
    }
]);
