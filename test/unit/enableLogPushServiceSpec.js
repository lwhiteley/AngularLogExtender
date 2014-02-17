describe('enableLogPushSerice Spec', function () {
    var templogPushServiceEnabled;
    beforeEach(function () {
        templogPushServiceEnabled = logPushServiceEnabled;
    });
    afterEach(function () {
        logPushServiceEnabled = false;
    });

    it('should not set enableLogPushSerice when flag is not of types boolean, null or undefined', function () {
        enableLogPushService([null]);
        expect(logPushServiceEnabled).toBe(false);

        enableLogPushService({});
        expect(logPushServiceEnabled).toBe(false);

        enableLogPushService(76);
        expect(logPushServiceEnabled).toBe(false);
    });

    it('should set enableLogPushSerice to true when flag is not set', function () {

        enableLogPushService();
        expect(logPushServiceEnabled).toBe(true);
    });

    it('should set enableLogPushSerice to false when false is passed as a flag', function () {
        enableLogPushService(false);
        expect(logPushServiceEnabled).toBe(false);
    });

    it('should set enableLogPushSerice to false when false is passed as a flag', function () {
        enableLogPushService(true);
        expect(logPushServiceEnabled).toBe(true);
    });
});
