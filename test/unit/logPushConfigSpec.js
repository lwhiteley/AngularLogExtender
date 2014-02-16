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

    describe('logPushConfig Spec', function () {
        var tempApi, tempInt, tempMethods, tempEnable;
        beforeEach(function () {
            tempApi = logPushApi;
            tempInt = logPushInterval;
            tempMethods = defaultLogPushMethods;
            tempEnable = logPushSericeEnabled;
            spyOn(window, 'setLogPushApi');
            spyOn(window, 'setAllowedLogPushMethods');
            spyOn(window, 'setLogPushInterval');
            spyOn(window, 'enableLogPushService');

        });
        afterEach(function () {
            logPushApi = tempApi;
            logPushInterval = tempInt;
            defaultLogPushMethods = tempMethods;
            logPushSericeEnabled = tempEnable;
        });

        it('should not set logPush configs when value is not an object ', function () {
            logPushConfig(true);
            expect(setLogPushInterval).not.toHaveBeenCalled();
            expect(setAllowedLogPushMethods).not.toHaveBeenCalled();
            expect(setLogPushApi).not.toHaveBeenCalled();
            expect(enableLogPushService).not.toHaveBeenCalled();
        });

        it('should not attempt to set logPush configs when value is an object but wrong property names', function () {
            var val = {int:3000, app: 'hbckjd', enab: true, meths: ['info']};
            logPushConfig(val);
            expect(setLogPushInterval).not.toHaveBeenCalled();
            expect(setAllowedLogPushMethods).not.toHaveBeenCalled();
            expect(setLogPushApi).not.toHaveBeenCalled();
            expect(enableLogPushService).toHaveBeenCalled();
        });

        it('should attempt to set logPush configs when value is an object with correct property names', function () {
            var val = {interval:3000, api: 'hbckjd', enable: true, methods: ['info']};
            logPushConfig(val);
            expect(setLogPushInterval).toHaveBeenCalled();
            expect(setAllowedLogPushMethods).toHaveBeenCalled();
            expect(setLogPushApi).toHaveBeenCalled();
            expect(enableLogPushService).toHaveBeenCalled();
        });


    });

});
