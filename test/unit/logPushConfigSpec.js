describe('log push config Spec', function () {

    describe('set logPushInterval Spec', function () {
        var temp;
        beforeEach(function () {
            temp = logPushInterval;
        });
        afterEach(function () {
            logPushInterval = temp;
        });

        it('should not set logPushInterval when value is not an number ', function () {
            setLogPushInterval(true);
            expect(logPushInterval).toBe(temp);

            setLogPushInterval({});
            expect(logPushInterval).toBe(temp);

            setLogPushInterval('76');
            expect(logPushInterval).toBe(temp);
        });

        it('should  set logPushInterval when value is  an number ', function () {
            var val = 123234;
            setLogPushInterval(val);
            expect(logPushInterval).toBe(val);
        });
    });

     describe('set logPushApi Spec', function () {
        var temp;
        beforeEach(function () {
            temp = logPushApi;
        });
        afterEach(function () {
            logPushApi = temp;
        });

        it('should not set logPushApi when value is not an number ', function () {
            setLogPushApi(true);
            expect(logPushApi).toBe(temp);

            setLogPushApi({});
            expect(logPushApi).toBe(temp);

            setLogPushApi(9876);
            expect(logPushApi).toBe(temp);
        });

        it('should  set logPushApi when value is  an number ', function () {
            var val = 'api/logs';
            setLogPushApi(val);
            expect(logPushApi).toBe(val);
        });
    });

});
