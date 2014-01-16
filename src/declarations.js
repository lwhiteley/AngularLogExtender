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

        
        var canTemplate = function(useTemplate, args){
            return isBoolean(useTemplate) && useTemplate && args.length == 2; 
        };
        /**
       * supplant is a string templating engine that replaces patterns 
       * in a string with values from a template object
       * @param template 
       * @param values 
       * @param pattern
       **/
        var supplant =  function( template, values, pattern ) {
            var criteria1 = itypeof(template) !== 'string' && itypeof(values) !== 'object';
            var criteria2 = itypeof(template) !== 'string' || itypeof(values) !== 'object';
            if(criteria1 || criteria2) {
                return  Array.prototype.slice.call(arguments);
            }
        
            pattern = pattern || /\{([^\{\}]*)\}/g;
        
            return template.replace(pattern, function(a, b) {
                var p = b.split('.'),
                    r = values;
        
                try {
                    for (var s in p) {
                        r = r[p[s]];
                    }
                } catch(e){
                    r = a;
                }
        
                return (typeof r === 'string' || typeof r === 'number') ? r : a;
            });
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

        var canColorize = function(args){
            
            return (args.length == 1 && 
                        angular.isString(args[0]));
        };

        /**
       * takes a string a returns an array as parameters
       * if browser is supported
       * expected outcome $log.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
       * @param message 
       * @param colorCSS 
       **/
        var colorify  = function( message, colorCSS, prefix ){
            prefix = (angular.isString(prefix) ? prefix : '') ;
            var isSupported   = isColorifySupported(),
                canProcess = isSupported && angular.isString(colorCSS) && isSubString(':', colorCSS) && angular.isString(message);
            var output = canProcess ? ('' + prefix + message) : message;
            return canProcess ? ( ["%c" + output, colorCSS] ) :  [output] ;
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
            return "" + now + ( !angular.isString(className) ? "" : "::" + className) + separator;
        };

