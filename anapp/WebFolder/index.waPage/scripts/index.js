

function generate(dd) {
    pdfMake.createPdf(dd).getDataUrl(function(outDoc) {
        document.getElementById('pdfV').src = outDoc;
        
    });
}
      
function render() {
  	
  	var dd = jQuery.extend(true, {}, docDef);
	var sheetNumber = (moment(sources.makePDFParams.startDate).week() - moment(sources.azubiParams.startDate).week() +1);
	
	var weekFrom = (moment(sources.makePDFParams.startDate).startOf("week").add(1, 'd').format("DD.MM.YYYY")); 
	var weekTo = (moment(sources.makePDFParams.startDate).endOf("week").subtract(1, 'days').format("DD.MM.YYYY"));
	var year = ((moment(sources.makePDFParams.startDate).diff(moment(sources.azubiParams.startDate),'days')+1) /365);
	var yearWritten = (1);	
		
	if (year < 1) {
		yearWritten = 1
	}else if(year < 2){
		yearWritten = 2
	}else{
		yearWritten = 3
	}		
		
	dd.content[0].table.body[1][1].text += " " + yearWritten;
	dd.content[0].table.body[0][0].text += " " + sheetNumber;
	dd.content[0].table.body[0][1].text += " " + sources.azubiParams.name;
	dd.content[0].table.body[1][0].text = "Woche von:" + " " + weekFrom + " " + "Bis:" + " " + weekTo;
	
	if (sources.makePDFParams.notes != null) {
		dd.content[4].table.body[1][0].text += sources.makePDFParams.notes;
	}

	ds.LearnedLesson.query("ID != null order by dateOfEvent, hour, minute", { 
		onSuccess: function(resultEvent) {
			
			var mondayArray = new Array();
			var tuesdayArray = new Array();
			var wednesdayArray = new Array();
			var thursdayArray = new Array();
			var fridayArray = new Array();
			
			var mondayCount = 0;
			var tuesdayCount = 0;
			var wednesdayCount = 0;
			var thursdayCount = 0;
			var fridayCount = 0;
			
			var ec= resultEvent.entityCollection;
			ec.forEach({
				onSuccess: function(element){
					var entity = element.entity; 
					if(entity.dateOfEvent.getValue() != null){
						var weekNumber = moment(entity.dateOfEvent.getValue()).week(); 
						var enteredWeekNumber = moment(sources.makePDFParams.startDate).week();
						if(weekNumber == enteredWeekNumber){
							var weekDay = moment(entity.dateOfEvent.getValue()).format("dddd");
							switch(weekDay) {
								case "Monday":
									if (mondayArray.length < 5) {
										if (mondayArray.length == 0) {
											mondayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : "") ,style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
										} else {
											mondayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}]);
										}
										mondayCount += entity.duration.getValue();
									}
									break;
								case "Tuesday":
									if (tuesdayArray.length < 5) {
										if(tuesdayArray.length == 0){
											tuesdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
										}else{
											tuesdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}]);
										}
										tuesdayCount+= entity.duration.getValue();
									}
									break;
								case "Wednesday":
									if (wednesdayArray.length < 5) {
										if(wednesdayArray.length == 0){
											wednesdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
										}else{
											wednesdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}]);
										}
										wednesdayCount+= entity.duration.getValue();
									}
									break;
								case "Thursday":
									if (thursdayArray.length < 5) {
										if(thursdayArray.length == 0){
											thursdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
										}else{
											thursdayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}]);
										}
										thursdayCount+= entity.duration.getValue();
									}
									break;
								case "Friday":
									if (fridayArray.length < 5) {
										if(fridayArray.length == 0){
											fridayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
										}else{
											fridayArray.push([{text: entity.shortKey.getValue(),style:" emptyTableBody"}, {text: (entity.description.getValue() ? entity.description.getValue() : ""),style:"emptyTableBody"}, {text: ""+entity.duration.getValue(),style:"emptyTableBody"}]);
										}
										fridayCount+= entity.duration.getValue();
									}
									break;
							}
						}
					}
					
				},
				
				atTheEnd: function(){
					
					
					dd.content[1].table.body.push([{text: "Montag",style:"daySpan",colSpan:4}]);
						var mondayLength = (mondayArray.length);
							for(i = mondayLength; i < 5; i++ ){
								if (i == 0) {
									mondayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
								} else {
									mondayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]);
								}
							};
					dd.content[1].table.body = dd.content[1].table.body.concat(mondayArray);
					dd.content[1].table.body[2][3].text = (""+mondayCount);
					
					dd.content[1].table.body.push([{text: "Dienstag",style:"daySpan",colSpan:4}]);
						var tuesdayLength = (tuesdayArray.length);
							for(i = tuesdayLength; i < 5; i++ ){
								
								if (i == 0) {
									tuesdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
								} else {
									tuesdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]);
								}	
							};
					dd.content[1].table.body = dd.content[1].table.body.concat(tuesdayArray);
					dd.content[1].table.body[8][3].text = (""+tuesdayCount);
					
					dd.content[1].table.body.push([{text: "Mittwoch",style:"daySpan",colSpan:4}]);
						var wednesdayLength = (wednesdayArray.length);
							for(i = wednesdayLength; i < 5; i++ ){
								
								if (i == 0) {
									wednesdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
								} else {
									wednesdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]);
								}	
							};
					dd.content[1].table.body = dd.content[1].table.body.concat(wednesdayArray);
					dd.content[1].table.body[14][3].text = (""+wednesdayCount);
					
					dd.content[1].table.body.push([{text: "Donnerstag",style:"daySpan",colSpan:4}]);
						var thursdayLength = (thursdayArray.length);
							for(i = thursdayLength; i < 5; i++ ){
								
								if (i == 0) {
									thursdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
								} else {
									thursdayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]);
								}
								
							};
					dd.content[1].table.body = dd.content[1].table.body.concat(thursdayArray);
					dd.content[1].table.body[20][3].text = (""+thursdayCount);
					
					dd.content[1].table.body.push([{text: "Freitag",style:"daySpan",colSpan:4}]);
						var fridayLength = (fridayArray.length);
							for(i = fridayLength; i < 5; i++ ){
								
								if (i == 0) {
									fridayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody", rowSpan: 5}]);
								} else {
									fridayArray.push([{text: " ",style:" emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]);
								}
								
							};
					dd.content[1].table.body = dd.content[1].table.body.concat(fridayArray);
					dd.content[1].table.body[26][3].text = (""+fridayCount);
				
					generate(dd);
				}
			});
			
		}
	});  
}

