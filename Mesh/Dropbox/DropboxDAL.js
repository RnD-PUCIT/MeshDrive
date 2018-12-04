const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";

exports.saveDropboxToken =function(email,token)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        console.log(email);
        var updation = {"drives.Dropbox.token":token}
        User.updateOne(criteria,{$set:updation})
        .then((res)=>{

            success(res);
        })
        .catch((err)=>{

            failure(err.message);

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