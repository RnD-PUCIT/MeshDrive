const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";


//make it promise
exports.saveDropboxUserAccount=function(account,email)
{
    console.log(account);
    var criteria = {"email":email};
    var updation = {"drives.Dropbox.user":account};
        User.updateOne(criteria,{$set:updation})
        .then((res)=>{
            console.log("saved the user account info");
            
        })
        .catch((err)=>{
            console.log("in the error");
            console.log(err);
        });

}

exports.getDropboxAccounts=function(email){
    return new Promise(function(success,failure)
	{
		var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{  
            success(user.drives.Dropbox);   
		}).catch((err)=>{
            failure({error:err});
        })
		
	});
}
//new for multiple user
exports.saveDropboxAccount=function(email,account){
   return new Promise((success,failure)=>
   {
    console.log(account);
    var criteria = {"email":email};
    var updation = {"drives.Dropbox.AccountsList":account};
        User.updateOne(criteria,{$push:updation})
        .then((res)=>{
            console.log("saved the user account info");
            success(res);
        })
        .catch((err)=>{
            failure(err);
            console.log("in the error");
            console.log(err);
        });
    });
}

exports.saveDropboxToken =function(email,token)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        console.log("save in :"+email);
    
        var updation = {"drives.Dropbox.token":token}
        User.updateOne(criteria,{$set:updation})
        .then((res)=>{
            console.log("in success");
            success(res);
        })
        .catch((err)=>{
            console.log("in the error");
            failure(err);
        });	
	});
}

exports.getDropboxToken = function(email)
{
    return new Promise(function(success,failure)
	{
		var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{
           
            if(user.drives.Dropbox.token.access_token=="false")
            {
               console.log("Failure");
               failure({error: "Token Empty"});         
                   
            }
            else
            {
                console.log("Success");
                success(user.drives.Dropbox.token); 
               
            }

		}).catch((err)=>{

            failure("Cannot read token");
        })
		
	});
}