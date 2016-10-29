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
 * Used to enable template engine globally
 * @type {boolean}
 */
var enableTemplatesGlobally = false;

/**
 * Used to enable quiet logger enabling.
 * When this feature is enable the config message is not shown
 * @type {boolean}
 */
var enabledQuietly = false;

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
var colorifySupportedBrowsers = ['firefox', 'AppleWebKit'];

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
