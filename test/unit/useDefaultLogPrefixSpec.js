describe('useDefaultLogPrefix Spec', function () {

    var tempDefault;
    beforeEach(function () {
        tempDefault = useDefaultPrefix;
    });
    afterEach(function () {
        useDefaultPrefix = null;
    });

    it('should not set useDefaultPrefix when flag is not a boolean', function () {
        useDefaultLogPrefix(null);
        expect(useDefaultPrefix).toBe(tempDefault);
    });

    it('should set useDefaultPrefix to false when false is passed as a flag', function () {
        useDefaultLogPrefix(false);
        expect(useDefaultPrefix).toBe(false);
    });

    it('should set useDefaultPrefix to false when false is passed as a flag', function () {
        useDefaultLogPrefix(true);
        expect(useDefaultPrefix).toBe(true);
    });
});
