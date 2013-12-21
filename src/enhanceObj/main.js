
            //declarations and functions , extensions
            var enabled = false;

            var isBoolean = function (value) {
                return typeof value == 'boolean';
            };
            var trimString = function (value) {
                if (angular.isString(value))
                    return value.replace(/^\s*/, '').replace(/\s*$/, '');
            };
            var isValidString = function (value) {
                return (angular.isString(value) && trimString(value) !== "");
            };
            /**
             * processUseOverride returns true if the override flag is set.
             * this is used to activated the override functionality.
             * */
            var processUseOverride = function (override) {
                return isBoolean(override);
            };
            /**
             * process override only takes true or false as valid input.
             * any other input will resolve as true.
             * this function is used to override the global flag for displaying logs
             * */
            var processOverride = function (override) {
                return override !== false;
            };

            var getLogPrefix = function (className) {
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

            var activateLogs = function (enabled, override) {
                if (isBoolean(enabled) && override)  return true;
                if (isBoolean(enabled) && !override) return false;
                return false;
            };


            var printOverrideLogs = function (_$log, useOverride, _override, className, enabled) {
                var instance = (isValidString(className)) ? className : "this instance";
                if (!enabled && useOverride && _override) {
                    _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING ENABLED - $log enabled for " + instance);
                } else if (enabled && useOverride && !_override) {
                    _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING DISABLED - $log disabled for " + instance);
                }
            };

            var logMethods = ['log', 'info', 'warn', 'debug', 'error'];

            var allowedMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

            var createLobObj = function (oSrc, aMethods, func, aParams) {
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