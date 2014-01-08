AngularLogExtender
==================

This is an extension of the Angular $log functionality. It uses the native $decorator to push the $log pass its capabilities and provide new functionality such as configuring the $log for different environments such as production and development.

###Notes

The prefered file to use is the log-ex-unobtrusive.js file. With this file you can just include the module to your AngularJs Application and it does all the work. Methods native to the log extender are not publicly available in your AngularJs Application so this extension can be used as a standalone plugin.

To view the blog this module was extended from and inspired by, go to 
http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/

Feel Free to make your own contributions to this module so we can make it better :)

###Configurations

1. Set $log Instance Class Name
2. Enable/Disable Logging Globally
3. Enable/Disable Logging at a Component Level

##How to Use 

######Step 1. Add Module Dependency
```javascript
var app = angular.module('myAngularApp', ['log.extension.uo']);
```

######Step 2. Enable Debugging Globally to see logs

Add the logExProvider dependency to your AngularJS app to configure logging. Pass true to the logExProvider.enableLogging(boolean) function as a parameter to enable logging. This is set to false by default to disable logging in a production environment. The Best practice is to keep this flag set to false in the master version of the code base, given that some version control system is being used. See eg. below.

```javascript
app.config([ 'logExProvider', function(logExProvider) {
    logExProvider.enableLogging(true);
}]);
```

######Step 3. Print Log from any component (Controller, Directive etc..)

```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
    $log.log("Advanced Log Extender Example: Use Case 1: Example"); 
}]);
```

######Step 4. Load the web page and look in the Developer Console
Sample Output
```
Dec-08-2013-12:50:52PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-12:50:52PM >>  Simple Log Extender Example 
```
##Advanced Configurations

######1. Restrict Logging to specific methods

Add the logExProvider dependency to your AngularJS app to configure logging. Pass an array with the methods that should be enabled to the `restrictLogMethods` method. `$warn, $debug, $error` messages won't be displayed in the console

```javascript
app.config([ 'logExProvider', function(logExProvider) {
    logExProvider.restrictLogMethods(['log', 'info']);
}]);
```
OR constants can be used instead of typing the strings

```javascript
app.config([ 'logExProvider', function(logExProvider) {
    var lm = logExProvider.$get().logMethods;
    logExProvider.restrictLogMethods([ lm.log, lm.info ]);
}]);
```

######2. Override Log Prefix - Log Prefix Formatter

Add the logExProvider dependency to your AngularJS app to configure logging. Pass a custom function that accepts a `className` param to the `overrideLogPrefix` method

```javascript
app.config([ 'logExProvider', function(logExProvider) {
    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get( '$filter' );
        var formatMessage = "";
        var separator = " >> ";
        var format = "MMMM-dd-yyyy-h:mm:ssa";
        var now = $filter('date')(new Date(), format);
        return "" + now + (className === null ? "" : "::" + className) + separator;
    });
}]);
```
##Advanced Use Cases
###Use Case 1: Set Component Class Name
This example can be used to know which component (controller, directive etc.) $log instances are being pushed from to the console. The new instance must be re-assigned to the $log object to take effect. This Advanced use case is always recommended to get more information from your application logs. 
#####Example
```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance('CoreController');
      $log.log("Advanced Log Extender Example: Use Case 1: Example"); 
}]);
```
######Output:
```
Dec-08-2013-1:00:47PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-1:00:47PM::CoreController >>  Advanced Log Extender Example: Use Case 1
```

###Use Case 2: Disable Logging within a specific Component
This example is used to disable logging to the console from a specific component. The new instance must be re-assigned to the $log object to take effect.

#####Eg 1.
```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance('CoreController', false);
      $log.log("Advanced Log Extender Example: Use Case 2: Eg 1"); 
}]);
```
######Output:
```
Dec-08-2013-1:08:34PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-1:08:34PM >> [OVERRIDE] LOGGING DISABLED - $log disabled for CoreController
```

#####Eg 2.
Setting the override without the class name
```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance(false);
      $log.log("Advanced Log Extender Example: Use Case 2: Eg 2 "); 
}]);
```
######Output:
```
Dec-08-2013-1:08:34PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-1:08:34PM >> [OVERRIDE] LOGGING DISABLED - $log disabled for this instance 
```

###Use Case 3: Enable Logging within a specific Component 
For this override to work, Debugging must be globally disabled. The practical use for this scenario is when you want to enable logging for a specific component in production to see the logs there. 
#####Eg 1.
```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance('CoreController', true);
      $log.log("Advanced Log Extender Example: Use Case 3: Eg 1 "); 
}]);
```
######Output:
```
Dec-08-2013-1:20:56PM >> [OVERRIDE] LOGGING ENABLED - $log enabled for CoreController
Dec-08-2013-1:20:56PM::CoreController >>  Advanced Log Extender Example: Use Case 3: Eg 1 
```

#####Eg 2.
Setting the override without the class name
```javascript
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance(true);
      $log.log("Advanced Log Extender Example: Use Case 3: Eg 2"); 
}]);
```
######Output:
```
Dec-08-2013-1:20:56PM >> [OVERRIDE] LOGGING ENABLED - $log enabled for this instance
Dec-08-2013-1:20:56PM >>  Advanced Log Extender Example: Use Case 3: Eg 2
```
####NB.
These examples only show the use of $log.log(), however, the other $log methods were left in tact and can be used as well.

These are:
```
1. $log.warn()
2. $log.info()
3. $log.error()
4. $log.debug()
```
##Future Implementations

1. More configurations are being considered such as disabling timestamp to offer more customizations for a developers needs
2. remove the need to reassign $log instance
3. Log function level overriding


[![Build Status](https://travis-ci.org/ferronrsmith/AngularLogExtender.png?branch=master)](https://travis-ci.org/ferronrsmith/AngularLogExtender)

[![Coverage Status](https://coveralls.io/repos/ferronrsmith/AngularLogExtender/badge.png)](https://coveralls.io/r/ferronrsmith/AngularLogExtender)
