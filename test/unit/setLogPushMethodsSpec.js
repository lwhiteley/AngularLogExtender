describe('enableLogPushSerice Spec', function () {
    var temp;
    beforeEach(function () {
        temp = defaultLogPushMethods;
    });
    afterEach(function () {
        defaultLogPushMethods = temp;
    });

    it('should not set defaultLogPushMethods when value is not an array ', function () {
        setAllowedLogPushMethods(true);
        expect(defaultLogPushMethods).toEqual(temp);

        setAllowedLogPushMethods({});
        expect(defaultLogPushMethods).toEqual(temp);

        setAllowedLogPushMethods(76);
        expect(defaultLogPushMethods).toEqual(temp);
    });

    it('should  set defaultLogPushMethods when value is  an array ', function () {
        var methods = ['log','info'];
        setAllowedLogPushMethods(methods);
        expect(defaultLogPushMethods).toEqual(methods);
    });
});
