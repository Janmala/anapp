

model.User.events.restrict = function(event) {
	var session = currentSession();
	if (session.belongsTo("Managers")) {
		return ds.User.all(); 
	}else if(session.belongsTo("Users")){
		var col = ds.User.query("userName == :$userName");
		return col; 
	}
	return ds.User.createEntityCollection();
};
