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