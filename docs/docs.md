

<!-- Start dist/log-ex-unobtrusive.js -->

Log Unobtrusive Extension v0.0.7-sha.7246606

Used within AngularJS to enhance functionality within the AngularJS $log service.

*Module Dependency can be added to a angular project as follows :*
```javascript
  var app = angular.module('myAngularApp', ['log.ex.uo']);
```

*Usage :*

```javascript
     app.controller('CoreController', ['$scope','$log', function($scope, $log) {
         $log.log("Simple Log Extender Example");
     }]);
```

## defaultLogMethods

default log methods available

Currently supports :
```json
   ['log', 'info', 'warn', 'debug', 'error']
```

## colorifySupportedBrowsers

list of browsers that support colorify

Currently supports :
```json
   ['chrome', 'firefox']
```

## useDefaultColors

flag to activate/deactivate default log method colors

## cssKeys

list of known keys used to style logs

## defaultLogMethodColors

default colours for each log method

## allowedMethods

publicly allowed methods for the extended $log object.
this give the developer the option of using special features
such as setting a className and overriding log messages.
More Options to come.

## trimString(value)

Trims whitespace at the beginning and/or end of a string

### Params:

* **String** *value* - string to be trimmed

## itypeof(val)

The itypeof operator returns a string indicating the type of the unevaluated operand.

### Params:

* ***** *val* - object to be evaluated

## isBoolean(value)

checks if a variable is of @type {boolean}

### Params:

* **boolean** *value* - flag to be evaluated

## isValidString(value)

This method checks if a variable is of type {string}
and if the string is not an empty string

### Params:

* **string** *value* - string to be evaluated

## isSubString(sub, full)

checks if @param1 is a substring of @param2

### Params:

* **string** *sub* - partial string that may be a sub string
* **string** *full* - full string that may have the unevaluated substring

## validateTemplateInputs(useTemplate, args)

The following method checks if useTemplate value is true and
if the log arguments array length is two

### Params:

* **boolean** *useTemplate* - flag that configures the usage of the template engine
* ***[]** *args* - list of log arguments that should match pattern creating template strings

## supplant(template, values, pattern)

supplant is a string templating engine that replaces patterns
in a string with values from a template object

### Params:

* **string** *template* - string with patterns to be replaced by values
* **object** *values* - object with values to replace in template string
* **RegExp=** *pattern* - custom regular expression of pattern to replace in template string

{RegExp=}

## isColorifySupported()

Checks if the current browser is a part of the supported browser list for adding colors

Stores flag to know if current browser is colorify supported

## validateColorizeInputs(args)

The following method checks if the log arguments array length is one and the element is a string

### Params:

* ***[]** *args* - unevaluated log method arguments array that should contain only one element of type {string}

## containsColorCssKeys(css)

The following method does partial validation to ensure css string contains known keys

### Params:

* **string** *css* - css string to be evaluated

## validateColorCssString(value)

The following method does partial validation to ensure css string is valid

### Params:

* **string** *value* - css string to be evaluated

## colorify(message, colorCSS, prefix)

The following takes a string a returns an array as parameter if browser is supported
e.g. Expected outcome $log.log('%c Oh my heavens! ', 'background: #222; color: #bada55');

### Params:

* **string** *message* - string to be coloured
* **string** *colorCSS* - css string to apply to message
* **string** *prefix* - log prefix to be prepended to message

## defaultLogPrefixFn(className)

This is the default method responsible for formatting the prefix of all extended $log messages pushed to the console

See: overrideLogPrefix to override the logPrefix

### Params:

* **string=** *className* - name of the component class ($controller, $service etc.)

{String=}

## getLogPrefix(className)

This method is responsible for generating the prefix of all extended $log messages pushed to the console

### Params:

* **string=** *className* - name of the component class ($controller, $service etc.)

{String=}

## logEnhancerObj()

Encapsulates functionality to extends $log and expose additional functionality

## processUseOverride(override)

processUseOverride returns true if the override flag is set.
this is used to activate the override functionality.

### Params:

* **boolean** *override* - unevaluated override flag

## processOverride(override)

processOverride only takes true or false as valid input.
any other input will resolve as true.
this function is used to override the global flag for displaying logs

### Params:

* **boolean** *override* - unevaluated override flag

## activateLogs(enabled, override)

The following method checks if the global enabled flag and the override flag are set as type {boolean}
variables. If both are set it returns the value of the override flag to control $log outputs

### Params:

* **boolean** *enabled* - global flag that activates/deactivates logging
* **boolean** *override* - flag that overrides the global enabled flag

