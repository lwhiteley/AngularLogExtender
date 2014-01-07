describe('Provider Func Spec', function() {
	afterEach(function () {
		enableGlobally = false;
	});

	it('should set enableGlobally to true when input flag is truthy', function() {
        enableLogging(true);
		expect(enableGlobally).toBe(true);
	});

	it('should set enableGlobally to true when input flag is falsy', function() {
        enableLogging(false);
		expect(enableGlobally).toBe(false);
	});

});