describe('$log: logEx unit tests', function () {
    var emptyString = "", classSep = "::",
        logSpy = jasmine.createSpy('logSpy');
    var ngLog = $injector.get('$log');

    describe('testing isBoolean function', function () {
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

    describe('testing trimString function', function () {
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

    describe('testing isValidString function', function () {
        it('should return false when passing a non string or empty string', function () {
            expect(isValidString(null)).toBeFalsy();
            expect(isValidString(1)).toBeFalsy();
            expect(isValidString("")).toBeFalsy();
            expect(isValidString(true)).toBeFalsy();
            expect(isValidString(undefined)).toBeFalsy();
        });
        it('should return true when passing a  populated string ', function () {
            expect(isValidString("true")).toBeTruthy();
        });
    });

    describe('testing processUseOverride function. only activates override if it is set as a boolean', function () {
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

    describe('testing processOverride function. only returns false when false is passed, everything else returns true', function () {
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
    describe('testing activateLogs function. takes 2 params enabled and override respectively', function () {
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

    describe('testing exposeSafeLog function', function () {
        var logEx = exposeSafeLog(ngLog);
        it('should return an extended log object when the orignal angular log is passed with only getInstance as an extended method', function () {
            expect(logEx).toBeDefined();
            expect(logEx.hasOwnProperty('getInstance')).toBeTruthy();
            expect(logEx.hasOwnProperty('log')).toBeTruthy();
            expect(logEx.hasOwnProperty('debug')).toBeTruthy();
            expect(logEx.hasOwnProperty('warn')).toBeTruthy();
            expect(logEx.hasOwnProperty('info')).toBeTruthy();
            expect(logEx.hasOwnProperty('error')).toBeTruthy();
            expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
            expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
        });
    });
    describe('testing getLogPrefix function', function () {
        it('should not contain a class separator if no class is passed  ', function () {
            expect(getLogPrefix(null)).not.toContain(classSep);
        });
        it('should return true when passing any value except false', function () {
            var className = "TestClass";
            expect(getLogPrefix(className)).toContain(classSep);
            expect(getLogPrefix(className)).toContain(className);
        });
    });

    describe('testing prepareLogFn function, params (logFn, className, override, useOverride)', function () {
        var logFn = ngLog.log;
        beforeEach(function () {
            spyOn(logFn, 'apply');
        });

        describe('testing prepareLogFn function when global enabled flag is false', function () {
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

        describe('testing prepareLogFn function when global enabled flag is true', function () {
            beforeEach(function () {
                $log.setGlobalDebugFlag(true);
            });
            afterEach(function () {
                $log.setGlobalDebugFlag(false);
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

    describe('testing getInstance function ', function () {
        var temp = _$log;
        beforeEach(function () {
            _$log = ngLog;
            spyOn(_$log, 'log');
        });
        afterEach(function () {
            _$log = temp;
        });
        describe('testing getInstance function when global enabled flag is true', function () {
            beforeEach(function () {
                $log.setGlobalDebugFlag(true);
            });
            afterEach(function () {
                $log.setGlobalDebugFlag(false);
            });
            it('should expect global debug flag to be enabled ', function () {
                expect($log.isEnabled()).toBeTruthy();
            });
            it('should return an extended log instance with only the original log methods', function () {
                var logEx = getInstance();
                expect(logEx).toBeDefined();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
            it('should return an extended log instance with an override to stop logs', function () {
                var logEx = getInstance(false);
                expect(logEx).toBeDefined();
                expect(_$log.log).toHaveBeenCalled();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
            it('should return an extended log instance with an override to stop logs and a className', function () {
                var logEx = getInstance('testLogger', false);
                expect(logEx).toBeDefined();
                expect(_$log.log).toHaveBeenCalled();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
        });
        describe('testing getInstance function when global enabled flag is false', function () {
            it('should expect global debug flag to be disabled ', function () {
                expect($log.isEnabled()).toBeFalsy();
            });
            it('should return an extended log instance with only the original log methods', function () {
                var logEx = getInstance();
                expect(logEx).toBeDefined();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
            it('should return an extended log instance with an override to persist logs', function () {
                var logEx = getInstance(true);
                expect(logEx).toBeDefined();
                expect(_$log.log).toHaveBeenCalled();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
            it('should return an extended log instance with an override to persist logs and a className', function () {
                var logEx = getInstance('testLogger', true);
                expect(logEx).toBeDefined();
                expect(_$log.log).toHaveBeenCalled();
                expect(logEx.hasOwnProperty('getInstance')).toBeFalsy();
                expect(logEx.hasOwnProperty('log')).toBeTruthy();
                expect(logEx.hasOwnProperty('debug')).toBeTruthy();
                expect(logEx.hasOwnProperty('warn')).toBeTruthy();
                expect(logEx.hasOwnProperty('info')).toBeTruthy();
                expect(logEx.hasOwnProperty('error')).toBeTruthy();
                expect(logEx.hasOwnProperty('isEnabled')).toBeFalsy();
                expect(logEx.hasOwnProperty('setGlobalDebugFlag')).toBeFalsy();
            });
        });


    });

});