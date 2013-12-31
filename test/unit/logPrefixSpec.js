describe('Log Prefix Spec', function() {
	var clock, formattedDate;

	beforeEach(function () {
		clock = angular.mock.$mockDate();
		datespy.clock.create(new Date(2010, 4, 2, 12, 42, 53).getTime());
		formattedDate = $filter('date')(new Date(), "MMM-dd-yyyy-h:mm:ssa");
	});

	afterEach(function () {
		clock.$restoreDate();
	});

	it('should output message with the date May-02-2010-12:42:53PM & seperator ', function() {
		expect(getLogPrefix(null)).toBe(formattedDate + " >> ");
	});

	it('should output message with the date May-02-2010-12:42:53PM, className, seperator ', function() {
		var $controller = "CoreController";
		expect(getLogPrefix($controller)).toBe(formattedDate + "::" + $controller +" >> ");
	});

	it('should output message with the date May-02-2010-12:42:53PM & seperator when invalid string is passed', function() {
		angular.forEach([false, true, 1, -1, new Date(), {}, null, undefined, []], function(value){
			expect(getLogPrefix(value)).toBe(formattedDate + " >> ");
		});
	});

});