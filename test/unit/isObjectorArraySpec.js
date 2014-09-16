describe('isObjectorArray Spec', function() {

  it('should be false when an object or array is not found ', function() {
    expect(isObjectOrArray(null)).toBe(false);
    expect(isObjectOrArray(true)).toBe(false);
    expect(isObjectOrArray(/(black)/)).toBe(false);
    expect(isObjectOrArray(3)).toBe(false);
  });

  it('should be true when an object or array is  found ', function() {
    expect(isObjectOrArray([null])).toBe(true);
    expect(isObjectOrArray({val: true})).toBe(true);
  });

});
