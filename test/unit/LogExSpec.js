describe('$log', function() {
    var $window, logger, $log,
        log, warn, info, error, debug,
        emptyString = "",
        logSpy = jasmine.createSpy('logSpy');

//    beforeEach(function(){
//    });

   describe('testing isBoolean function', function(){
       it('passing a non boolean should return false', function(){
           expect(isBoolean(null)).toBeFalsy();
           expect(isBoolean(1)).toBeFalsy();
           expect(isBoolean("null")).toBeFalsy();
        });
       it('passing a  boolean should return true', function(){
            expect(isBoolean(true)).toBeTruthy();
            expect(isBoolean(false)).toBeTruthy();
        });
    });
    describe('testing trimString function', function(){
       it('passing a non string should return an empty string', function(){
           expect(trimString(null)).toBe(emptyString);
           expect(trimString(1)).toBe(emptyString);
           expect(trimString(true)).toBe(emptyString);
        });
       it('passing a string should return trimmed string', function(){
            expect(trimString("i am a string")).toBe("i am a string");
            expect(trimString("    i am a string")).toBe("i am a string");
            expect(trimString("i am a string  ")).toBe("i am a string");
            expect(trimString("   i am a string  ")).toBe("i am a string");
        });
    });
    describe('testing isValidString function', function(){
       it('passing a non string or empty string should return false', function(){
           expect(isValidString(null)).toBeFalsy();
           expect(isValidString(1)).toBeFalsy();
           expect(isValidString("")).toBeFalsy();
           expect(isValidString(true)).toBeFalsy();
           expect(isValidString(undefined)).toBeFalsy();
        });
       it('passing a  populated string should return true', function(){
            expect(isValidString("true")).toBeTruthy();
        });
    });
    
});