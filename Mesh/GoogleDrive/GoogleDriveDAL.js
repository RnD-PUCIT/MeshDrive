const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";

// mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });


//move it to UserDAL
exports.readAccounts =function(email)
{
	return new Promise(function(success,failure)
	{
        var criteria = {"email":email};
        
        //new addition       
        var result=new Object();
        result.driveAccountsList=new Object();
		User.findOne(criteria).then((user)=>{
        if(user.drives)
        {
            var accounts=user.drives;
            result.driveAccountsList.googleDriveAccountsList=[];
            if(accounts.GoogleDrive.AccountsList.length>0)
            {
                var oneDriveAccounts=accounts.GoogleDrive.AccountsList;     
                var accountsEmailArray=new Array();
                for (let index = 0; index < oneDriveAccounts.length; index++) {
                    var account = oneDriveAccounts[index];
                    accountsEmailArray.push(account.user.emailAddress);
                }
                result.driveAccountsList.googleDriveAccountsList=accountsEmailArray;
            }
            //change when convert to multiple accounts
            var dropboxAcccounts=accounts.Dropbox.AccountsList;
            result.driveAccountsList.dropboxAccountsList=[];
            console.log(dropboxAcccounts);
            if(dropboxAcccounts.length>0)
            {
              
                var dbxEmails = new Array();
                
                for(var i = 0;i<dropboxAcccounts.length;i++)
                {    
                    dbxEmails.push(dropboxAcccounts[i].user.emailAddress);  
                }
                
            // //     if(dropboxAcccounts.user.emailAddress)
            // //         dbxEmails.push(dropboxAcccounts.user.emailAddress);  
                result.driveAccountsList.dropboxAccountsList=dbxEmails;
            }   

            result.driveAccountsList.oneDriveAccountsList=[];
            if(accounts.OneDrive.AccountsList.length>0)
            {
                var oneDriveAccounts=accounts.OneDrive.AccountsList;     
                var accountsEmailArray=new Array();
                for (let index = 0; index < oneDriveAccounts.length; index++) {
                    var account = oneDriveAccounts[index];
                    accountsEmailArray.push(account.user.emailAddress);
                }
                result.driveAccountsList.oneDriveAccountsList=accountsEmailArray;
            } 
            success(result);
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
                failure("No Google Drive Accounts found");  
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

exports.removeAllGoogleDriveAccountsByEmail =function(meshAccountEmail,googlDriveAccountEmail)
{
    return new Promise(function(success,failure)
	{
        var criteria = {"email":meshAccountEmail};
		User.findOne(criteria).then((user)=>{
            if(user.drives.GoogleDrive.AccountsList)
            {
                var accPos=-1;
                var accountsList=user.drives.GoogleDrive.AccountsList;
                for (let index = 0; index < accountsList.length; index++) {
                    const account = accountsList[index];
                    if(account.user.emailAddress==googlDriveAccountEmail)
                        accPos=index;
                }
                if(accPos==-1)
                    success("Account not found in user's google drive accounts");
                else
                {
                    accountsList.splice(accPos,1);
                    var criteria = {"email":meshAccountEmail};
                    var updation = {"drives.GoogleDrive.AccountsList":accountsList}
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
                failure("No Google Drive Accounts found");  
            }
        })
        .catch((err)=>{
            failure(err.message);
        })
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
            success(result);
        }).
        catch((err)=>{
            failure(err.message);
        });	
	});
}


exports.findGoogleDriveTokenByEmail =function(meshDriveEmail,googleDriveEmail)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":meshDriveEmail,"drives.GoogleDrive.AccountsList.user.emailAddress":googleDriveEmail};
        User.findOne(criteria)
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
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