describe('enableLogPushService Spec', function () {
    var templogPushServiceEnabled;
    beforeEach(function () {
        templogPushServiceEnabled = defaultLogPushConfig.enable;
    });
    afterEach(function () {
        defaultLogPushConfig.enable = false;
    });

    it('should not set enableLogPushService when flag is not of types boolean, null or undefined', function () {
        enableLogPushService([null]);
        expect(defaultLogPushConfig.enable).toBe(false);

        enableLogPushService({});
        expect(defaultLogPushConfig.enable).toBe(false);

        enableLogPushService(76);
        expect(defaultLogPushConfig.enable).toBe(false);
    });

    it('should set enableLogPushService to true when flag is not set', function () {

        enableLogPushService();
        expect(defaultLogPushConfig.enable).toBe(true);
    });

    it('should set enableLogPushService to false when false is passed as a flag', function () {
        enableLogPushService(false);
        expect(defaultLogPushConfig.enable).toBe(false);
    });

    it('should set enableLogPushService to false when false is passed as a flag', function () {
        enableLogPushService(true);
        expect(defaultLogPushConfig.enable).toBe(true);
    });
});
