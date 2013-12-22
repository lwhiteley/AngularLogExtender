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
```
var app = angular.module('myAngularApp', ['log.extension.uo']);
```

######Step 2. Enable Debugging Globally to see logs

look for $delegate.setGlobalDebugFlag in the Configuration Section of the unobtrusive file and pass true to the function as a parameter. This is set to false by default to disable logging in a production environment. The Best practice is to keep this flag set to false in the master version of the code base, given that some version control system is being used.

```
//log-ex-unobtrusive.js  snippet
//=======================================================================//
// Configuration Section
//=======================================================================//	  
    	 var logEnhancer = new logEnhancerObj();  
    	 logEnhancer.enhanceLogger($delegate);
    	  
    	  // ensure false is being passed for production deployments
    	  //set to true for local dev
    	  $delegate.setGlobalDebugFlag(false); 

```
######Step 3. Print logs from any component (Controller, Directive, Service etc.)
Sample - Logging from a Controller
```
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log.log("Simple Log Extender Example"); 
}]);
```

######Step 4. Load the web page and look in the Developer Console
Sample Output
```
Dec-08-2013-12:50:52PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-12:50:52PM >>  Simple Log Extender Example 
```

##Advanced Use Cases
###Use Case 1: Set Component Class Name
This example can be used to know which component (controller, directive etc.) $log instances are being pushed from to the console. The new instance must be re-assigned to the $log object to take effect. This Advanced use case is always recommended to get more information from your application logs. 
#####Example
```
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
```
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance('CoreController', false);
      $log.log("Advanced Log Extender Example: Use Case 2: Eg 1"); 
}]);
```
######Output:
```
Dec-08-2013-1:08:34PM >>  CONFIG: LOGGING ENABLED GLOBALLY
Dec-08-2013-1:08:34PM::Called by:CoreController >> [OVERRIDE] LOGGING DISABLED - $log disabled for this instance 
```

#####Eg 2.
Setting the override without the class name
```
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
```
app.controller('CoreController', ['$scope','$log', function($scope, $log) {
      $log = $log.getInstance('CoreController', true);
      $log.log("Advanced Log Extender Example: Use Case 3: Eg 1 "); 
}]);
```
######Output:
```
Dec-08-2013-1:20:56PM::CoreController >> [OVERRIDE] LOGGING ENABLED - $log enabled for this instance
Dec-08-2013-1:20:56PM::CoreController >>  Advanced Log Extender Example: Use Case 3: Eg 1 
```

#####Eg 2.
Setting the override without the class name
```
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
2. Different version using AMD to bring in different functions as seen on http://solutionoptimist.com
3. Addition of tests
4. remove the need to reassign $log instance


[![Build Status](https://travis-ci.org/ferronrsmith/AngularLogExtender.png?branch=master)](https://travis-ci.org/ferronrsmith/AngularLogExtender)

[![Coverage Status](https://coveralls.io/repos/ferronrsmith/AngularLogExtender/badge.png)](https://coveralls.io/r/ferronrsmith/AngularLogExtender)