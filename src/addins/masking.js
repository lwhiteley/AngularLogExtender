/**
 * Evaluates an array of log arguments to be filtered using the provided or default filter keys
 * @param {[] | Object} logArguments - array to be processed
 * @returns {[] | Object} - returns a processed array with configured filter values replaced by filterString
 */
var filterSensitiveValues = function (logArguments) {
	if (isObjectOrArray(logArguments) && filterConfig.logFilters.length > 0) {
		angular.forEach(logArguments, function (logValue, logKey) {
			angular.forEach(filterConfig.logFilters, function (filterValue) {
				// replace filtered values here
				if (itypeof(logValue) === 'object' &&
					logValue.hasOwnProperty(filterValue) && !isObjectOrArray(logValue[filterValue])) {
					logValue[filterValue] = filterConfig.filterString;
				} else if (isObjectOrArray(logValue)) {
					logArguments[logKey] = filterSensitiveValues(logValue);
				}
			});
		});
		return logArguments;
	}
	return logArguments;
};
