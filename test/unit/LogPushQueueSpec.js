describe('log push queue Spec', function () {


    describe('add log to queue Spec', function () {
        var temp;
        beforeEach(function () {
            temp = logPushQueue;
        });
        afterEach(function () {
            logPushQueue = [];
        });

        it('should set logPushQueue when args is an array ', function () {
            addToLogPushQueue(['this is a log message args', true]);
            expect(logPushQueue.length).toBe(1);
            expect(itypeof(logPushQueue[0])).toBe('object');
        });

        it('should not set logPushQueue when args is not an array ', function () {
            addToLogPushQueue('this is a log message args');
            expect(logPushQueue.length).toBe(0);
        });
    });

});
