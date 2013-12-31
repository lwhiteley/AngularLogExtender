describe('getInstance function Spec', function () {
    var temp = _$log;
    beforeEach(function () {
        ngLog = $injector.get('$log');
        _$log = ngLog;
        spyOn(window, 'printOverrideLogs').andCallThrough();
    });
    afterEach(function () {
        _$log = temp;
    });

    describe('getInstance function Spec - global enabled flag is true', function () {
        beforeEach(function () {
            $log.enableLog(true);
        });

        afterEach(function () {
            $log.enableLog(false);
        });

        it('should expect global debug flag to be enabled ', function () {
            expect($log.logEnabled()).toBeTruthy();
        });

        it('should call printOverrideLogs function without className or override flag', function () {
            var logEx = getInstance();
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), false, true, null, true);
        });

        it('should call printOverrideLogs function with override flag set to false', function () {
            var logEx = getInstance(false);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, false, null, true);
        });

        it('should call printOverrideLogs function with override flag set to true', function () {
            var logEx = getInstance(true);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, true, null, true);
        });

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController';
            var logEx = getInstance(className);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), false, true, className, true);            
        });

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController',
                bFlag = false,
                logEx = getInstance(className, bFlag);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, bFlag, className, true);            
        });        

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController',
                bFlag = true,
                logEx = getInstance(className, true);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), bFlag, bFlag, className, true);            
        });    

    });

    describe('getInstance function Spec - global enabled flag is false', function () {

        it('should expect global debug flag to be disabled ', function () {
            expect($log.logEnabled()).toBeFalsy();
        });

        it('should call printOverrideLogs function without className or override flag', function () {
            var logEx = getInstance();
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), false, true, null, false);
        });

        it('should call printOverrideLogs function with override flag set to false', function () {
            var logEx = getInstance(false);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, false, null, false);
        });

        it('should call printOverrideLogs function with override flag set to true', function () {
            var logEx = getInstance(true);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, true, null, false);
        });

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController';
            var logEx = getInstance(className);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), false, true, className, false);            
        });

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController',
                bFlag = false,
                logEx = getInstance(className, bFlag);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), true, bFlag, className, false);            
        });        

        it('should call printOverrideLogs function with className', function () {
            var className = 'CoreController',
                bFlag = true,
                logEx = getInstance(className, true);
            expect(printOverrideLogs).toHaveBeenCalled();
            expect(printOverrideLogs).toHaveBeenCalledWith(jasmine.any(Object), bFlag, bFlag, className, false);            
        });  

    });
});
