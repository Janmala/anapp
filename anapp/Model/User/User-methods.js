

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
	}else{
		throw {message:"User existiert bereits."};
	}
	
	//createEntity(userName = registerParams.userName, fullName = registerParams.fullName, mailAddress = registerParams.mailAddress );
};

model.User.methods.register.scope = "public" ;

