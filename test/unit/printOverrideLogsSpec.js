describe('printOverrideLogs function Spec', function () {
    var clock, formattedDate, logSpy, pLog;

    beforeEach(function () {
        clock = angular.mock.$mockDate();
        datespy.clock.create(new Date(2010, 4, 2, 12, 42, 53).getTime());
        formattedDate = $filter('date')(new Date(), "MMM-dd-yyyy-h:mm:ssa");

        logSpy = jasmine.createSpy('$logSpy');
        pLog = {
            log: function (args) {
                logSpy(args);
            }
        };
    });

    afterEach(function () {
        clock.$restoreDate();
    });

    it('should not call log spy', function () {
        printOverrideLogs(pLog, true, false, null, false);
        expect(logSpy).not.toHaveBeenCalled();
    });

    describe('printOverrideLogs function Spec - enabled flag set to false - with className', function () {
        var className;

        beforeEach(function () {
            className = "CoreController";
            printOverrideLogs(pLog, true, true, className, false);
        });

        it('should not contain className in $log.log argument', function () {
            expect(logSpy).toHaveBeenCalled();
        });

        it('should have argument with formatted Message & log prefix', function () {
            expect(logSpy).toHaveBeenCalledWith(formattedDate + " >> [OVERRIDE] LOGGING ENABLED - $log enabled for " + className);
        });
    });

    describe('printOverrideLogs function Spec - enabled flag set to false - without className', function () {
        var className;

        beforeEach(function () {
            className = null;
            printOverrideLogs(pLog, true, true, className, false);
        });

        it('should not contain className in $log.log argument', function () {
            expect(logSpy).toHaveBeenCalled();
        });

        it('should have argument with formatted Message & log prefix', function () {
            expect(logSpy).toHaveBeenCalledWith(formattedDate + " >> [OVERRIDE] LOGGING ENABLED - $log enabled for this instance");
        });
    });

    describe('printOverrideLogs function Spec - enabled flag set to true - with className', function () {
        var className;

        beforeEach(function () {
            className = "CoreController";
            printOverrideLogs(pLog, true, false, className, true);
        });

        it('should not contain className in $log.log argument', function () {
            expect(logSpy).toHaveBeenCalled();
        });

        it('should have argument with formatted Message & log prefix', function () {
            expect(logSpy).toHaveBeenCalledWith(formattedDate + " >> [OVERRIDE] LOGGING DISABLED - $log disabled for " + className);
        });
    });

    describe('printOverrideLogs function Spec - enabled flag set to true - without className', function () {
        var className;

        beforeEach(function () {
            className = null;
            printOverrideLogs(pLog, true, false, className, true);
        });

        it('should not contain className in $log.log argument', function () {
            expect(logSpy).toHaveBeenCalled();
        });

        it('should have argument with formatted Message & log prefix', function () {
            expect(logSpy).toHaveBeenCalledWith(formattedDate + " >> [OVERRIDE] LOGGING DISABLED - $log disabled for this instance");
        });
    });

});