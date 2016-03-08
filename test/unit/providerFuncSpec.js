describe('Provider Func Spec', function () {

  describe('enabled globally Spec', function () {
    afterEach(function () {
      enableGlobally = false;
    });

    it('should set enableGlobally to true when input flag is truthy', function () {
      enableLogging(true);
      expect(enableGlobally).toBeTruthy();
    });

    it('should set enableGlobally to false when input flag is falsy', function () {
      enableLogging(false);
      expect(enableGlobally).toBeFalsy();
    });

    it('should set enableGlobally to false when input flag is not a boolean', function () {
      enableLogging('false');
      expect(enableGlobally).toBeFalsy();
      enableLogging(null);
      expect(enableGlobally).toBeFalsy();
      enableLogging(undefined);
      expect(enableGlobally).toBeFalsy();
      enableLogging(8);
      expect(enableGlobally).toBeFalsy();
    });

    it('should set enableGlobally to true & enabledQuietly to true', function () {
      enableLogging(true, true);
      expect(enableGlobally).toBeTruthy();
      expect(enabledQuietly).toBeTruthy();
    });

    it('should set enableGlobally to true & enabledQuietly to false', function () {
      enableLogging(true, false);
      expect(enableGlobally).toBeTruthy();
      expect(enabledQuietly).toBeFalsy();
    });

  });

  describe('override log prefix Spec', function () {
    var clock, sDateFormat, customLogPrefixFn;

    beforeEach(function () {
      tempCustomPrefix = customLogPrefixFn;
      sDateFormat = "May-02-2010-12:42:53PM >> ";
      clock = angular.mock.$mockDate();
      datespy.clock.create(new Date(2010, 4, 2, 12, 42, 53).getTime());
    });

    afterEach(function () {
      clock.$restoreDate();
      logPrefixOverride = false;
      customLogPrefixFn = tempCustomPrefix;
    });

    it('should return default formatter if function is not passed', function () {
      overrideLogPrefix();
      expect(getLogPrefix()).toBe(sDateFormat);
      expect(logPrefixOverride).toBeFalsy();
    });

    it('should not return default formatter if function is passed', function () {
      var format = "<><><><>";

      overrideLogPrefix(function () {
        return format;
      });
      expect(getLogPrefix()).toBe(format);
      expect(getLogPrefix()).not.toBe(sDateFormat);
      expect(logPrefixOverride).toBeTruthy();
    });
  });

  describe('restrictLogMethods Spec', function () {
    var logMethods = ['log', 'info', 'warn', 'debug', 'error', 'getInstance'];

    it('should return default formatter if function is not passed', function () {
      restrictLogMethods();
      expect(allowedMethods).toEqual(logMethods);
    });

    it('should not return default formatter if function is passed', function () {
      restrictLogMethods(['log', 'info']);
      expect(allowedMethods).not.toBe(logMethods);
    });
  });

  describe('disableDefaultColors Spec', function () {

    afterEach(function () {
      useDefaultColors = true;
    });
    it('should keep useDefaultColors as true when input is not a boolean', function () {
      disableDefaultColors(null);
      expect(useDefaultColors).toBeTruthy();
    });

    it('should keep useDefaultColors as true when input is false', function () {
      disableDefaultColors(false);
      expect(useDefaultColors).toBeTruthy();
    });

    it('should set useDefaultColors to false when true is passed', function () {
      disableDefaultColors(true);
      expect(useDefaultColors).toBeFalsy();
    });
  });

  describe('configureLogFilters Spec', function () {
    var tempConfig;
    beforeEach(function () {
      tempConfig = angular.copy(filterConfig);
    });
    afterEach(function () {
      filterConfig = angular.copy(tempConfig);
    });

    it('should keep default log filters when an array is not passed', function () {
      configureLogFilters(null);
      expect(filterConfig.logFilters).toEqual([]);

      configureLogFilters(3);
      expect(filterConfig.logFilters).toEqual([]);

      configureLogFilters({pass: 'csdacdas'});
      expect(filterConfig.logFilters).toEqual([]);
    });
    it('should keep default log filters when an array of strings is not passed', function () {
      configureLogFilters({logFilters: [null, {}, 2, ['asasa']]});
      expect(filterConfig.logFilters).toEqual([]);
    });
    it('should add log filter keys when an array of strings is  passed', function () {
      configureLogFilters({logFilters: ['asasa']});
      expect(filterConfig.logFilters).toEqual(['asasa']);
    });
    it('should not override filter string when a string is not provided', function () {
      configureLogFilters({logFilters: ['password'], filterString: null});
      expect(filterConfig.filterString).toBe('[FILTERED]');
    });
    it('should override filter string when a string is provided', function () {
      configureLogFilters({logFilters: ['password'], filterString: 'null'});
      expect(filterConfig.filterString).toBe('null');
    });


    it('should add log filter keys when an array of strings is passed while ommitting keys already listed', function () {
      configureLogFilters({logFilters: ['password', 'password']});
      expect(filterConfig.logFilters).toEqual(['password']);
    });
  });

});
