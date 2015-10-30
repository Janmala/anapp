
var webUntisSyncFunc = function(host, schoolName, logIn, password, dateOfRequest){
	
	var result = null;
	var winWorker = SystemWorker.exec("node \"C:\\Users\\Jani\\Documents\\Wakanda\\schoolApp\\schoolApp Solution\\Modules\\WebUntisSync\\index.js\" " + host + " " + schoolName + " " + dateOfRequest + " 0 " + logIn + " " + password); 
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
	
    

	
/*var newLog = ds.Log.createEntity(); 
var today = new Date();     // get the current date and time
newLog.date = today;     // store the current date and time in the entity
var todaysInvoices = ds.Invoices.query("date =:1", today);     // get today's invoices
newLog.total = todaysInvoices.length;     // get the current number of entities
newLog.custoNb = todaysInvoices.distinctValues( "Customerid" ).length;     // count the distinct customers
newLog.save( ); */



//webUntisSync();