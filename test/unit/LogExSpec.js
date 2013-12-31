describe('$log: logEx unit tests', function () {
    var emptyString = "", classSep = "::",
        logSpy, ngLog;

    beforeEach(function () {
        ngLog = $injector.get('$log');
        logSpy = jasmine.createSpy('logSpy');
    });

    describe('isBoolean function Spec', function () {
        it('should return false when passing a non boolean ', function () {
            expect(isBoolean(null)).toBeFalsy();
            expect(isBoolean(1)).toBeFalsy();
            expect(isBoolean("null")).toBeFalsy();
        });
        it('should return true when passing a  boolean ', function () {
            expect(isBoolean(true)).toBeTruthy();
            expect(isBoolean(false)).toBeTruthy();
        });
    });

    describe('trimString function Spec', function () {
        it('should return an empty string when passing a non string ', function () {
            expect(trimString(null)).toBe(emptyString);
            expect(trimString(1)).toBe(emptyString);
            expect(trimString(true)).toBe(emptyString);
        });
        it('should return trimmed string when passing a string ', function () {
            expect(trimString("alakazam")).toBe("alakazam");
            expect(trimString("")).toBe("");
            expect(trimString("i am a string")).toBe("i am a string");
            expect(trimString("    i am a string")).toBe("i am a string");
            expect(trimString("i am a string  ")).toBe("i am a string");
            expect(trimString("   i am a string  ")).toBe("i am a string");
        });
    });

    describe('isValidString function Spec', function () {
        it('should return false when passing a non string or empty string', function () {
            expect(isValidString(null)).toBeFalsy();
            expect(isValidString(1)).toBeFalsy();
            expect(isValidString("")).toBeFalsy();
            expect(isValidString(true)).toBeFalsy();
            expect(isValidString(undefined)).toBeFalsy();
            expect(isValidString([])).toBeFalsy();
            expect(isValidString({})).toBeFalsy();
        });
        it('should return true when passing a  populated string ', function () {
            expect(isValidString("true")).toBeTruthy();
        });
    });

    describe('processUseOverride function Spec', function () {
        it('should return false when passing a non boolean  ', function () {
            expect(processUseOverride(null)).toBeFalsy();
            expect(processUseOverride(1)).toBeFalsy();
            expect(processUseOverride("")).toBeFalsy();
            expect(processUseOverride(undefined)).toBeFalsy();
        });
        it('should return true when passing a boolean', function () {
            expect(processUseOverride(true)).toBeTruthy();
            expect(processUseOverride(false)).toBeTruthy();
        });
    });

    describe('processOverride function Spec', function () {
        it('should return false when passing false   ', function () {
            expect(processOverride(false)).toBeFalsy();
        });
        it('should return true when passing any value except false', function () {
            expect(processOverride(true)).toBeTruthy();
            expect(processOverride(1)).toBeTruthy();
            expect(processOverride("")).toBeTruthy();
            expect(processOverride(undefined)).toBeTruthy();
            expect(processOverride(null)).toBeTruthy();
        });
    })
    ;
    describe('activateLogs function Spec', function () {
        it('should return false when no booleans are passed', function () {
            expect(activateLogs("false", "")).toBeFalsy();
        });
        it('should return false when no boolean is passed for enabled', function () {
            expect(activateLogs("false", true)).toBeFalsy();
        });
        it('should return false when no boolean is passed for override', function () {
            expect(activateLogs(true, "true")).toBeFalsy();
        });
        it('should return false when enabled is a boolean and override is false ', function () {
            expect(activateLogs(false, false)).toBeFalsy();
            expect(activateLogs(true, false)).toBeFalsy();
        });
        it('should return true when enabled is a boolean and override is true ', function () {
            expect(activateLogs(true, true)).toBeTruthy();
            expect(activateLogs(false, true)).toBeTruthy();
        });
    });

    describe('exposeSafeLog function Spec', function () {
        var logEx;

        beforeEach(function () {
            ngLog = $injector.get('$log'); 
            logEx = exposeSafeLog(ngLog);
        });

        it('should return an extended log object when the orignal angular log is passed with getInstance undefined', function () {
            expect(logEx).toBeDefined();
            expect(logEx.getInstance).toBeUndefined();
            expect(logEx.log).toBeDefined();
            expect(logEx.debug).toBeDefined();
            expect(logEx.warn).toBeDefined();
            expect(logEx.info).toBeDefined();
            expect(logEx.error).toBeDefined();
            expect(logEx.isEnabled).toBeFalsy();
            expect(logEx.setGlobalDebugFlag).toBeFalsy();
        });

        it('should return an extended log object when the orignal angular log is passed with getInstance defined', function () {
            angular.extend(logEx, {
                getInstance : function () {
                    return "something";
                }
            });
            expect(logEx).toBeDefined();
            expect(logEx.getInstance).toBeDefined();
            expect(logEx.log).toBeDefined();
            expect(logEx.debug).toBeDefined();
            expect(logEx.warn).toBeDefined();
            expect(logEx.info).toBeDefined();
            expect(logEx.error).toBeDefined();
            expect(logEx.isEnabled).toBeFalsy();
            expect(logEx.setGlobalDebugFlag).toBeFalsy();
        });

    });
    describe('getLogPrefix function Spec', function () {
        it('should not contain a class separator if no class is passed  ', function () {
            expect(getLogPrefix(null)).not.toContain(classSep);
        });
        it('should return true when passing any value except false', function () {
            var className = "TestClass";
            expect(getLogPrefix(className)).toContain(classSep);
            expect(getLogPrefix(className)).toContain(className);
        });
    });

    describe('prepareLogFn function Spec', function () {
        var logFn;
        beforeEach(function () {
            logFn = ngLog.log;
            ngLog = $injector.get('$log');
            spyOn(logFn, 'apply');
        });

        describe('prepareLogFn function Spec - global enabled flag is false', function () {
            it('should not callapply when no params are sent', function () {
                var exFn = prepareLogFn(null);
                exFn();
                expect(logFn.apply).not.toHaveBeenCalled();
            });
            it('should not call apply when override is false and useOverride is false', function () {
                var exFn = prepareLogFn(logFn, "", false, false);
                exFn();
                expect(logFn.apply).not.toHaveBeenCalled();
            });
            it('should not call apply when  override is false and useOverride is true', function () {
                var exFn = prepareLogFn(logFn, "", false, true);
                exFn();
                expect(logFn.apply).not.toHaveBeenCalled();
            });
            it('should  call apply when  override is true and useOverride is true', function () {
                var exFn = prepareLogFn(logFn, "", true, true);
                exFn();
                expect(logFn.apply).toHaveBeenCalled();
            });
        });

        describe('prepareLogFn function Spec - global enabled flag is true', function () {
            beforeEach(function () {
                $log.enableLog(true);
            });
            afterEach(function () {
                $log.enableLog(false);
            });
            it('should  call apply when no params are sent', function () {
                var exFn = prepareLogFn(null);
                exFn();
                expect(logFn.apply).not.toHaveBeenCalled();
            });
            it('should not call apply when override is false and useOverride is true', function () {
                var exFn = prepareLogFn(logFn, "", false, true);
                exFn();
                expect(logFn.apply).not.toHaveBeenCalled();
            });
            it('should  call apply when override is false and useOverride is false', function () {
                var exFn = prepareLogFn(logFn, "", false, false);
                exFn();
                expect(logFn.apply).toHaveBeenCalled();
            });
            it('should  call apply when  override is true and useOverride is true', function () {
                var exFn = prepareLogFn(logFn, "", true, true);
                exFn();
                expect(logFn.apply).toHaveBeenCalled();
            });
        });

    });
});