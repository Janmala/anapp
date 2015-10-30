﻿
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var logInButton = {};	// @button
	var registerButton = {};	// @button
// @endregion// @endlock
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
// eventHandlers// @lock

	logInButton.click = function logInButton_click (event)// @startlock
	{// @endlock
		
		WAF.directory.loginByPassword( sources.logInParams.userName, sources.logInParams.userPassword, {
		    onSuccess: function(event){
		        if(event.result == true){        
		        	user = WAF.directory.currentUser().fullName;    
		        	window.location.href = "/index.waPage/";
		           
		        } else {
		            alert("Fehler: Username oder Passwort inkorrekt");
		            }
		        },
		    onError: function(error){
		        alert("Fehler: " + error.error[0].message);
		    }
		});
		 
	};// @lock

	registerButton.click = function registerButton_click (event)// @startlock
	{// @endlock
		debugger; 
		if(sources.registerParams.userName == null || sources.registerParams.fullName == null || sources.registerParams.mailAddress == null || sources.registerParams.userPassword == null || sources.registerParams.userPasswordRepeat == null ){
			
			alert("Bitte fülle alle Felder aus.") 
		}else{
			if(!validateEmail(sources.registerParams.mailAddress)) {
				alert ("falsches EMailformat")
				
			}else if(sources.registerParams.userPassword.length < 4){
				alert("Dein passwort ist sehr schwach")
					
			}else if (sources.registerParams.userPassword != sources.registerParams.userPasswordRepeat) {
		 		alert("Achtung!! Die Passwörter stimmen nicht überein."); 
			}else {
				ds.User.register({
					onSuccess:function(event){
		            	alert("Ja lecks mi am oasch dat läuft endlisch.")
		    		},onError:function(error){
		    			debugger;
		            	alert("Fehler: " + error.error[0].message);
					}
				}, sources.registerParams.userName, sources.registerParams.fullName, sources.registerParams.mailAddress, sources.registerParams.userPassword, sources.registerParams.userPasswordRepeat );
				
				
				var password = 'mypwx!2';  // enter a valid password here
				var address = 'smtp.4dmail.com'; 
				var port = 465;  // SSL port 
				var mail = require("waf-mail/mail");
				var message = mail.createMessage("from@4d.com", "to@4d.com", "Test", "Hello World!");
				message.send(address , port , true, password);

			
			} 
		}
		
			
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("logInButton", "click", logInButton.click, "WAF");
	WAF.addListener("registerButton", "click", registerButton.click, "WAF");
// @endregion
};// @endlock