## printOverrideLogs(-, -, -, -, -)

The following method handles printing a message to the console indicating
if a $log instance is using an override.
If logging is disabled globally & an override of true is set,
then a message will be displayed for the specific $log instance
if logging is enabled globally & an override of false is set,
then a message will be displayed for the specific $log instance

### Params:

* **_$log** *-* $log instance
* **useOverride** *-* flag that defines logic to regard using the override
* **_override** *-* flag that overrides the global enabled flag
* **className** *-* name of the component class ($controller, $service etc.)
* **enabled** *-* global flag that activates/deactivates logging

## arrToObject(arr)

Converts an array to a object literal

### Params:

* ***[]** *arr* - array to be transformed to object literal

## createLogObj(oSrc, aMethods, func, aParams)

General purpose method for building $log objects.
This method also provides the capability to specify the log methods to expose

### Params:

* **Object** *oSrc* - $log instance
* **Array=** *aMethods* - list of $log methods
* **Function=** *func* - function that defines rules for custom $log instance
* **Array=** *aParams* - parameters to be used in prepareLogFn

{Function=}

{*Array=}

## enhanceLogger({Object})

Contains functionality for transforming the AngularJS $log
returns extended $log object

### Params:

* **$log** *{Object}* - original angular $log to be enhanced

## prepareLogFn(logFn, className, override, useOverride, colorCss, useTemplate)

Partial application to pre-capture a logger function

### Params:

* **Function** *logFn* - $log method
* ***** *className* - name of the component class ($controller, $service etc.)
* **boolean** *override* - flag that overrides the global enable flag
* **boolean** *useOverride* - flag that defines logic to consider using the override
* **string** *colorCss* - css styles for coloring log methods
* **boolean** *useTemplate* - enables/disables the template engine

## _$log

Capture the original $log functions; for use in enhancedLogFn()

## getInstance(className, override, useTemplate, colorCss)

Support to generate class-specific logger instance with/without className or override

### Params:

* ***** *className* - Name of object in which $log.<function> calls is invoked.
* **boolean=** *override* - activates/deactivates component level logging
* **boolean=** *useTemplate* - enables/disables the template engine
* **String=** *colorCss* - css styles for coloring log methods

{*=}

{boolean=}

{boolean=}

{String=}

## enabled

Used to enable/disable logging

Extends the $log object with the transformed native methods

### Params:

* **$log** *-* $log instance
* **function** *createLogObj* - defines transformation rules

## getInstance

Extend the $log with the {@see getInstance} method

## enableLog(flag)

The following method enable/disable logging globally

### Params:

* **boolean** *flag* - boolean flag specifying if log should be enabled/disabled

## logEnabled()

The following returns the status of the {@see enabled}

## exposeSafeLog(-)

The following function exposes the $decorated logger to allow the defaults to be overridden

### Params:

* **$log** *-* $log instance

## enableLogging(flag)

Used externally to enable/disable logging globally

Add the logExProvider dependency to your AngularJS app to configure logging. Pass true to the `logExProvider.enableLogging(boolean)`
function as a parameter to enable logging. This is set to false by default to disable logging in a production environment.
The Best practice is to keep this flag set to false in the master version of the code base,
given that some version control system is being used. See eg. below.
```javascript
     app.config(['logExProvider', function(logExProvider) {
         logExProvider.enableLogging(true);
      }]);
 ```

### Params:

* **boolean** *flag* - flag that sets whether logging is enabled/disabled

## restrictLogMethods(arrMethods)

Configure which log functions can be exposed at runtime

### Params:

* ***[]** *arrMethods* - list of methods that can be used

## overrideLogPrefix(logPrefix)

Modify the default log prefix

### Params:

* **Function** *logPrefix* - function that defines the rule for a custom log prefix

## disableDefaultColors(flag)

Turns off default coloring of logs

### Params:

* **boolean** *flag* - flag that configures disabling default log colors

## setLogMethodColor(methodName, colorCss)

Used to set a custom color to a specific $log method

### Params:

* **String** *methodName* - method name of the log method to assign a custom color
* **String** *colorCss* - css string that defines what colour to be set for the specified log method

## overrideLogMethodColors(overrides)

Used to set custom colors to multiple $log method

### Params:

* **object** *overrides* - object that defines log method color overrides

## useDefaultLogPrefix(flag)

Used to force default log prefix functionality

### Params:

* **boolean** *flag* - when passed true or flag is not set, it forces log-ex to use the default log prefix

## $get()

Default $get method necessary for provider to work

<!-- End dist/log-ex-unobtrusive.js -->

