const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";

// mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });

exports.readGoogleDriveAccounts =function(email)
{
	return new Promise(function(success,failure)
	{
        var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{
            if(user.drives.GoogleDrive.AccountsList)
            {
                success(user.drives.GoogleDrive.AccountsList);
            }
            else
            {
                failure("Token Empty");  
            }
		}).catch((err)=>{
            failure("Cannot read token");
        })
		
	});
}

exports.saveGoogleDriveAccount =function(email,account)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        console.log(account);
        var updation = {"drives.GoogleDrive.AccountsList":account}
        User.updateOne(criteria,{$push:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.removeAllGoogleDriveAccounts =function(email)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"drives.GoogleDrive.AccountsList":[]}
        User.update(criteria,{$set:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.updateGoogleDriveToken =function(email,account)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"drives.GoogleDrive.AccountsList":account}
        User.updateOne(criteria,{$push:updation})
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