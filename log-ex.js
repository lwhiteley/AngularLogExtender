/**
 * Log Extension
 *
 * Used within AngularJS to enhance functionality within the AngularJS $log service.
 *
 * @original-author  Thomas Burleson
 * @website http://www.theSolutionOptimist.com
 * 
 * Modifications made by @author Layton Whiteley:
 * - Modified to be a full stand-alone Angular Application for reuse
 * - Has global and feature level activation/disabling for $log
 * - Created and tested with AngularJS v.1.2.3
 */  

var logEx = angular.module("log.extension", [ ]);
  
logEx.config(['$provide', function($provide){
      // Register our $log decorator with AngularJS $provider
      $provide.decorator( '$log', [ "$delegate",'logEnhancer', function( $delegate, logEnhancer ){
          // NOTE: the LogEnhancer module returns a FUNCTION that we named `enhanceLogger`
          //       All the details of how the `enchancement` works is encapsulated in LogEnhancer!

    	  logEnhancer.enhanceLogger($delegate);
    	  
    	  // ensure false is being passed for production deployments
		  //set to true for local development
    	  $delegate.setGlobalDebugFlag(false);
    	  
    	  if( $delegate.isEnabled() ){
    		  $delegate.log("CONFIG: DEBUGGING ENABLED - $log has been activated globally");
    	  }
          return  logEnhancer.exposeSafeLog($delegate);
      }]);
  }]);
 


logEx.service('GetLogPrefix', ['$filter',  function( $filter){
	 /**
     * returns the formatted log prefix
     * */
	var getLogPrefix = function(className){
  	  	var formatMessage ="";
  	  	var format = "MMM-dd-yyyy-h:mm:ssa";
  	  	var now = $filter('date')(new Date(), format);
        if(className === undefined || className === null){
       	 formatMessage = "" + now  + " >> " ;
        }else{
       	 formatMessage = "" + now  + "::Called by:" + className;
        }
        return formatMessage;
    };
    return getLogPrefix;
}]);

logEx.service('ActivateLogs', [  function( ){
	 var activateLogs = function(enabled, override){
   	  if(enabled == false && override == true)  return true;
   	  if(enabled == true  && override == true)  return true;
   	  if(enabled == true  && override == false) return false;
   	  if(enabled == false && override == false) return false;
   	  
   	  return false;
     };
	return activateLogs;
}]);

logEx.service('PrintOverrideLogs', [  function(  ){
	var processOverrideLogs = function(_$log, useOverride, _override, className, enabled){
  	  if(enabled == false && useOverride && _override){
      	  _$log.log(logUtils.getLogPrefix(className) + "[OVERRIDE] DEBUGGING ENABLED - $log enabled for this instance" );
        }else if (enabled && useOverride && _override == false ){
      	  _$log.log(logUtils.getLogPrefix(className) + "[OVERRIDE] DEBUGGING DISABLED - $log disabled for this instance");
        }
    };
	return processOverrideLogs;
}]);

logEx.service('ProcessOverride', [  function( ){
	/**
     * process override only takes true or false as valid input. 
     * any other input will resolve as true.
     * this function is used to override the global flag for displaying logs
     * */
    var processOverride = function(override){
  	  if( override === null || override === undefined)  return true;
  	  if( override === true)  return true;
  	  if( override === false)  return false;
  	  return true;
    };
	return processOverride;
}]);

logEx.service('ProcessUseOverride', [  function( ){
	/**
     * processUseOverride returns true if the override flag is set. 
     * this is used to activate the override functionality.
     * */
	var processUseOverride = function(override){
  	  if( typeof override == 'boolean')  return true;
  	  return false;
    };
	return processUseOverride;
}]);

/**
 * LogUtils returns a collection of Util functions. 
 * */
logEx.service('LogUtils', [ 'GetLogPrefix','ActivateLogs', 'PrintOverrideLogs','ProcessUseOverride','ProcessOverride', 
                 function(GetLogPrefix, ActivateLogs, PrintOverrideLogs, ProcessUseOverride, ProcessOverride ){
	return {
		getLogPrefix: GetLogPrefix,
		activateLogs: ActivateLogs,
		printOverrideLogs: PrintOverrideLogs,
		processOverride: ProcessOverride,
		processUseOverride: ProcessUseOverride
	};
}]);

