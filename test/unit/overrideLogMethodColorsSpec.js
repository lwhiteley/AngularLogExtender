describe('overrideLogMethodColor Spec', function () {
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
    
    it('should not update any properties when overrides is not an object', function () {
        var override = 'not valid param';
        overrideLogMethodColors(override);
        expect(defaultLogMethodColors).toEqual(testColors);
    });

    it('should not update any properties when invalid log method overrides are passed', function () {
        var override = {
            tip: 'dgdfgfdg',
            pull: 'reddish'
        };
        overrideLogMethodColors(override);
        expect(defaultLogMethodColors).toEqual(testColors);
    });
    
    it('should not update valid properties when set in color overrides and css is not invalid ', function () {
        var override = {
            log: 'not a color',
            pull: 'reddish'
        };
        overrideLogMethodColors(override);
        expect(defaultLogMethodColors.log).toBe(testColors.log);
        expect(defaultLogMethodColors.error).toBe(testColors.error);
    });
    
    it('should only update valid properties when set in color overrides with valid css', function () {
        var css = 'color:blue';
        var override = {
            log: css,
            pull: 'reddish'
        };
        overrideLogMethodColors(override);
        expect(defaultLogMethodColors.log).toBe(css);
        expect(defaultLogMethodColors.error).toBe(testColors.error);
    });
    
    it('should update all valid properties when set in color overrides with valid css', function () {
        var css = 'color:blue';
        var css2 = 'color:red';
        var override = {
            log: css,
            error: css2
        };
        overrideLogMethodColors(override);
        expect(defaultLogMethodColors.log).toBe(css);
        expect(defaultLogMethodColors.error).toBe(css2);
    });
   
});