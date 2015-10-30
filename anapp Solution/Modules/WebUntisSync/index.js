var request = require('request');
var moment = require('moment');

var host = null;
var schoolName = null;
var currentDate = null;
var classID = null;
var logIn = null;
var password = null;

process.argv.forEach(function (val, index, array) {
    if (index == 2) {
        host = val;
    } else if (index == 3) {
        schoolName = val;
    } else if (index == 4) {
        currentDate = val;
    } else if (index == 5) {
        classID = val;
    } else if (index == 6) {
        logIn = val;
    } else if (index == 7) {
        password = val;
    }
});

if (host && schoolName && currentDate && classID && logIn) {
    var result = {};

    var j = request.jar();

    var loginURL = "https://" + host + "/WebUntis/j_spring_security_check?request.preventCache=" + (new Date()).getTime();
    var loginData = "buttonName=login&school=" + schoolName + "&j_username=" + logIn + "&j_password=" + password + "";
    var sessionID = "";
    var school = "";

    request(loginURL, {
        jar:j,
        body: loginData,
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4",
            "Cache-Control": "no-cache",
            "Content-Length": "64",
            "Pragma": "no-cache",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
            "Referer": "https://demo.webuntis.com/WebUntis/index.do",
            "Origin": "https://demo.webuntis.com",
            "Host": "demo.webuntis.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
        }
    }, function(error, response, body){
        var cookie_string = j.getCookieString("https://" + host + "/WebUntis/");
        sessionID = j.getCookies("https://" + host + "/WebUntis/").filter(function(item, idx) { return item.key == "JSESSIONID"})[0].value;
        school = j.getCookies("https://" + host + "/WebUntis/").filter(function(item, idx) { return item.key == "schoolname"})[0].value;

        var getPageConfigURL = "https://" + host + "/WebUntis/Timetable.do";
        var getPageConfigData = "ajaxCommand=getPageConfig&type=1&formatId=15";

        var logout = function() {
            var logoutURL = "https://" + host + "/WebUntis/saml/logout?local=true";

            request(logoutURL, {
                jar:j,
                method: 'GET',
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, sdch",
                    "Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                    "Pragma": "no-cache",
                    "Referer": "https://demo.webuntis.com/WebUntis/index.do",
                    "Host": "demo.webuntis.com",
                    "Upgrade-Insecure-Requests": "1",
                    "Cookie": ["JSESSIONID=" + sessionID + "", "schoolname=" + school + ""]
                }
            }, function(error, response, body) {
                console.log(JSON.stringify(result));
            } );
        }

        var continueWithLoadingContent = function() {
            var getElementsURL = "https://" + host + "/WebUntis/Timetable.do?request.preventCache=" + (new Date()).getTime();
            var getElementsData = "ajaxCommand=getWeeklyTimetable&elementType=1&elementId=" + classID + "&date=" + currentDate + "&filter.klasseId=-1&filter.restypeId=-1&filter.buildingId=-1&filter.roomGroupId=-1&filter.departmentId=-1&formatId=15";

            request(getElementsURL, {
                jar:j,
                body: getElementsData,
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4",
                    "Cache-Control": "no-cache",
                    "Content-Length": "" + (186+(""+classID).length),
                    "Connection": "keep-alive",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                    "Referer": "https://demo.webuntis.com/WebUntis/index.do",
                    "Origin": "https://demo.webuntis.com",
                    "Host": "demo.webuntis.com",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                    "Cookie": ["JSESSIONID=" + sessionID + "", "schoolname=" + school + ""]
                }
            }, function(error, response, body){
                var bodyAsObj = JSON.parse(body);
                if (bodyAsObj && bodyAsObj.result && bodyAsObj.result.data && bodyAsObj.result.data.elementIds &&
                    bodyAsObj.result.data.elementIds.indexOf(classID) >= 0) {
                    if (bodyAsObj.result.data.elementPeriods[classID] && bodyAsObj.result.data.elementPeriods[classID].length > 0) {
                        var correspondingElements = bodyAsObj.result.data.elements;

                        result.type = "elements";
                        result.elements = [];
                        for (var i = 0; i < bodyAsObj.result.data.elementPeriods[classID].length; i++) {
                            var elementPeriod = bodyAsObj.result.data.elementPeriods[classID][i];

                            var dateOfEvent = moment(elementPeriod.date, "YYYYMMDD").format("YYYY-MM-DD");
                            var startTime = "" + elementPeriod.startTime;
                            var endTime =  "" + elementPeriod.endTime;
                            if (startTime.length == 3) {
                                startTime = (startTime.length == 3 ? "0" : "") + startTime;
                            }
                            if (endTime.length == 3) {
                                endTime = (endTime.length == 3 ? "0" : "") + endTime;
                            }

                            var startTimeHour = startTime.substr(0,2);
                            var startTimeMinute = startTime.substr(2,2);
                            var endTimeHour = endTime.substr(0,2);
                            var endTimeMinute = endTime.substr(2,2);

                            var duration = Math.floor(
                                            moment("" + currentDate + " " + endTimeHour + ":" + endTimeMinute + "", "YYYYMMDD HH:mm")
                                      .diff(moment("" + currentDate + " " + startTimeHour + ":" + startTimeMinute + "", "YYYYMMDD HH:mm"))/1000/60/45);

                            for (var j=0;j<elementPeriod.elements.length;j++) {
                                var foundCorrespondingElement = null;
                                for (var l=0;l<correspondingElements.length;l++) {
                                    if (correspondingElements[l].id == elementPeriod.elements[j].id && elementPeriod.elements[j].type == 3) {
                                        foundCorrespondingElement = correspondingElements[l];
                                        break;
                                    }
                                }

                                if (foundCorrespondingElement) {
                                    result.elements.push({
                                        shortKey: foundCorrespondingElement.name,
                                        dateOfEvent: dateOfEvent,
                                        duration: duration,
                                        hour: parseInt(startTimeHour),
                                        minute: parseInt(startTimeMinute)
                                    });
                                }
                            }
                        }


                        //Sort
                        result.elements.sort(function(itemA, itemB) {
                            var result = 0;
                            if (itemA.dateOfEvent && itemB.dateOfEvent) {
                                if ((result = (moment(itemA.dateOfEvent, "YYYY-MM-DD").toDate().getTime()-moment(itemB.dateOfEvent, "YYYY-MM-DD").toDate().getTime())) == 0) {
                                    if ((result = (itemA.hour - itemB.hour)) == 0) {
                                        result = (itemA.minute - itemB.minute);
                                    }
                                }
                            }

                            return result;
                        });

                        //1. Reduce
                        var reducedResult = [];
                        for (var k=0;k<result.elements.length;k++) {
                            var currentElement = result.elements[k];
                            if (reducedResult.map(function(item, idx) {
                                    return (item.shortKey + "|" + item.dateOfEvent + "|" + item.hour + "|" + item.minute);
                                }).indexOf(currentElement.shortKey + "|" + currentElement.dateOfEvent + "|" + currentElement.hour + "|" + currentElement.minute) == -1) {
                                reducedResult.push(currentElement);
                            }
                        }
                        result.elements = reducedResult;

                        //2. Reduce
                        var reducedResult = [];
                        for (var k=0;k<result.elements.length;k++) {
                            var currentElement = result.elements[k];

                            var nextTick = 1;
                            var followingElement = null;
                            while ((k + nextTick) < result.elements.length && !followingElement) {
                                var followingElementCanditate = result.elements[k + nextTick];

                                if (currentElement.shortKey == followingElementCanditate.shortKey &&
                                    currentElement.dateOfEvent == followingElementCanditate.dateOfEvent) {
                                    var startOfBefore = (currentElement.hour < 10 ? "0" : "") + currentElement.hour + ":" + (currentElement.minute < 10 ? "0" : "") + currentElement.minute;
                                    var startOfFollowing = (followingElementCanditate.hour < 10 ? "0" : "") + followingElementCanditate.hour + ":" + (followingElementCanditate.minute < 10 ? "0" : "") + followingElementCanditate.minute;

                                    var timeDiff = Math.floor(
                                                        moment("" + currentElement.dateOfEvent + " " + startOfFollowing + "", "YYYYMMDD HH:mm")
                                                  .diff(moment("" + currentElement.dateOfEvent + " " + startOfBefore + "", "YYYYMMDD HH:mm"))/1000/60);

                                    if (timeDiff < (45*2)) {
                                        followingElement = followingElementCanditate;
                                        break;
                                    }
                                }
                                nextTick++;

                            }

                            if (followingElement) {
                                currentElement.duration += followingElement.duration;
                                followingElement.remove = true;
                            }
                            reducedResult.push(currentElement);
                        }
                        result.elements = reducedResult.filter(function(item) { return !item.remove; });
                    }
                }
                logout();
            });
        }

        if (classID != "0") {
            continueWithLoadingContent();
        } else {
            request(getPageConfigURL, {
                jar:j,
                body: getPageConfigData,
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4",
                    "Cache-Control": "no-cache",
                    "Content-Length": "32",
                    "Connection": "keep-alive",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                    "Referer": "https://demo.webuntis.com/WebUntis/index.do",
                    "Origin": "https://demo.webuntis.com",
                    "Host": "demo.webuntis.com",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                    "Cookie": ["JSESSIONID=" + sessionID + "", "schoolname=" + school + ""]
                }
            }, function(error, response, body){
                var bodyAsObj = JSON.parse(body);
                if (bodyAsObj && bodyAsObj.elements && bodyAsObj.elements.length > 0) {
                    if (bodyAsObj.elements.length == 1) {
                        classID = bodyAsObj.elements[0].id;
                        continueWithLoadingContent();
                    } else {
                        result.type = "classes";
                        result.classes = [];
                        for (var i=0;i<bodyAsObj.elements;i++) {
                            result.classes.push({id: bodyAsObj.elements[i].id, key: bodyAsObj.elements[i].name, name: bodyAsObj.elements[i].longName});
                        }
                        logout();
                    }
                } else {
                    logout();
                }
            });
        }
    });



    /*
    loginXHR.onreadystatechange = function() {
        if (this.readyState === 4) {
            var cookieArr = this.getCookieHeaders();
            if (cookieArr) {
                for (var i=0;i<cookieArr.length;i++) {
                    var cookieElem = cookieArr[i];
                    var cookieElemSplit = cookieElem.split(";");
                    for (var j=0;j<cookieElemSplit.length;j++) {
                        var cookieElemSplitPart = cookieElemSplit[j]
                        if (cookieElemSplitPart.indexOf("JSESSIONID=") == 0) {
                            sessionID = cookieElemSplitPart.split("=")[1];
                            break;
                        }
                    }

                    if (sessionID) {
                        break;
                    }
                }
            }

            if (sessionID) {
                console.log(sessionID);

                var classID = null;
                var getPageConfigURL = "https://" + host + "/WebUntis/Timetable.do?request.preventCache=" + (new Date()).getTime();
                var getPageConfigData = "ajaxCommand=getPageConfig&type=1";

                getPageConfigXHR.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        console.log(this.responseText);
                        exit(0);
                    }
                };
                getPageConfigXHR.open("GET", getPageConfigURL + "&" + getPageConfigData);
                getPageConfigXHR.setRequestHeader("Cookie", "JSESSIONID=" + sessionID + "; schoolname=_ZGVtb19pbmY=");
                getPageConfigXHR.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36");
                getPageConfigXHR.setRequestHeader("Referer", "https://demo.webuntis.com/WebUntis/index.do");
                getPageConfigXHR.setRequestHeader("Origin", "https://demo.webuntis.com");
                getPageConfigXHR.setRequestHeader("Host", "demo.webuntis.com");
                getPageConfigXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                getPageConfigXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                getPageConfigXHR.send();
            }
        }
    };

    loginXHR.open("GET", loginURL + "&" + loginData);
    loginXHR.send();*/
}
