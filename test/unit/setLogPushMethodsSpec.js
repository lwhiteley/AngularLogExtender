describe('enableLogPushSerice Spec', function () {
    var temp;
    beforeEach(function () {
        temp = defaultLogPushConfig.methods;
    });
    afterEach(function () {
        defaultLogPushConfig.methods = temp;
    });

    it('should not set defaultLogPushMethods when value is not an array ', function () {
        setAllowedLogPushMethods(true);
        expect(defaultLogPushConfig.methods).toEqual(temp);

        setAllowedLogPushMethods({});
        expect(defaultLogPushConfig.methods).toEqual(temp);

        setAllowedLogPushMethods(76);
        expect(defaultLogPushConfig.methods).toEqual(temp);
    });

    it('should  set defaultLogPushMethods when value is  an array ', function () {
        var methods = ['log','info'];
        setAllowedLogPushMethods(methods);
        expect(defaultLogPushConfig.methods).toEqual(methods);
    });
});
