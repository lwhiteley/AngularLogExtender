describe('isObjectorArray Spec', function () {

	it('should be false when an object or array is not found ', function () {
		expect(isObjectOrArray(null)).toBeFalsy();
		expect(isObjectOrArray(true)).toBeFalsy();
		expect(isObjectOrArray(/(black)/)).toBeFalsy();
		expect(isObjectOrArray(3)).toBeFalsy();
	});

	it('should be true when an object or array is  found ', function () {
		expect(isObjectOrArray([null])).toBeTruthy();
		expect(isObjectOrArray({val: true})).toBeTruthy();
	});
});
