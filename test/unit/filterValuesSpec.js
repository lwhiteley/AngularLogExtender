describe('filterValues Spec', function () {

  describe('filterValues Spec - test filterValues function', function () {
    var tempConfig;
    beforeEach(function () {
      tempConfig = angular.copy(filterConfig);
    });
    afterEach(function () {
      filterConfig = angular.copy(tempConfig);
    });

    it('should filter values for specified keys', function () {
        var val = [{password: '<fwefr23r>f</fwefr23r>', card: '2332414124', config: {}, list: [] }];
        var expected = [{password: defaultFilterString, card: '2332414124', config: {}, list: [] }];
        var result = filterValues(val);
        expect(result).toEqual(expected);
    });
    it('should not filter values for specified keys when an object is not found in log args', function () {
        var val = ["<fwefr23r>f</fwefr23r>"];
        var result = filterValues(val);
        expect(result).toEqual(val);
    });

    it('should not filter values when key not found in object', function () {
        var val = [{passwordField: '<fwefr23r>f</fwefr23r>', card: '2332414124', config: {}, list: [] }];
        var result = filterValues(val);
        expect(result).toEqual(val);
    });
    it('should not filter values for specified keys when an array is not received', function () {
        var val = "<fwefr23r>f</fwefr23r>";
        var result = filterValues(val);
        expect(result).toEqual(val);
    });

    it('should filter values for specified keys within multiple log arguments', function () {
        var val = [{password: '<fwefr23r>f</fwefr23r>', card: '2332414124'},
                   {password: '<fwefr23r>f</fwefr23r>', card: '2332414124'},
                   "some random string"];

        var expected = [{password: filterConfig.filterString, card: '2332414124'},
                        {password: filterConfig.filterString, card: '2332414124'},
                        "some random string"];

        var result = filterValues(val);
        expect(result).toEqual(expected);
    });
  });

});
