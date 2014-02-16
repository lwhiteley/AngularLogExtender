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

            //TODO: Log push config properties could be an onject literal
           /**
           * Used to enable backend log pushes
           * @type {Boolean}
           */
          var logPushSericeEnabled = false;

           /**
           * api to push log messages
           * @type {string}
           */
          var logPushApi = '';

           /**
           * log push interval
           * @type {number} in millisecnds
           */
          var logPushInterval = 3000;

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
           * default log methods available for backend log pushing
           * @type {string[]}
           */
          var defaultLogPushMethods = ['error'];

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
           * list of known keys used to style logs
           * @type {string[]}
           */
          var cssKeys = ['color', 'background', 'font-size', 'border'];

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
          var trimString = function (value) {
              if (itypeof(value) === 'string')
                  return value.replace(/^\s*/, '').replace(/\s*$/, '');
              return "";
          };

          /**
           * The itypeof operator returns a string indicating the type of the unevaluated operand.
           * @param {*} val - object to be evaluated
           * @returns {String} -  returns a string with the type of the evaluated operand
           */
          var itypeof = function (val) {
              return Object.prototype.toString.call(val).replace(/(\[|object|\s|\])/g, "").toLowerCase();
          };

          /**
           * checks if a variable is of @type {boolean}
           * @param {boolean} value - flag to be evaluated
           * @returns {boolean} - returns true if evaluated object is a boolean
           */
          var isBoolean = function (value) {
              return itypeof(value) === 'boolean';
          };

          /**
           * This method checks if a variable is of type {string}
           * and if the string is not an empty string
           * @param {string} value - string to be evaluated
           * @returns {*|Boolean|boolean} - returns true if string is not null or empty
           */
          var isValidString = function (value) {
              return (itypeof(value) === 'string' && trimString(value) !== "");
          };

          /**
           * checks if @param1 is a substring of @param2
           * @param {string} sub - partial string that may be a sub string
           * @param {string} full - full string that may have the unevaluated substring
           * @returns {boolean} - returns true if a substring is found in the ful string
           */
          var isSubString = function (sub, full) {
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
          var validateTemplateInputs = function (useTemplate, args) {
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
          var supplant = function (template, values, /*{RegExp=}*/ pattern) {
              var criteria1 = itypeof(template) !== 'string' && itypeof(values) !== 'object';
              var criteria2 = itypeof(template) !== 'string' || itypeof(values) !== 'object';
              if (criteria1 || criteria2) {
                  return Array.prototype.slice.call(arguments);
              }

              pattern = itypeof(pattern) === 'regexp' ? pattern : /\{([^\{\}]*)\}/g;

              return template.replace(pattern, function (a, b) {
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
          var isColorifySupported = function () {
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
          var validateColorizeInputs = function (args) {
              return (args.length == 1 &&
                  itypeof(args[0]) === 'string');
          };

           /**
           * The following method does partial validation to ensure css string contains known keys
           * @param {string} css - css string to be evaluated
           * @returns {boolean} - returns true if string contains any supported keys
           */
            var containsColorCssKeys = function(css){
                for(var x = 0; x < cssKeys.length; x++){
                    if(isSubString(cssKeys[x], css)){
                        return true;
                    }
                }
                return false;
            };

          /**
           * The following method does partial validation to ensure css string is valid
           * @param {string} value - css string to be evaluated
           * @returns {boolean} - returns true if string has css format
           */
          var validateColorCssString = function (value) {
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
          var colorify = function (message, colorCSS, prefix) {
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
          var defaultLogPrefixFn = function ( /**{String=}*/ className) {
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
            if((!isBoolean(useDefaultPrefix) || !useDefaultPrefix) &&
                isBoolean(logPrefixOverride) && logPrefixOverride &&
                angular.isFunction(customLogPrefixFn)){
                prefix = customLogPrefixFn(className);
            }else{
                prefix = defaultLogPrefixFn(className);
            }
            return prefix;
        };