function refresh() { 
 
	sources.learnedLesson.query("dateOfEvent == :1 and (isDemo == :2 or isDemo is null) order by dateOfEvent, hour, minute", { params: [ sources.makePDFParams.currentDate, sources.azubiParams.isDemo]});
	
}
        
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var logOutButton = {};	// @button
	var enteredStartDate = {};	// @textField
	var checkbox1 = {};	// @checkbox
	var button2 = {};	// @button
	var NotesTextField = {};	// @textField
	var menuItemFriday = {};	// @menuItem
	var menuItemThursday = {};	// @menuItem
	var menuItemWednesday = {};	// @menuItem
	var menuItemTuesday = {};	// @menuItem
	var menuItemMonday = {};	// @menuItem
	var documentEvent = {};	// @document
	var button1 = {};	// @button
	var makePdfButton = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	logOutButton.click = function logOutButton_click (event)// @startlock
	{// @endlock
		 WAF.directory.logout({
        onSuccess: function(event) { 
            window.location.href = "/logIn.waPage/";
        },
        onError: function(error) {
            alert ("Ups etwas ist schief gelaufen"); 
        }
    }); 
	};// @lock

	enteredStartDate.change = function enteredStartDate_change (event)// @startlock
	{// @endlock
		var mondayDate = moment(sources.makePDFParams.startDate).startOf('week').add(1, 'day');
		sources.makePDFParams.currentDate = mondayDate.toDate();
		refresh();
	};// @lock

	checkbox1.change = function checkbox1_change (event)// @startlock
	{// @endlock
		refresh();
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		render();
	};// @lock

	NotesTextField.change = function NotesTextField_change (event)// @startlock
	{// @endlock
		render();
	};// @lock
	

	
	menuItemFriday.click = function menuItemFriday_click (event)// @startlock
	{// @endlock
		var fridayDate = moment(sources.makePDFParams.startDate).startOf('week').add(5, 'day');
		sources.makePDFParams.currentDate = fridayDate.toDate();
		refresh();				
	};// @lock
	
	
	menuItemThursday.click = function menuItemThursday_click (event)// @startlock
	{// @endlock
		var thursdayDate = moment(sources.makePDFParams.startDate).startOf('week').add(4, 'day');
		sources.makePDFParams.currentDate = thursdayDate.toDate();
		refresh();	
	};// @lock


	menuItemWednesday.click = function menuItemWednesday_click (event)// @startlock
	{// @endlock
 		var wednesdayDate = moment(sources.makePDFParams.startDate).startOf('week').add(3, 'day');
		sources.makePDFParams.currentDate = wednesdayDate.toDate();
		refresh();
	};// @lock


	menuItemTuesday.click = function menuItemTuesday_click (event)// @startlock
	{// @endlock
		var tuesdayDate = moment(sources.makePDFParams.startDate).startOf('week').add(2, 'day');
		sources.makePDFParams.currentDate = tuesdayDate.toDate();
		refresh();
	};// @lock


	menuItemMonday.click = function menuItemMonday_click (event)// @startlock
	{// @endlock
		var mondayDate = moment(sources.makePDFParams.startDate).startOf('week').add(1, 'day');
		sources.makePDFParams.currentDate = mondayDate.toDate();
		refresh();
	};// @lock
	

	
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		 if (WAF.directory.currentUser()){
			//getCookie
			var logIn;
			var password;
			var schoolName;
			var host;
			var startDate;
			
			if($.cookie("azubiData") != null){
			
				logIn = $.cookie("azubiData").split("|")[0];
				password =  $.cookie("azubiData").split("|")[1];
				schoolName = $.cookie("azubiData").split("|")[2];
				host = $.cookie("azubiData").split("|")[3];
				if( $.cookie("azubiData").split("|")[4] != 0 ){
					debugger;
					startDate = new Date(parseInt( $.cookie("azubiData").split("|")[4]));
				}
			}
			
			logInParams = {
				fullName: ("Angemeldet als: " + WAF.directory.currentUser().fullName)
			}
			sources.logInParams.sync();
			azubiParams = {
				name: WAF.directory.currentUser().fullName,
				//host: "melete.webuntis.com", 
				host: host,
				//schoolName: "bs-technik-schwerin",
				schoolName: schoolName,
				//logIn: "finise51",
				logIn: logIn,
				//password: "finise51",
				password: password,
				startDate: startDate,
				isDemo: false
			};
			sources.azubiParams.sync();
			makePDFParams = {
				startDate: moment().toDate()
			};
			sources.makePDFParams.sync();
			
		}else{
			window.location.href = "/logIn.waPage/";
		}
		
		
		
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		//Cookie set here
		$.cookie("azubiData", "" + (sources.azubiParams.logIn ? sources.azubiParams.logIn : "") + "|" + (sources.azubiParams.password ? sources.azubiParams.password : "") + "|" + (sources.azubiParams.schoolName ? sources.azubiParams.schoolName : "") + "|" + (sources.azubiParams.host ? sources.azubiParams.host : "")  + "|" + (sources.azubiParams.startDate ? sources.azubiParams.startDate.getTime() : 0) )
		
		webUntisSync.webUntisSyncAsync({
			
			onSuccess: function(result){
				console.log(result)
			},
			onError: function(error){
				console.log(error)
			},
			
			params:[sources.azubiParams.host, sources.azubiParams.schoolName, sources.azubiParams.logIn, sources.azubiParams.password, moment(sources.makePDFParams.startDate).format("YYYYMMDD")]
		});
	};// @lock


	makePdfButton.click = function makePdfButton_click (event)// @startlock
	{// @endlock
		
		render();
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("logOutButton", "click", logOutButton.click, "WAF");
	WAF.addListener("enteredStartDate", "change", enteredStartDate.change, "WAF");
	WAF.addListener("checkbox1", "change", checkbox1.change, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("NotesTextField", "change", NotesTextField.change, "WAF");
	WAF.addListener("menuItemFriday", "click", menuItemFriday.click, "WAF");
	WAF.addListener("menuItemThursday", "click", menuItemThursday.click, "WAF");
	WAF.addListener("menuItemWednesday", "click", menuItemWednesday.click, "WAF");
	WAF.addListener("menuItemTuesday", "click", menuItemTuesday.click, "WAF");
	WAF.addListener("menuItemMonday", "click", menuItemMonday.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("makePdfButton", "click", makePdfButton.click, "WAF");
// @endregion
};// @endlock
