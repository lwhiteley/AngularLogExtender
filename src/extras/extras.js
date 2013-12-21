//---------------------------------------//

//added by layton
var exposeSafeLog = function ($log) {
    return createLobObj($log, allowedMethods);
};