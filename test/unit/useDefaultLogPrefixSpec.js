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
    expect(useDefaultPrefix).toBeFalsy();

    useDefaultLogPrefix({});
    expect(useDefaultPrefix).toBeFalsy();

    useDefaultLogPrefix(76);
    expect(useDefaultPrefix).toBeFalsy();
  });

  it('should set useDefaultPrefix to true when flag is not set', function () {

    useDefaultLogPrefix();
    expect(useDefaultPrefix).toBeTruthy();
  });

  it('should set useDefaultPrefix to false when false is passed as a flag', function () {
    useDefaultLogPrefix(false);
    expect(useDefaultPrefix).toBeFalsy();
  });

  it('should set useDefaultPrefix to false when false is passed as a flag', function () {
    useDefaultLogPrefix(true);
    expect(useDefaultPrefix).toBeTruthy();
  });
});
