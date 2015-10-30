
model.LearnedLesson.events.init = function(event) {
	var curUser = currentUser()
	var curUserEntity = ds.User({'userName':curUser.name});
	this.createdBy = curUserEntity;
};
