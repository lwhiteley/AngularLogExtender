describe('supplant spec, takes a string and an object respectively ', function () {
    
    it('should return populated string with template object values with custom pattern', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var result = supplant('{email} - {who}', r, /\{([^\{\}]*)\}/g);
        var expected = '' + r.email + ' - ' + r.who;
        expect(result).toEqual(expected);
    });

    it('should return the template if object properties are not in the value object', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var template = '{user.email} - {user.who}';
        var result = supplant(template, r, /\{([^\{\}]*)\}/g);
        expect(result).toBe(template);
    });

     it('should return populated string with template object values without custom pattern', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var result = supplant('{email} - {who}', r);
        var expected = '' + r.email + ' - ' + r.who;
        expect(result).toEqual(expected);
    });
 
    it('should return template string when no patterns are present in the string', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var template = 'no templates are passed';
        var result = supplant(template, r);
        expect(result).toEqual(template);
    });
    
    it('should return template string when patterns are present but match no property in template obj', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var template = '{emailWho} - {whoEmail}';
        var result = supplant(template, r);
        expect(result).toEqual(template);
    });
    
    it('should return partial template string when patterns are present but dont fully match props in template obj', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var template = '{email} - {whoEmail}';
        var result = supplant(template, r);
        var expected = '' + r.email + ' - {whoEmail}';
        expect(result).toEqual(expected);
    });
        
    it('should return array of arguments when an object is not passed', function () {
        var template = '{email} - {who}';
        var result = supplant(template, '');
        expect(result).toEqual([template, '']);
    });
    
    it('should return array of arguments when wrong inputs are passed', function () {
        var r = {who: 'sjsjd', email: "user@cp.com"};
        var template = '{email} - {whoEmail}';
        var result = supplant( r, template);
        expect(result).toEqual([r, template]);
    });
});