describe('util Functions spec', function () {
    
       var chromeAgent = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36',
           
           firefoxAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
           
           ieAgent = 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
           
           safariAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10';
           
   var tempBrowsers, tempAgent;
   beforeEach(function () {
       tempAgent = userAgent;
        tempBrowsers = colorifySupportedBrowsers;
    });

    afterEach(function () {
        userAgent = tempAgent;
        colorifySupportedBrowsers = tempBrowsers;
    });
       
    describe('colorify Spec, returns array to be used as log method args ', function () {
        var colorPrefix = "%c";
        it('should return array with param1 as only item in array when browser is not supported', function () {
            var message = 'chromeAgent';
            var prefix = "log pre >> ";
            var colorCSS = 'background: #222; color: #bada55';
            var result = colorify(message, 'chromeagent is found', prefix);
            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toBe( message);
            expect(result.length).toBe(1);
        });
        
         it('should return array with param1 as only item in array when neither params are strings', function () {
            var message = 3;
            var colorCSS = null;
            var prefix = "log pre >> ";
            var result = colorify(message, colorCSS, prefix);
            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toBe(message);
            expect(result.length).toBe(1);
        });
        
        it('should return array with param1 as only item in array when no colons are in css string', function () {
            var message = 'this is a message to log';
            var colorCSS = 'null';
            var prefix = "log pre >> ";
            var result = colorify(message, colorCSS, prefix);
            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toBe(message);
            expect(result.length).toBe(1);
        });
        
        it('should return array with 2 items when browser is supported and params are valid', function () {
            var message = 'chromeAgent';
            var colorCSS = 'background: #222; color: #bada55';
            userAgent = chromeAgent;
            var prefix = "log pre >> ";
            var result = colorify(message, colorCSS, prefix);
            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toBe(colorPrefix + prefix + message);
            expect(result[1]).toBe(colorCSS);
            expect(result.length).toBe(2);
        });
        
        it('should return array with 2 items when browser is supported and params are valid without prefix', function () {
            var message = 'chromeAgent';
            var colorCSS = 'background: #222; color: #bada55';
            userAgent = chromeAgent;
            var result = colorify(message, colorCSS);
            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toEqual(colorPrefix + message);
            expect(result[1]).toEqual(colorCSS);
            expect(result.length).toBe(2);
        });
        
    });
    
    describe('isSubString Spec ', function () {
       
        it('should return true when a a substring is passed', function () {
            var result = isSubString('chromeAgent', 'chromeagent is found');
            expect(result).toBe(true);
        });
        
       it('should return false when substring is not within full string', function () {
            var result = isSubString('chromeAgent', 'firefoxagent is found');
            expect(result).toBe(false);
        });
        
        it('should return false when either params is not a string', function () {
            var result = isSubString(['firefoxagent'], 'firefoxagent is found');
            expect(result).toBe(false);
            
            result = isSubString('firefoxagent', null);
            expect(result).toBe(false);
            
            result = isSubString(2, 7);
            expect(result).toBe(false);
        });
       
    });
    
   describe('isColorifySupported Spec ', function () {

        colorifySupportedBrowsers = ['chrome', 'firefox'];
       
        it('should return true when a supported browser agent is found', function () {
            userAgent = chromeAgent;
            var result = isColorifySupported();
            expect(result).toBe(true);
            
            userAgent = firefoxAgent;
            result = isColorifySupported();
            expect(result).toBe(true);
        });
        
       it('should return false when a supported browser agent is found', function () {
            userAgent = ieAgent;
            var result = isColorifySupported();
            expect(result).toBe(false);
            
           userAgent = safariAgent;
            result = isColorifySupported();
            expect(result).toBe(false);
        });
       
    });
    
    describe('canColorize Spec ', function () {
       
        it('should return true when arg has 1 element that is a string', function () {
            var args = ['colorize'];
            var result = validateColorizeInputs(args);
            expect(result).toBe(true);
        });
        
        it('should return false when arg has multiple elements ', function () {
            var args = ['colorize', 'args to much'];
            var result = validateColorizeInputs(args);
            expect(result).toBe(false);
        });
        
        it('should return false when arg has 1 element that is not a string', function () {
            var args = [['colorize']];
            var result = validateColorizeInputs(args);
            expect(result).toBe(false);
        });
       
    });
    
    describe('canTemplate Spec ', function () {
       
        it('should return false when useTemplate is false', function () {
            var args = ['colorize', ''];
            var useTemplate = false;
            var result = validateTemplateInputs(useTemplate, args);
            expect(result).toBe(false);
        });
        
        it('should return false when useTemplate is true but args length is not equal to 2', function () {
            var args = ['colorize'];
            var useTemplate = true;
            var result = validateTemplateInputs(useTemplate, args);
            expect(result).toBe(false);
            
            args = ['colorize', '', ''];
            useTemplate = true;
            result = validateTemplateInputs(useTemplate, args);
            expect(result).toBe(false);
        });
        
        it('should return true when useTemplate is true and args length is equal to 2', function () {
            var a = ['colorize', 'hghh'];
            var useTemplate = true;
            var result = validateTemplateInputs(useTemplate, a);
            expect(result).toBe(true);
        });
       
    });
    
    describe('itypeof Spec ', function () {
        it('should return string description of object type', function () {
            var message = '{0}';
            var result = itypeof(message);
            expect(result).toBe('string');
            
            result = itypeof({message: 'this is object'});
            expect(result).toBe('object');
            
            result = itypeof(true);
            expect(result).toBe('boolean');
            
            result = itypeof(1);
            expect(result).toBe('number');
        });
        
    });
});