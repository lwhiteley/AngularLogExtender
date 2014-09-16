describe('prepareLogFn function Spec', function () {
    var logFn, ngLog;
    beforeEach(function () {
        ngLog = $injector.get('$log');
        logFn = ngLog.log;
        spyOn(logFn, 'apply');
    });

    describe('prepareLogFn function Spec - global enabled flag is false', function () {
        it('should not call apply when no params are sent', function () {
            var exFn = prepareLogFn(null);
            exFn();
            expect(logFn.apply).not.toHaveBeenCalled();
        });
        it('should not call apply when override is false and useOverride is false', function () {
            var exFn = prepareLogFn(logFn, "", false, false);
            exFn();
            expect(logFn.apply).not.toHaveBeenCalled();
        });
        it('should not call apply when  override is false and useOverride is true', function () {
            var exFn = prepareLogFn(logFn, "", false, true);
            exFn();
            expect(logFn.apply).not.toHaveBeenCalled();
        });
        it('should  call apply when  override is true and useOverride is true', function () {
            var exFn = prepareLogFn(logFn, "", true, true);
            exFn();
            expect(logFn.apply).toHaveBeenCalled();
        });
    });

    describe('prepareLogFn function Spec - global enabled flag is true', function () {
        beforeEach(function () {
            $log.enableLog(true);
        });
        afterEach(function () {
            $log.enableLog(false);
        });
        it('should  call apply when no params are sent', function () {
            var exFn = prepareLogFn(null);
            exFn();
            expect(logFn.apply).not.toHaveBeenCalled();
        });
        it('should not call apply when override is false and useOverride is true', function () {
            var exFn = prepareLogFn(logFn, "", false, true);
            exFn();
            expect(logFn.apply).not.toHaveBeenCalled();
        });
        it('should  call apply when override is false and useOverride is false', function () {
            var exFn = prepareLogFn(logFn, "", false, false);
            exFn();
            expect(logFn.apply).toHaveBeenCalled();
        });
        it('should  call apply when  override is true and useOverride is true', function () {
            var exFn = prepareLogFn(logFn, "", true, true);
            exFn();
            expect(logFn.apply).toHaveBeenCalled();
        });
    });

    describe('prepareLogFn function Spec - global enabled flag is true, with colorCss', function () {
        beforeEach(function () {
            $log.enableLog(true);
            spyOn(window, 'colorify');
        });
        afterEach(function () {
            $log.enableLog(false);
        });
        it('should not call colorify when colorCss is not a string ', function () {
            var exFn = prepareLogFn(logFn, "", true, true, false, null);
            exFn();
            expect(colorify).not.toHaveBeenCalled();
        });

        it('should call colorify when colorCss is a string but canColorize returns false', function () {
            spyOn(window, 'validateColorizeInputs').andCallFake(function() {
                return false;
            });
            var exFn = prepareLogFn(logFn, "", true, true, false,"css:jj;");
            exFn();
            expect(colorify).not.toHaveBeenCalled();
        });

        it('should call colorify when colorCss is a string ', function () {
            spyOn(window, 'validateColorizeInputs').andCallFake(function() {
                return true;
            });
            var exFn = prepareLogFn(logFn, "", true, true, false,"css:jj;");
            exFn();
            expect(colorify).toHaveBeenCalled();
        });
    });

    describe('prepareLogFn function Spec - global enabled flag is true, with template engine', function () {
        beforeEach(function () {
            $log.enableLog(true);
            spyOn(window, 'supplant').andCallThrough();
        });
        afterEach(function () {
            $log.enableLog(false);
        });
        it('should not call supplant when useTemplate is false ', function () {
            var exFn = prepareLogFn(logFn, "", true, true, null, false);
            exFn();
            expect(supplant).not.toHaveBeenCalled();
        });

        it('should not call supplant when useTemplate is set ', function () {
            var exFn = prepareLogFn(logFn, "", true, true, null);
            exFn();
            expect(supplant).not.toHaveBeenCalled();
        });

        it('should call supplant when useTemplate is a boolean and validateTemplateInputs returns false ', function () {
            spyOn(window, 'validateTemplateInputs').andCallFake(function() {
                return false;
            });
            var exFn = prepareLogFn(logFn, "", true, true, true, "css:jj;");
            exFn();
            expect(supplant).not.toHaveBeenCalled();
        });

        it('should call supplant when useTemplate is a boolean and validateTemplateInputs returns true ', function () {
            spyOn(window, 'validateTemplateInputs').andCallFake(function() {
                return true;
            });

            var exFn = prepareLogFn(logFn, "", true, true, true, "css:jj;");
            exFn();
            expect(supplant).toHaveBeenCalled();
        });


    });
    describe('prepareLogFn function Spec - when supplant returns a string ', function () {
        beforeEach(function () {
            $log.enableLog(true);
            spyOn(window, 'supplant').andCallThrough().andReturn('fghfgh');
        });
        afterEach(function () {
            $log.enableLog(false);
        });
        it('should call supplant when useTemplate is a boolean and validateTemplateInputs returns true ', function () {
            spyOn(window, 'validateTemplateInputs').andCallFake(function() {
                return true;
            });

            var exFn = prepareLogFn(logFn, "", true, true, "css:jj;", true);
            exFn();
            expect(supplant).toHaveBeenCalled();
        });

    });

    describe('prepareLogFn function Spec - test filterSensitiveValues scenarios - ', function () {
      var tempConfig;
      beforeEach(function () {
          $log.enableLog(true);
          spyOn(window, 'filterSensitiveValues').andCallThrough();
          tempConfig = angular.copy(filterConfig);
      });
      afterEach(function () {
          $log.enableLog(false);
          filterConfig = angular.copy(tempConfig);
      });
      it('should call filterSensitiveValues lofFilters array is not empty', function () {
          filterConfig.logFilters = ['password'];
          var exFn = prepareLogFn(logFn, "", true, true, "css:jj;", true);
          exFn();
          expect(filterSensitiveValues).toHaveBeenCalled();
      });
      it('should not call filterSensitiveValues lofFilters array is empty', function () {
          var exFn = prepareLogFn(logFn, "", true, true, "css:jj;", true);
          exFn();
          expect(filterSensitiveValues).not.toHaveBeenCalled();
      });

    });

});
