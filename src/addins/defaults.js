/**
 * This is the default method responsible for formatting the prefix of all extended $log messages pushed to the console
 * @see overrideLogPrefix to override the logPrefix
 * @param {string=} className - name of the component class ($controller, $service etc.)
 * @returns {string} - formatted string that will be prepended to log outputs
 */
var defaultLogPrefixFn = function (/**{String=}*/ className) {
    var separator = " >> ",
        format = "MMM-dd-yyyy-h:mm:ssa",
        now = $filter('date')(new Date(), format);
    return "" + now + ((itypeof(className) !== 'string') ? "" : "::" + className) + separator;
};