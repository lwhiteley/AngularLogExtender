describe('Log Object Create Method Spec', function () {

	it('should return an object of noop if an empty method array is passed', function () {
		var aMethods = [],
			myLog = {},
			resultSet = createLogObj(myLog, aMethods);

		delete resultSet.getInstance;
		angular.forEach(resultSet, function (key) {
			expect(key).toEqual(angular.noop);
		});
	});

	it('should return an object of noop if a null method array is passed', function () {
		var aMethod = null,
			mYLog = {},
			resultSet = createLogObj(mYLog, aMethod);

		delete resultSet.getInstance;
		angular.forEach(resultSet, function (key) {
			expect(key).toEqual(angular.noop);
		});
	});

	it('should return resultSet with method array objects', function () {
		var myLog = {},
			resultSet;
		angular.forEach(allowedMethods, function (val, idx) {
			myLog[val] = idx;
		});
		resultSet = createLogObj(myLog, allowedMethods);
		angular.forEach(resultSet, function (idx, method) {
			expect(allowedMethods[idx]).toBe(method);
		});
	});


	describe('Advanced Usage: createLogObject with Function + Params', function () {
		var utils;

		beforeEach(function () {
			utils = {
				myLog: {},
				resultSet: {},
				arr: [1, 2, 3, 4, 5],
				myFunc: function () {
					var params = Array.prototype.slice.call(arguments);
					return params.reduce(function (a, b) {
						return a + b;
					});
				}
			};
			spyOn(utils, 'myFunc').andCallThrough();
			useDefaultColors = false;
			angular.forEach(allowedMethods, function (val, idx) {
				utils.myLog[val] = idx;
			});

			utils.resultSet = createLogObj(utils.myLog, allowedMethods, utils.myFunc, utils.arr);
		});

		afterEach(function () {
			useDefaultColors = true;
		});

		describe('Advanced Usage: createLogObject without defaultColors disabled', function () {
			beforeEach(function () {
				useDefaultColors = false;
				spyOn(window, 'validateColorCssString');
			});

			afterEach(function () {
				useDefaultColors = true;
			});

			it('should have mostRecentCall array with the last idx', function () {
				// should have the last array index
				utils.arr.unshift(allowedMethods.length - 1);
				//utils.arr[4] = undefined;
				expect(utils.myFunc.mostRecentCall.args).toEqual(utils.arr);
				expect(validateColorCssString).not.toHaveBeenCalled();
			});

			it('should call myFunc with utils.arr prefixed with idx', function () {
				angular.forEach(utils.myFunc.calls, function (value, idx) {
					// avoid src propagation by creating a new array on each iteration
					var newarr = [];
					angular.copy(utils.arr, newarr);
					newarr.unshift(idx);
					expect(value.args).toEqual(newarr);
				});
				expect(validateColorCssString).not.toHaveBeenCalled();
			});

			it('should have n arguments for call to myFunc', function () {
				var main = [];
				angular.forEach(allowedMethods, function (val, idx) {
					var newArr = [];
					angular.copy(utils.arr, newArr);
					newArr.unshift(idx);
					main.push(newArr);
				});
				expect(utils.myFunc.argsForCall).toEqual(main);
				expect(validateColorCssString).not.toHaveBeenCalled();
			});

			it('should call myFunc method', function () {
				expect(utils.myFunc).toHaveBeenCalled();
			});

			it('should call myFunc n times', function () {
				expect(utils.myFunc.callCount).toBe(allowedMethods.length);
				expect(validateColorCssString).not.toHaveBeenCalled();
			});

			it('should return resultSet with result of function invocation', function () {

				angular.forEach(utils.resultSet, function (val, method) {
					// 15 in this case represent the total of the flatten array [1,2,3,4,5] := 1+2+3+4+5 = 15
					expect(allowedMethods[val - 15]).toBe(method);
					expect(validateColorCssString).not.toHaveBeenCalled();
				});
			});
		});

	});

	describe('Advanced Usage: createLogObject with defaultColors Enabled with non-valid css color', function () {
		var utils;
		beforeEach(function () {
			useDefaultColors = true;

			utils = {
				myLog: {},
				resultSet: {},
				params: [],
				arr: [1, 2, 3, 4, 'kkk'],
				myFunc: function () {
					var params = Array.prototype.slice.call(arguments);
					//console.log(params);
					return params[5];
				}
			};
			spyOn(window, 'validateColorCssString').andCallThrough();
			isColorifySupportedBrowser = (true);

			angular.forEach(allowedMethods, function (val) {
				utils.myLog[val] = defaultLogMethodColors[val];
			});

			utils.resultSet = createLogObj(utils.myLog, allowedMethods, utils.myFunc, utils.arr);
		});

		afterEach(function () {
			isColorifySupportedBrowser = false;
		});

		it('should have called validateColorCssString and set colorCss to default colors', function () {
			expect(validateColorCssString).toHaveBeenCalled();
			expect(utils.resultSet).toEqual(utils.myLog);
		});

	});


	describe('Advanced Usage: createLogObject with defaultColors Enabled and valid css override is passed', function () {
		var utils;
		beforeEach(function () {
			useDefaultColors = true;

			utils = {
				myLog: {},
				resultSet: {},
				params: [],
				arr: [1, 2, 3, 4, 'color: red'],
				myFunc: function () {
					var params = Array.prototype.slice.call(arguments);
					//console.log(params);
					return params[5];
				}
			};
			spyOn(window, 'validateColorCssString').andCallThrough();
			isColorifySupportedBrowser = (true);

			angular.forEach(allowedMethods, function (val) {
				utils.myLog[val] = defaultLogMethodColors[val];
			});

			utils.resultSet = createLogObj(utils.myLog, allowedMethods, utils.myFunc, utils.arr);
		});

		afterEach(function () {
			isColorifySupportedBrowser = false;
		});

		it('should have called validateColorCssString ', function () {
			expect(validateColorCssString).toHaveBeenCalled();
		});

		it('should have set colorCss override to all log methods', function () {
			expect(utils.resultSet).not.toEqual(utils.myLog);
			expect(utils.resultSet.log).toBe(utils.arr[4]);
			expect(utils.resultSet.warn).toBe(utils.arr[4]);
			expect(utils.resultSet.info).toBe(utils.arr[4]);
			expect(utils.resultSet.error).toBe(utils.arr[4]);
			expect(utils.resultSet.debug).toBe(utils.arr[4]);
		});

	});
});
