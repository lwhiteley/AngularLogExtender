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
 * list of known keys used to style logs
 * @type {string[]}
 */
var cssKeys = ['color', 'background', 'font-size', 'border'];

/**
 * default string to put in place of filtered values
 * @type {string}
 */
var defaultFilterString = '[FILTERED]';

/**
 * default configuration for filtering values of provided keys
 * @type {object}
 */
var filterConfig = {
    filterString: defaultFilterString,
    logFilters: []
};

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
 * defaultLogPushConfig
 * @type {object}
 * @prop {Boolean} enable -  Used to enable backend log pushes
 * @prop {string} api - url to push log messages
 * @prop {number} interval - log push interval in millisecnds
 * @prop {string[]} methods - default log methods available for backend log pushing
 */
var defaultLogPushConfig = {
    interval: 3000,
    enable: false,
    api: '',
    methods: ['error']
};
 /**
* Queue of log messages to be sent via api
* @type {object[]}
*/
var logPushQueue = [];

/**
* addToLogPushQueue
* @param {string} browser - current browser
* @param {string} type - type of $log (method name)
* @param {string} message - message being logged
* @param {} cause - cause of error (if $log.error)
* @param {} exceptionName - exception name of error (if $log.error)
* @param {Error} data - exception object (if $log.error)
* @param {} stack - stack trace of error (if $log.error)
*/
var addToLogPushQueue = function(logArgs, cause, exceptionName, data, stack, type){
  if(itypeof(logArgs) === 'array'){
      var message = '[angular-logex]: ' + logArgs.toString();
      var logMessage = {
          type: type,
          message: message,
          cause: cause,
          exceptionName: exceptionName,
          data: data,
          stack: stack,
          browser: userAgent
       };
      logPushQueue.push(logMessage);
  }

};
