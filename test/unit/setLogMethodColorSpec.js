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