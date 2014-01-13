describe('util Functions spec', function () {
    
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

       var chromeAgent = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36',
           
           firefoxAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
           
           ieAgent = 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
           
           safariAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10';
       
       var tempBrowsers;
       beforeEach(function () {
            tempBrowsers = colorifySupportedBrowsers;
        });

        afterEach(function () {
            colorifySupportedBrowsers = tempBrowsers;
        });
       
        colorifySupportedBrowsers = ['chrome', 'firefox'];
        it('should return true when a supported browser agent is found', function () {
            var result = isColorifySupported(chromeAgent);
            expect(result).toBe(true);
            
            result = isColorifySupported(firefoxAgent);
            expect(result).toBe(true);
        });
        
       it('should return false when a supported browser agent is found', function () {
            var result = isColorifySupported(ieAgent);
            expect(result).toBe(false);
            
            result = isColorifySupported(safariAgent);
            expect(result).toBe(false);
        });
       
    });
});