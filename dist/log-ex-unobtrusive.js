/**
 * Log Extension Unobtrusive
 * v.0.0.2
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

var logEx = angular.module("log.extension.uo", [ ]);
  
logEx.config(['$provide', function($provide){
      // Register our $log decorator with AngularJS $provider
	//scroll down to the Configuration section to set the log settings
      $provide.decorator( '$log', [ "$delegate", "$filter", function( $delegate, $filter ){
    	  var logEnhancerObj = function( ){
    			//declarations and functions , extensions 
    			var enabled = false;
    			var isBoolean = function(value){
					return typeof value == 'boolean';
				};
				var isString = function(value){
					return typeof value == 'string';
				};
				var trimString = function(value){
					if(isString(value))
						return value.replace(/^\s*/, '').replace(/\s*$/, '');
				};
				var isValidString = function(value){
					return (isString(value) && trimString(value) !== "");
				};
    			/**
    		     * processUseOverride returns true if the override flag is set. 
    		     * this is used to activated the override functionality.
    		     * */
    			var processUseOverride = function(override){
    			  	  return isBoolean( override );
    			    };
    			    /**
    			     * process override only takes true or false as valid input. 
    			     * any other input will resolve as true.
    			     * this function is used to override the global flag for displaying logs
    			     * */
    			    var processOverride = function(override){
    			    	return override !== false;
    			    };
					
				   var getLogPrefix = function(className){
						var formatMessage = "";
						var separator = " >> ";
						var format = "MMM-dd-yyyy-h:mm:ssa";
						var now = $filter('date')(new Date(), format);
					  if(!isValidString(className) ){
						 formatMessage = "" + now  + separator;
					  }else{
						 formatMessage = "" + now  + "::" + className + separator;
					  }
					  return formatMessage;
				  };
    			    
    			    var activateLogs = function(enabled, override){
    			     	  if(isBoolean(enabled) && override == true)  return true;
    			     	  if(isBoolean(enabled) && override == false) return false;
    			     	  return false;
    			       };
    			       
    			    
    			    var printOverrideLogs = function(_$log, useOverride, _override, className, enabled){
    			    	var instance = (isValidString(className)) ? className : "this instance"; 
    			    	if(enabled == false && useOverride && _override){
    			        	  _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING ENABLED - $log enabled for " + instance);
    			          }else if (enabled && useOverride && _override == false ){
    			        	  _$log.log(getLogPrefix() + "[OVERRIDE] LOGGING DISABLED - $log disabled for " + instance);
    			          }
    			      };
    			      
    			//---------------------------------------//
    			var enhanceLoggerFn = function( $log ){
    			     // var separator = " >> ";
    			      //original methods
    			      /**
    			       * Partial application to pre-capture a logger function
    			       */
    			  		var prepareLogFn = function( logFn, className, override, useOverride ){
    			          var enhancedLogFn = function ( ){
    			          	var activate = (useOverride) ? activateLogs(enabled, override) : enabled;
				            if(activate){
				            	 var args = Array.prototype.slice.call(arguments);
				                 var formatMessage = getLogPrefix(className);
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
                                 log: $log.log,
                                 info: $log.info,
                                 warn: $log.warn,
                                 error: $log.error,
                                 debug: $log.debug
                             };
    			          })( $log),
    			          
    			          /**
    			           * Support to generate class-specific logger instance with/without classname or override
    			           *
    			           * @param className Name of object in which $log.<function> calls is invoked.
    			           * @param override activates/deactivates component level logging
    			           *
    			           * @returns {*} Logger instance
    			           */
    			          getInstance = function( className, override ){
    			        	 if(isBoolean( className )){
    			        		 override = className;
    			        		 className = null;
    			        	 }else if(isString( className)){
    			        		 className = trimString(className);
    			        	 }else{
    			        		 className =  null;
    			        	 }
    			              var useOverride = processUseOverride(override);
    			              override = processOverride(override);
    			              printOverrideLogs(_$log, useOverride, override, className, enabled);
                              return {
                                  log: prepareLogFn(_$log.log, className, override, useOverride),
                                  info: prepareLogFn(_$log.info, className, override, useOverride),
                                  warn: prepareLogFn(_$log.warn, className, override, useOverride),
                                  error: prepareLogFn(_$log.error, className, override, useOverride),
                                  debug: prepareLogFn(_$log.debug, className, override, useOverride)
                              };
    			          };
    			      $log.log   = prepareLogFn( $log.log, null, false, false );
    			      $log.info  = prepareLogFn( $log.info, null, false, false );
    			      $log.warn  = prepareLogFn( $log.warn, null, false, false );
    			      $log.error = prepareLogFn( $log.error, null, false , false);
    			      $log.debug = prepareLogFn( $log.debug, null, false , false);

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
                        return (function ($log) {
                              return {
                                  log: $log.log,
                                  info: $log.info,
                                  warn: $log.warn,
                                  error: $log.error,
                                  debug: $log.debug,
                                  getInstance: $log.getInstance
                              };
                          })($log);
    			    };
    			    
    			    
    			   this.enhanceLogger = enhanceLoggerFn;
    			   this.exposeSafeLog =  exposeSafeLogFn;
    			   
    		};
    	//=======================================================================//
    	// Configuration Section
    	//=======================================================================//	  
    	 var logEnhancer = new logEnhancerObj();  
    	 logEnhancer.enhanceLogger($delegate);
    	  
    	  // ensure false is being passed for production deployments
		  // set to true for local development
    	  $delegate.setGlobalDebugFlag(true);
    	  
    	  if( $delegate.isEnabled() ){
    		  $delegate.log("CONFIG: LOGGING ENABLED GLOBALLY");
    	  }
          return  logEnhancer.exposeSafeLog($delegate);
      }]);
  }]);
 