logEx.service('logEnhancer', [ 'LogUtils', function( logUtils){
	  var enabled = false;

	  var enhanceLoggerFn = function( $log ){
	      var separator = " >> ";
	      //original methods
	      /**
	       * Partial application to pre-capture a logger function
	       */
	  		var prepareLogFn = function( logFn, className, override, useOverride ){
	          var enhancedLogFn = function ( ){
	          	var activate = enabled;
	        	  if(useOverride){
	        		  activate = logUtils.activateLogs(enabled,override );
	        	  }
	              if(activate){
	            	 var args = Array.prototype.slice.call(arguments);
	                 var formatMessage = logUtils.getLogPrefix(className);
	                  args.unshift(formatMessage);
	                  logFn.apply( null, args );
	              }
	          };

	          // Only needed to support angular-mocks expectations
	          enhancedLogFn.logs = [ ];
	          return enhancedLogFn;
	      };
          /**
           * Capture the original $log functions; for use in enhancedLogFn()
           */
	         var  _$log = (function( $log ){
	              return {
	                  log   : $log.log,
	                  info  : $log.info,
	                  warn  : $log.warn,
	                  error : $log.error
	              };
	          })( $log),
	          
	          /**
	           * Support to generate class-specific logger instance with classname only
	           *
	           * @param className Name of object in which $log.<function> calls is invoked.
	           * @param colorCSS Object with CSS style color information for Chrome Dev Tools console log colorizing
	           *
	           * @returns {*} Logger instance
	           */
	          getInstance = function( className, _override, customSeparator ){
	        	 if(typeof className == "string"){
	        		 className = ( className !== undefined   ) ? className + (customSeparator || separator)  : "";
	        	 }else if(typeof className == "boolean"){
	        		 _override = className;
	        		 className = null;
	        	 }else{
	        		 className = null;
	        	 }
	              var useOverride = logUtils.processUseOverride(_override);
	              _override = logUtils.processOverride(_override);
	              logUtils.printOverrideLogs(_$log, useOverride, _override, className, enabled);
	              return {
	                  log   : prepareLogFn( _$log.log,    className, _override, useOverride ),
	                  info  : prepareLogFn( _$log.info,   className, _override, useOverride ),
	                  warn  : prepareLogFn( _$log.warn,   className, _override, useOverride ),
	                  error : prepareLogFn( _$log.error,  className, _override, useOverride )
	              };
	          };
	      $log.log   = prepareLogFn( $log.log, null, false, false );
	      $log.info  = prepareLogFn( $log.info, null, false, false );
	      $log.warn  = prepareLogFn( $log.warn, null, false, false );
	      $log.error = prepareLogFn( $log.error, null, false , false);

	      // Add special methods to AngularJS $log
	      $log.getInstance = getInstance;
	      
	      //added methods - by Layton
	      /**
	       * returns true if debugging is enabled or false when debugging is not enabled
	       * */
	      var isEnabled = function(){
	    	  return enabled;
	      };
	      /**
	       * Accepts true or false that may enable/disable debugging in the Angularjs App
	       * can only be used when configuring the $log
	       * */
	      var setDebugFlag = function(flag){
	    	   enabled = flag;
	      };
	      
	      $log.setGlobalDebugFlag = setDebugFlag;
	      $log.isEnabled = isEnabled;
	      
	      return $log;
	    };
	    //added by layton
	    var exposeSafeLogFn = function($log){
	    	 var  _$log = (function( $log ){
	   	              return {
	   	                  log   : $log.log,
	   	                  info  : $log.info,
	   	                  warn  : $log.warn,
	   	                  error : $log.error,
	   	                  getInstance: $log.getInstance
	   	              };
	   	          })( $log); 
	   	      return _$log;
	    };
	    
	    return {
	    	enhanceLogger: enhanceLoggerFn,
	    	exposeSafeLog: exposeSafeLogFn
	    };
}]);
  
 