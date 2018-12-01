const User = require('../Models/UserDAL');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";

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