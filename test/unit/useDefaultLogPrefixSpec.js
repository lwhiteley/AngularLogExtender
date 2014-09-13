describe('useDefaultLogPrefix Spec', function () {
    var tempDefault;
    beforeEach(function () {
        tempDefault = useDefaultPrefix;
    });
    afterEach(function () {
        useDefaultPrefix = false;
    });

    it('should not set useDefaultPrefix when flag is not of types boolean, null or undefined', function () {
        useDefaultLogPrefix([null]);
        expect(useDefaultPrefix).toBe(false);

        useDefaultLogPrefix({});
        expect(useDefaultPrefix).toBe(false);

        useDefaultLogPrefix(76);
        expect(useDefaultPrefix).toBe(false);
    });

    it('should set useDefaultPrefix to true when flag is not set', function () {

        useDefaultLogPrefix();
        expect(useDefaultPrefix).toBe(true);
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
