//---------------------------------------//

/**
 * The following function exposes the $decorated logger to allow the defaults to be overriden
 * @param $log
 * @returns {*}
 */
var exposeSafeLog = function ($log) {
    return createLobObj($log, allowedMethods);
};