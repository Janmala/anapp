

model.User.methods.register = function(userName, fullName, mailAddress, userPassword) {
	
	var userEntity = ds.User.find("userName == :1 || mailAddress == :2", userName.trim(), mailAddress.trim());
	
	if (userEntity == null) {
		userEntity = ds.User.createEntity();
		userEntity.fullName = fullName.trim();
		userEntity.userName = userName.trim();
		userEntity.mailAddress = mailAddress.trim();
		var crypto = require("crypto");
		var md5 = crypto.createHash("md5");
		md5.update(userPassword, "utf8");
		var digest = md5.digest("hex");
		userEntity.userPassword = digest;
		userEntity.save();
		

		var templateFilePath = getFolder("path") + "/templates/Email.html"
		var templateFile = File(templateFilePath); 
		templateFile;

		            // only works if the datastore has the same name as the model file
		if (templateFile.exists)     // if the model actually exists
		{
			var html = templateFile.toString();
			   
			var mail = require('waf-mail/mail'); 
			var message = new mail.Mail();
			message.subject = "Registrierung bei ANapp";
			message.from = "anapp@minzkopf.de";
			message.to = userEntity.mailAddress;
			message.setBodyAsHTML(html);
			message.bcc = "jan.lakaw@minzkopf.de";
			message.addField("Content-Type", "text/html; charset='UTF-8'");
			message.send({
			    address: deploymentConfig.smtp.host, 
			    port: deploymentConfig.smtp.port,
			    isSSL: deploymentConfig.smtp.isSSL,
			    username: deploymentConfig.smtp.username, 
			    password: deploymentConfig.smtp.password, 
			    domain: deploymentConfig.smtp.domain
			});
		}
		
	}else{
		throw {message:"User existiert bereits."};
	}
	
	//createEntity(userName = registerParams.userName, fullName = registerParams.fullName, mailAddress = registerParams.mailAddress );
};

model.User.methods.register.scope = "public" ;

