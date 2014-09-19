describe('getLogPrefix function Spec', function () {

    describe('getLogPrefix function Spec when defaultlogprefix is active', function () {

        var tempUseDefault, tempUseOverride, tempCustomPrefix;
        beforeEach(function () {
            tempUseOverride = logPrefixOverride;
            tempUseDefault = useDefaultPrefix;
            tempCustomPrefix = customLogPrefixFn;
            spyOn(window, 'defaultLogPrefixFn');

            customLogPrefixFn = function () {
                return "";
            };
        });

        afterEach(function () {
            logPrefixOverride = tempUseOverride;
            useDefaultPrefix = tempUseDefault;
            customLogPrefixFn = tempCustomPrefix;
        });

        it('should call default when customPrefix is  set but useDefault is true', function () {
            logPrefixOverride = true;
            useDefaultPrefix = true;
            spyOn(window, 'customLogPrefixFn');
            getLogPrefix('class');

            expect(defaultLogPrefixFn).toHaveBeenCalled();
            expect(customLogPrefixFn).not.toHaveBeenCalled();
        });

        it('should call default when logPrefixOverride if default is false', function () {
            logPrefixOverride = true;
            useDefaultPrefix = false;
            spyOn(window, 'customLogPrefixFn');
            getLogPrefix('class');

            expect(defaultLogPrefixFn).not.toHaveBeenCalled();
            expect(customLogPrefixFn).toHaveBeenCalled();
        });
    });

    describe('getLogPrefix function Spec when customlogprefix is active', function () {

        var tempUseDefault, tempUseOverride, tempCustomPrefix;
        beforeEach(function () {
            tempUseOverride = logPrefixOverride;
            tempUseDefault = useDefaultPrefix;
            tempCustomPrefix = customLogPrefixFn;
            spyOn(window, 'defaultLogPrefixFn');

        });

        afterEach(function () {
            logPrefixOverride = tempUseOverride;
            useDefaultPrefix = tempUseDefault;
            customLogPrefixFn = tempCustomPrefix;
        });

        it('should call custom when  useDefault is false  and override is true', function () {
            customLogPrefixFn = function () {
                return "";
            };
            spyOn(window, 'customLogPrefixFn');

            logPrefixOverride = true;
            useDefaultPrefix = false;

            getLogPrefix('class');

            expect(defaultLogPrefixFn).not.toHaveBeenCalled();
            expect(customLogPrefixFn).toHaveBeenCalled();
        });
    });

});