
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var textField2 = {};	// @textField
	var button1 = {};	// @button
	var documentEvent = {};	// @document
	var registerButton = {};	// @button
// @endregion// @endlock
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function doLogIn() {
	WAF.directory.loginByPassword( sources.logInParams.userName, sources.logInParams.userPassword, {
	    onSuccess: function(event){
	        if(event.result == true){        
	        	user = WAF.directory.currentUser().fullName;
					
				//setCookie here (Loginname) 
				$.cookie("logInName", "" + (sources.logInParams.userName ? sources.logInParams.userName : "") );
 
	        	window.location.href = "/index.waPage/";
	           	
	        } else {
	        	 
	
	            alertify.log("Fehler: Username oder Passwort inkorrekt");
	            }
	        },
	    onError: function(error){
	        alertify.log("Fehler: " + error.error[0].message);
	    }
	});
}


// eventHandlers// @lock

	textField2.keyup = function textField2_keyup (event)// @startlock
	{// @endlock
		if (event.keydown == 13 || event.keyCode == 13) {
	    	doLogIn();    	
		}
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		doLogIn();
		
	};// @lock





	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var logInName; 
		if($.cookie("logInName") != null){
			logInName = $.cookie("logInName");
		}
		
		logInParams = {
			userName: logInName
		};	
		sources.logInParams.sync();
		
	};// @lock
	
	
	
	
	
	
	
	
	/*
	textField2.keydown.enterKey = function textField2_enterKey (enterKey)
	{
		alertify.log("Joooooooo");
	};
	*/
	

	registerButton.click = function registerButton_click (event)// @startlock
	{// @endlock
		
		if(sources.registerParams.userName == null || sources.registerParams.fullName == null || sources.registerParams.mailAddress == null || sources.registerParams.userPassword == null || sources.registerParams.userPasswordRepeat == null ){
			
			alertify.log("Bitte fülle alle Felder aus.") 
		}else{
			if(!validateEmail(sources.registerParams.mailAddress)) {
				alertify.log ("falsches EMailformat")
				
			}else if(sources.registerParams.userPassword.length < 4){
				alertify.log("Dein passwort ist sehr schwach")
					
			}else if (sources.registerParams.userPassword != sources.registerParams.userPasswordRepeat) {
		 		alertify.log("Achtung!! Die Passwörter stimmen nicht überein."); 
			}else {
				ds.User.register({
					onSuccess:function(event){
		            	alertify.log("Du hast dich erfolgreich registriert.")
						

		    		},onError:function(error){
		            	alertify.log("Fehler: " + error.error[0].message);
					}
				}, sources.registerParams.userName, sources.registerParams.fullName, sources.registerParams.mailAddress, sources.registerParams.userPassword, sources.registerParams.userPasswordRepeat );
				
				
				

			
			} 
		}
		
			
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("textField2", "keyup", textField2.keyup, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("registerButton", "click", registerButton.click, "WAF");
// @endregion
};// @endlock
