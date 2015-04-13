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
	return (args.length === 1 &&
	itypeof(args[0]) === 'string');
};

/**
 * The following method does partial validation to ensure css string contains known keys
 * @param {string} css - css string to be evaluated
 * @returns {boolean} - returns true if string contains any supported keys
 */
var containsColorCssKeys = function (css) {
	for (var x = 0; x < cssKeys.length; x++) {
		if (isSubString(cssKeys[x], css)) {
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
