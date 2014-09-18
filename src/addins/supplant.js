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
 * @example:
 *    for  `var template = 'i am template string - {descriptor}';`
 *         `var values = {descriptor: 'awesome'};`
 *
 *    when `var result = supplant(template, values);`
 *    then `result` will be `i am template string - awesome`
 *
 * @param {string} template - string with patterns to be replaced by values
 * @param {object} values - object with values to replace in template string
 * @param {RegExp=} pattern - custom regular expression of pattern to replace in template string
 * @returns {string|Array} - returns formatted string if template and values match the required pattern
 */
var supplant = function (template, values, /*{RegExp=}*/ pattern) {
    var criteria1 = itypeof(template) !== 'string' && itypeof(values) !== 'object';
    var criteria2 = itypeof(template) !== 'string' || itypeof(values) !== 'object';
    if (criteria1 || criteria2) {
        return Array.prototype.slice.call(arguments);
    }

    pattern = itypeof(pattern) === 'regexp' ? pattern : /\{([^\{\}]*)\}/g;

    return template.replace(pattern, function (patternToReplace, replacementKey) {
        var replacementKeyList = replacementKey.split('.'),
            replacements = values;

        try {
            angular.forEach(replacementKeyList, function (value, key) {
                replacements = replacements[replacementKeyList[key]];
            });
        } catch (e) {
            replacements = patternToReplace;
        }

        return (itypeof(replacements) === 'string' || itypeof(replacements) === 'number') ? replacements : patternToReplace;
    });
};