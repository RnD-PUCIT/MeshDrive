const User = require('../Models/UserModel');
const mongoose = require('mongoose');
var dateFormat = require('dateformat');
const url = "mongodb://localhost/mydb";

// mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });

exports.readOneDriveAccounts =function(email)
{
	return new Promise(function(success,failure)
	{
        var criteria = {"email":email};
		User.findOne(criteria).then((user)=>{
            if(user.drives.OneDrive.AccountsList)
            {
                success(user.drives.OneDrive.AccountsList);
            }
            else
            {
                failure("No Google Drive Accounts found");  
            }
		}).catch((err)=>{
            failure("Cannot read token");
        })
		
	});
}

exports.saveOneDriveAccount =function(email,account)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"drives.OneDrive.AccountsList":account}
        User.updateOne(criteria,{$push:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.removeAllOneDriveAccounts =function(email)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"drives.OneDrive.AccountsList":[]}
        User.update(criteria,{$set:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.removeOneDriveAccountByEmail =function(meshAccountEmail,oneDriveAccountEmail)
{
    return new Promise(function(success,failure)
	{
        var criteria = {"email":meshAccountEmail};
		User.findOne(criteria).then((user)=>{
            if(user.drives.OneDrive.AccountsList)
            {
                var accPos=-1;
                var accountsList=user.drives.OneDrive.AccountsList;
                for (let index = 0; index < accountsList.length; index++) {
                    const account = accountsList[index];
                    if(account.user.emailAddress==oneDriveAccountEmail)
                        accPos=index;
                }
                if(accPos==-1)
                    success("Account not found in user's onedrive accounts");
                else
                {
                    accountsList.splice(accPos,1);
                    var criteria = {"email":meshAccountEmail};
                    var updation = {"drives.OneDrive.AccountsList":accountsList}
                    User.update(criteria,{$set:updation})
                    .then((res)=>{
                        success(res);
                    })
                    .catch((err)=>{
                        failure(err.message);
                    });	
                }
            }
            else
            {
                failure("No OneDrive Accounts found");  
            }
        })
        .catch((err)=>{
            failure(err.message);
        })
	});
}

exports.updateOneDriveToken =function(meshDriveEmail,oneDriveEmail,token)
{
	return new Promise((success,failure)=>{
        token.LastModifiedOn=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var criteria = {"email":meshDriveEmail,"drives.OneDrive.AccountsList.user.emailAddress":oneDriveEmail};
        var updation = {"drives.OneDrive.AccountsList.$.token":token}
        User.findOneAndUpdate(criteria,{$set:updation},{new:true})
        .then((res)=>{
            //success(res);
        })
        .catch((err)=>{
            //failure(err.message);
        });	
	});
}


// exports.readUserTokens =function(email)
// {
// 	return new Promise(function(success,failure)
// 	{
// 		var criteria = {"email":email};
// 		User.findOne(criteria).then((user)=>{
           
//             if(user.token==false)
//             {
//                 failure("Token Empty"); 
//             }
//             else
//             {
//                 success(user.drives.GoogleDrive); 
//             }
// 		}).catch((err)=>{
//             failure("Cannot read token");
//         })
		
// 	});
// }


// exports.saveUserTokens =function(email,token)
// {
// 	return new Promise(function(success,failure){	
        
//         var criteria = {"email":email};
//         var updation = {"token":token}

//         User.updateOne(criteria,{$set:updation}).
//         then((result)=>{
//             success(result);
//         }).
//         catch((err)=>{
//             failure(err.message);
//         });	
// 	});
// }

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}