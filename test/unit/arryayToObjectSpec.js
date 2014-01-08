describe('arrayToObject Spec', function () {
    it('should return empty object if param is not an array', function () {
       expect(arrToObject(null)).toEqual({});
    });

    it('should return an object literal with array props as keys', function () {
        var params = ['log', 'info', 'warn', 'debug'],
            vals = arrToObject(params);
        params.unshift('getInstance');
        expect(Object.keys(vals)).toEqual(params);
    });
});