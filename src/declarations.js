        // Creates an injector function that can be used for retrieving services as well as for dependency injection
        var $injector = angular.injector([ 'ng' ]);

        // Used the $injector defined to retrieve the $filterProvider
        var $filter = $injector.get( '$filter' );

        // used to enable logging globally
        var enableGlobally = false;

        // current browser user agent
        var userAgent = navigator.userAgent;

        // default log methods available
        var defaultLogMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];
       
        // list of browsers that support colorify
        var colorifySupportedBrowsers = ['chrome', 'firefox'];  

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
        var trimString = function (value) {
            if (angular.isString(value))
                return value.replace(/^\s*/, '').replace(/\s*$/, '');
            return "";
        };

        /**
        * Return a string value with the object type passed in as a param
        * @param val {*}
        **/
        var itypeof = function (val) {
            return Object.prototype.toString.call(val).replace(/(\[|object|\s|\])/g,"").toLowerCase();
        };

        /**
         * checks if a variable is of @type {boolean}
         * @param value
         * @returns {boolean}
         */
        var isBoolean = function (value) {
            return typeof value == 'boolean';
        };
        /**
         * This method checks if a variable is of type {string}
         * and if the string is not an empty string
         * @param value
         * @returns {*|Boolean|boolean}
         */
        var isValidString = function (value) {
            return (angular.isString(value) && trimString(value) !== "");
        };

       /**
       * checks if @param1 is a substring of @param2
       * @param sub 
       * @param full 
       **/
       var isSubString = function(sub, full){
           if(angular.isString(sub) && angular.isString(full)){
              if(full.toLowerCase().indexOf(sub.toLowerCase()) != -1){
                  return true;
              } 
           }
           return false;
        };

       /**
       * checks if the browsr is a part of the supported browser list
       * @param userAgent 
       **/
       var isColorifySupported = function(){
           for (var i=0; i < colorifySupportedBrowsers.length; i++){ 
               if(isSubString(colorifySupportedBrowsers[i], userAgent)){
                  return true;
               }
            }
           return false;
        };

        /**
       * takes a string a returns an array as parameters
       * if browser is supported
       * expected outcome $log.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
       * @param message 
       * @param colorCSS 
       **/
        var colorify  = function( message, colorCSS ){
            var isSupported   = isColorifySupported(navigator.userAgent),
                canProcess = isSupported && angular.isString(colorCSS) && isSubString(':', colorCSS) && angular.isString(message);
            return canProcess ? ( ["%c" + message, colorCSS] ) :  [message] ;
        };

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

