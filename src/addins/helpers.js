/**
 * The itypeof operator returns a string indicating the type of the unevaluated operand.
 * @param {*} val - object to be evaluated
 * @returns {String} -  returns a string with the type of the evaluated operand
 */
var itypeof = function (val) {
    return Object.prototype.toString.call(val).replace(/(\[|object|\s|\])/g, "").toLowerCase();
};

/**
 * Evaluates an object to verify it is of type `object` or `array`
 * @param {*} value - an object to be evaluated
 * @returns boolean - returns true if parameter is of type object or array
 */
var isObjectOrArray = function (value) {
    return (/(object|array)/.test(itypeof(value)));
};

/**
 * Trims whitespace at the beginning and/or end of a string
 * @param {String} value - string to be trimmed
 * @returns {String} - returns an empty string if the value passed is not of type {String}
 */
var trimString = function (value) {
    if (itypeof(value) === 'string') {
        return value.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    return "";
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
        if (full.toLowerCase().indexOf(sub.toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
};

/**
 * This method is responsible for generating the prefix of all extended $log messages pushed to the console
 * @param {string=} className - name of the component class ($controller, $service etc.)
 * @returns {string} - formatted string that will be prepended to log outputs
 */
var getLogPrefix = function (/**{String=}*/ className) {
    var prefix = '';
    if (!useDefaultPrefix && logPrefixOverride) {
        prefix = customLogPrefixFn(className);
    } else {
        prefix = defaultLogPrefixFn(className);
    }
    return prefix;
};
