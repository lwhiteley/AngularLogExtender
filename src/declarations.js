        var enableGlobally = false;

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
         * This method is responsible for generating the prefix of all extended $log messages pushed to the console
         * @param {string=} className - $controller name
         * @returns {string} - formatted string
         */
        var getLogPrefix = function (/**{String=}*/className) {
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

