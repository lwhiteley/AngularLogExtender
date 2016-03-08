//---------------------------------------//

/**
 * The following function exposes the $decorated logger to allow the defaults to be overridden
 * @param $log - $log instance
 * @returns {*} - returns $log instance fitted for external configurations and regular use
 */
var exposeSafeLog = function ($log) {
  return createLogObj($log, allowedMethods);
};
