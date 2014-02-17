describe('log push config Spec', function () {

    describe('set logPushInterval Spec', function () {
        var temp;
        beforeEach(function () {
            temp = defaultLogPushConfig.interval;
        });
        afterEach(function () {
            defaultLogPushConfig.interval = temp;
        });

        it('should not set logPushInterval when value is not an number ', function () {
            setLogPushInterval(true);
            expect(defaultLogPushConfig.interval).toBe(temp);

            setLogPushInterval({});
            expect(defaultLogPushConfig.interval).toBe(temp);

            setLogPushInterval('76');
            expect(defaultLogPushConfig.interval).toBe(temp);
        });

        it('should  set logPushInterval when value is  an number ', function () {
            var val = 123234;
            setLogPushInterval(val);
            expect(defaultLogPushConfig.interval).toBe(val);
        });
    });

     describe('set logPushApi Spec', function () {
        var temp;
        beforeEach(function () {
            temp = defaultLogPushConfig.api;
        });
        afterEach(function () {
            defaultLogPushConfig.api = temp;
        });

        it('should not set logPushApi when value is not an number ', function () {
            setLogPushApi(true);
            expect(defaultLogPushConfig.api).toBe(temp);

            setLogPushApi({});
            expect(defaultLogPushConfig.api).toBe(temp);

            setLogPushApi(9876);
            expect(defaultLogPushConfig.api).toBe(temp);
        });

        it('should  set logPushApi when value is  an number ', function () {
            var val = 'api/logs';
            setLogPushApi(val);
            expect(defaultLogPushConfig.api).toBe(val);
        });
    });

});
