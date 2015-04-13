describe('exposeSafeLog function Spec', function () {
	var logEx, ngLog;

	beforeEach(function () {
		ngLog = $injector.get('$log');
		logEx = exposeSafeLog(ngLog);
	});

	it('should return an extended log object when the original angular log is passed with getInstance undefined', function () {
		expect(logEx).toBeDefined();
		expect(logEx.getInstance).toBeUndefined();
		expect(logEx.log).toBeDefined();
		expect(logEx.debug).toBeDefined();
		expect(logEx.warn).toBeDefined();
		expect(logEx.info).toBeDefined();
		expect(logEx.error).toBeDefined();
		expect(logEx.isEnabled).toBeFalsy();
	});

	it('should return an extended log object when the original angular log is passed with getInstance defined', function () {
		angular.extend(logEx, {
			getInstance: function () {
				return "something";
			}
		});
		expect(logEx).toBeDefined();
		expect(logEx.getInstance).toBeDefined();
		expect(logEx.log).toBeDefined();
		expect(logEx.debug).toBeDefined();
		expect(logEx.warn).toBeDefined();
		expect(logEx.info).toBeDefined();
		expect(logEx.error).toBeDefined();
		expect(logEx.isEnabled).toBeFalsy();
	});

});
