describe('Provider Func Spec', function () {

    describe('enabled globally Spec', function () {
        afterEach(function () {
            enableGlobally = false;
        });

        it('should set enableGlobally to true when input flag is truthy', function () {
            enableLogging(true);
            expect(enableGlobally).toBe(true);
        });

        it('should set enableGlobally to false when input flag is falsy', function () {
            enableLogging(false);
            expect(enableGlobally).toBe(false);
        });
        
        it('should set enableGlobally to false when input flag is not a boolean', function () {
            enableLogging('false');
            expect(enableGlobally).toBe(false);
            enableLogging(null);
            expect(enableGlobally).toBe(false);
            enableLogging(undefined);
            expect(enableGlobally).toBe(false);
            enableLogging(8);
            expect(enableGlobally).toBe(false);
        });
        
    });

    describe('override log prefix Spec', function () {
        var clock, sDateFormat;

        beforeEach(function () {
            sDateFormat = "May-02-2010-12:42:53PM >> ";
            clock = angular.mock.$mockDate();
            datespy.clock.create(new Date(2010, 4, 2, 12, 42, 53).getTime());
        });

        afterEach(function () {
            clock.$restoreDate();
        });

        it('should return default formatter if function is not passed', function () {
            overrideLogPrefix();
            expect(getLogPrefix()).toBe(sDateFormat);
        });

        it('should not return default formatter if function is passed', function () {
            var format = "<><><><>";

            overrideLogPrefix(function () {
                return format;
            });
            expect(getLogPrefix()).toBe(format);
            expect(getLogPrefix()).not.toBe(sDateFormat);
        });
    });

    describe('restrictLogMethods Spec', function () {
        var logMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

        it('should return default formatter if function is not passed', function () {
            restrictLogMethods();
            expect(allowedMethods).toEqual(logMethods);
        });

        it('should not return default formatter if function is passed', function () {
            restrictLogMethods(['log', 'info']);
            expect(allowedMethods).not.toBe(logMethods);
        });
    });
    
    describe('disableDefaultColors Spec', function () {
        
        afterEach(function () {
            useDefaultColors = true;
        });
        it('should keep useDefaultColors as true when input is not a boolean', function () {
            disableDefaultColors(null);
            expect(useDefaultColors).toBe(true);
        });
        
        it('should keep useDefaultColors as true when input is false', function () {
            disableDefaultColors(false);
            expect(useDefaultColors).toBe(true);
        });

        it('should set useDefaultColors to false when true is passed', function () {
            disableDefaultColors(true);
            expect(useDefaultColors).toBe(false);
        });
    });
    
    describe('setLogMethodColor Spec', function () {
       
        var temp, testColors;
        beforeEach(function () {
            temp = defaultLogMethodColors;
            
            defaultLogMethodColors = {
                log: 'black',
                error: 'indigo'
            };
            
            testColors = defaultLogMethodColors;
            
        });
        
        afterEach(function () {
            defaultLogMethodColors = temp;
        });

        it('should not update properties when invalid log method string is passed', function () {
            var css = 'color:blue';
            setLogMethodColor('awesomeness', css);
            expect(defaultLogMethodColors).toEqual(testColors);
        });
        
        it('should not update properties when the method name is not a string ', function () {
            setLogMethodColor(true, 'color:blue');
            expect(defaultLogMethodColors).toEqual(testColors);
        });
        
        it('should not update properties when colorCss is not a string ', function () {
            setLogMethodColor('log', null);
            expect(defaultLogMethodColors).toEqual(testColors);
        });
        
        it('should not update properties when colorCss has invalid format', function () {
            setLogMethodColor('log', 'blue');
            expect(defaultLogMethodColors).toEqual(testColors);
        });
        
        it('should update properties when colorCss and method name are valid', function () {
            var css = 'color:blue';
            setLogMethodColor('log', css);
            expect(defaultLogMethodColors.log).toBe(css);
            
            css = 'color:red';
            setLogMethodColor('error', css);
            expect(defaultLogMethodColors.error).toBe(css);
        });

       
    });
    

});