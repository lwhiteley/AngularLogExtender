describe('enableLogPushSerice Spec', function () {
    var tempLogPushSericeEnabled;
    beforeEach(function () {
        tempLogPushSericeEnabled = logPushSericeEnabled;
    });
    afterEach(function () {
        logPushSericeEnabled = false;
    });

    it('should not set enableLogPushSerice when flag is not of types boolean, null or undefined', function () {
        enableLogPushService([null]);
        expect(logPushSericeEnabled).toBe(false);

        enableLogPushService({});
        expect(logPushSericeEnabled).toBe(false);

        enableLogPushService(76);
        expect(logPushSericeEnabled).toBe(false);
    });

    it('should set enableLogPushSerice to true when flag is not set', function () {

        enableLogPushService();
        expect(logPushSericeEnabled).toBe(true);
    });

    it('should set enableLogPushSerice to false when false is passed as a flag', function () {
        enableLogPushService(false);
        expect(logPushSericeEnabled).toBe(false);
    });

    it('should set enableLogPushSerice to false when false is passed as a flag', function () {
        enableLogPushService(true);
        expect(logPushSericeEnabled).toBe(true);
    });
});
