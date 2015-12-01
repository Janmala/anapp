
var webUntisSyncFunc = function(host, schoolName, logIn, password, dateOfRequest){
	
	
	var result = null;
	var winWorker = null;
	if (os.isWindows){
		winWorker = SystemWorker.exec("node \""+solution.getFolder("path").replace(/\//gi,"\\")+"Modules\\WebUntisSync\\index.js\" " + host + " " + schoolName + " " + dateOfRequest + " 0 " + logIn + " " + password); 	
	}else{
		winWorker = SystemWorker.exec("/usr/local/bin/node '"+solution.getFolder("path") + "Modules/WebUntisSync/index.js' " + host + " " + schoolName + " " + dateOfRequest + " 0 " + logIn + " " + password);
	}
	
	
	if(winWorker && winWorker.output) {
		result = JSON.parse(winWorker.output.toString());	
		
		for (var i = 0; i < result.elements.length; i++) {
			var element = result.elements[i];
			var learnedLessonEntity = ds.LearnedLesson.find("shortKey == :1 and dateOfEvent == :2 and hour == :3 and minute == :4 and createdBy.userName == :$userName ", element.shortKey, element.dateOfEvent, element.hour, element.minute );
			if(learnedLessonEntity == null){
				learnedLessonEntity = ds.LearnedLesson.createEntity();
				learnedLessonEntity.shortKey = element.shortKey;
				
				var dateOfEvent = new Date();
				dateOfEvent.setFullYear(element.dateOfEvent.split("-")[0]);
				dateOfEvent.setMonth(parseInt(element.dateOfEvent.split("-")[1])-1);
				dateOfEvent.setDate(element.dateOfEvent.split("-")[2]);
				dateOfEvent.setHours(0);
				dateOfEvent.setMinutes(0);
				dateOfEvent.setSeconds(0);
				dateOfEvent.setMilliseconds(0);
				
				learnedLessonEntity.dateOfEvent = dateOfEvent; 
				
				learnedLessonEntity.hour = element.hour;
				learnedLessonEntity.minute = element.minute;
				learnedLessonEntity.duration = element.duration;
				if(host == "demo.webuntis.com"){
					learnedLessonEntity.isDemo = true;
				}
				
				learnedLessonEntity.save();
			}
		};		
	}; 
	
	var learnedLessonEntities = ds.LearnedLesson.query("dateOfEvent == '' or dateOfEvent == null");
	learnedLessonEntities.forEach(function(entity) {
		entity.remove();
	});
	
	return true;
	
};
exports.webUntisSync = webUntisSyncFunc;
	
    

//webUntisSync();