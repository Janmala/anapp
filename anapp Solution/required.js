

function myLogin(userName, password)
{    
        
 
    var user = application.ds.User({"userName":userName}); //look for the user in the People datastore class
    if (user == null) //if the user name does not exist in our datastore class
        return false; //let Wakanda try to find it in the solution's directory
    else // the user name is known
    {
    	
    	var crypto = require("crypto");
		var md5 = crypto.createHash("md5");
		md5.update(password, "utf8");
		var digest = md5.digest("hex");
		
		
        if (user.userPassword == digest) //this is given to keep the example simple
                    //we should have a more secured challenge here, for example 
                    //by storing and comparing a hash key
        {
            var theGroups = ["Users"];
            
            if(user.userName == "admin" ) {
            	theGroups = ["Managers"];
            }
            
            var connectTime = new Date();
            return { 
                ID: user.ID, 
                name: user.userName, 
                fullName: user.fullName, 
                belongsTo: theGroups,
                storage:{
                    time: connectTime
                }
            };
        }
        else
            return { error: 1024, errorMessage:"invalid login" }
    }
    
    
};






