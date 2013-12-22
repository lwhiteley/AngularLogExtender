describe('$log: logEx unit tests', function() {
    var $window, logger, $log,
        log, warn, info, error, debug,
        emptyString = "",
        classSep = "::",
        logSpy = jasmine.createSpy('logSpy');

//    beforeEach(function(){
//    });

   describe('testing isBoolean function', function(){
       it('should return false when passing a non boolean ', function(){
           expect(isBoolean(null)).toBeFalsy();
           expect(isBoolean(1)).toBeFalsy();
           expect(isBoolean("null")).toBeFalsy();
        });
       it('should return true when passing a  boolean ', function(){
            expect(isBoolean(true)).toBeTruthy();
            expect(isBoolean(false)).toBeTruthy();
        });
    });
    describe('testing trimString function', function(){
       it('should return an empty string when passing a non string ', function(){
           expect(trimString(null)).toBe(emptyString);
           expect(trimString(1)).toBe(emptyString);
           expect(trimString(true)).toBe(emptyString);
        });
       it('should return trimmed string when passing a string ', function(){
            expect(trimString("alakazam")).toBe("alakazam"); 
            expect(trimString("")).toBe("");
            expect(trimString("i am a string")).toBe("i am a string");
            expect(trimString("    i am a string")).toBe("i am a string");
            expect(trimString("i am a string  ")).toBe("i am a string");
            expect(trimString("   i am a string  ")).toBe("i am a string");
        });
    });
    describe('testing isValidString function', function(){
       it(' should return false when passing a non string or empty string', function(){
           expect(isValidString(null)).toBeFalsy();
           expect(isValidString(1)).toBeFalsy();
           expect(isValidString("")).toBeFalsy();
           expect(isValidString(true)).toBeFalsy();
           expect(isValidString(undefined)).toBeFalsy();
        });
       it('should return true when passing a  populated string ', function(){
            expect(isValidString("true")).toBeTruthy();
        });
    });
    describe('testing processUseOverride function. only activates override if it is set as a boolean', function(){
       it('should return false when passing a non boolean  ', function(){
           expect(processUseOverride(null)).toBeFalsy();
           expect(processUseOverride(1)).toBeFalsy();
           expect(processUseOverride("")).toBeFalsy();
           expect(processUseOverride(undefined)).toBeFalsy();
        });
       it('should return true when passing a  populated string ', function(){
            expect(processUseOverride(true)).toBeTruthy();
            expect(processUseOverride(false)).toBeTruthy();
        });
    });
    describe('testing processOverride function. only returns false when false is passed, everything else returns true', function(){
       it('should return false when passing false   ', function(){
           expect(processOverride(false)).toBeFalsy();
        });
       it('should return true when passing any value except false', function(){
            expect(processOverride(true)).toBeTruthy();
           expect(processOverride(1)).toBeTruthy();
           expect(processOverride("")).toBeTruthy();
           expect(processOverride(undefined)).toBeTruthy();
           expect(processOverride(null)).toBeTruthy();
        });
    });

    
// need to set up $filter dependencyto test
//    describe('testing getLogPrefix function', function(){
//       it('should not contain a class separator if no class is passed  ', function(){
//           expect(getLogPrefix(null)).not.toContain(classSep);
//        });
//       it('should return true when passing any value except false', function(){
//           var className =  "TestClass";
//           expect(getLogPrefix(className)).toContain(classSep);
//            expect(getLogPrefix(className)).toContain(className);
//        });
//    });
    
    
});