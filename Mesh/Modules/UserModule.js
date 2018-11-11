const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";

// mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });

exports.readGoogleDriveTokens =function(email)
{
	return new Promise(function(success,failure)
	{
		var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{
           
            if(user.drives.GoogleDrive.token==false)
            {
                failure("Token Empty"); 
            }
            else
            {
                success(user.drives.GoogleDrive.token); 
            }
		}).catch((err)=>{
            failure("Cannot read token");
        })
		
	});
}

exports.saveGoogleDriveTokens =function(email,token)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"drives.GoogleDrive.token":token}
        User.updateOne(criteria,{$push:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.removeAllGoogleDriveTokens =function(email)
{
	return new Promise((success,failure)=>{
        console.log(email);
        var criteria = {"email":email};
        var updation = {"drives.GoogleDrive.token":[]}
        User.update(criteria,{$set:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}



exports.readUserTokens =function(email)
{
	return new Promise(function(success,failure)
	{
		var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{
           
            if(user.token==false)
            {
                console.log("failed!");
                failure("Token Empty"); 
            }
            else
            {
                success(user.drives.GoogleDrive); 
            }
		}).catch((err)=>{

            failure("Cannot read token");
        })
		
	});
}


exports.saveUserTokens =function(email,token)
{
	return new Promise(function(success,failure){	
        
        var criteria = {"email":email};
        var updation = {"token":token}

        User.updateOne(criteria,{$set:updation}).
        then((result)=>{
            console.log(result)
            success(result);
        }).
        catch((err)=>{
            console.log(err);
            failure(err.message);
        });	
	});
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}