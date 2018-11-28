const express = require('express');
const router = express.Router();
const User = require('../Modules/UserBLL');
const Constants = require('../Extras/Globals');
const Drive=require('../Modules/GoogleDriveBLL');
const promise=require("promises");
var multer = require('multer');


const upload=multer();


//Get user's drive tokens from db using meshdrive email and adds it to request + adds app credentials read from file to request as well
function getGoogleDriveTokensMiddleware(req,res,next)
{
    Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
		req.appCredentials=credentials;
		User.readGoogleDriveAccounts(req.userData.email) //Reading user's drive tokens from db
		.then((accounts)=>{
			req.googleDriveAccounts=accounts;
			next();
		})
		.catch((err)=>{
		res.status(Constants.RESPONSE_FAIL).json({err:"User has no Google Drive accounts"});
		});
	})
	.catch((err)=>{
        result.error="API Credentials Failed";
		res.status(Constants.RESPONSE_FAIL).json(result);
	});
}

//Adds app credentials to request after reading from file
function getAppCredentialsMiddleware(req,res,next)
{
	result=new Object();
    Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
        req.appCredentials=credentials;
        next();
	})
	.catch((err)=>{
        result.error="API Credentials Failed";
		res.status(Constants.RESPONSE_FAIL).json(result);
	});
}


//Gives redirect url where user can give access to it's google drive.
router.post('/Authenticate',Constants.checkAccessMiddleware,function(req,res){
	var result=new Object(); 
	//Getting redirect urls from request body.
	if(req.body.redirectSuccess && req.body.redirectFailure){
		userData=req.userData.email+";" + req.body.redirectSuccess + ";" + req.body.redirectFailure; //Creating a colon separated string to send along redirect uri to identify the user when google redirects back
	}
	else{
		//return call if client has not appended redirect urls
		return res.status(Constants.RESPONSE_FAIL).json({msg:"Could not proceed. Redirect Link not found. Please append success and failure link in request body"});
	}
	Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
        oAuth2Client = Drive.createAuth(credentials);
        redirectLink = Drive.getGoogleDriveAuthRedirectLink(oAuth2Client,userData); //Generate redirect uri
        result.redirectLink=redirectLink;
        res.status(Constants.RESPONSE_SUCCESS).json(result);
	})
	.catch((err)=>{
		result.msg="API Credentials Failed";
		result.error=err;
		res.status(Constants.RESPONSE_FAIL).json(result);
	});
})


//recieves code from google after user gives consent to user the account
router.get('/Code',getAppCredentialsMiddleware,function(req,res){
	var state=req.query.state; //url state param contains the user data that we appended previously in creating the redirect url for identifying the user
	//Split state to get client email and redirect urls.
	var splits=state.split(";");
	var email=splits[0];
	var redirectSuccess=splits[1];
	var redirectFailure=splits[2];
	oAuth2Client=Drive.createAuth(req.appCredentials);
	Drive.getTokenFromCode(req.query.code,oAuth2Client) //Get user token from the code that we received
	.then((token)=>{
		oAuth2Client.setCredentials(token);
		Drive.getUserDetails(oAuth2Client) //Get user details(key is the email of account that it gave us access of)
		.then((user)=>{ //User contains user's name, email, profile photo link
			delete user.user.me;
			delete user.user.permissionId;
			var account={user:user.user,token:token};
			User.saveGoogleDriveAccount(email,account)
			.then((result)=>{
				res.redirect(redirectSuccess+user.user.emailAddress); //redirect back to the client success
			})
			.catch((err)=>{
				res.redirect(redirectFailure); //redirect back to the client failure
			});
		})
		//then and catch both getting called
	})
	.catch((err)=>{
		res.end(err);
	});
})

//removes all google drive accounts
router.delete('/RemoveAllGoogleAccounts',Constants.checkAccessMiddleware,(req,res)=>{
	User.removeAllGoogleDriveAccounts(req.userData.email)
	.then((result)=>{
		result.msg="All Google accounts have been removed successfuly";
		res.status(Constants.RESPONSE_SUCCESS).json(result);
	})
	.catch((err)=>{
		res.status(Constants.RESPONSE_FAIL).json({error:err,message:"Unable to remove all google drive accounts"});
	});
});

//Gives back top 100 files from user's account
router.post('/ListDriveFiles',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,function(req,res){
	var listAccountEmail = req.body.listFilesAccount; //Account email sent by the client to list files for
	var token;
	for (let index = 0; index < req.googleDriveAccounts.length; index++) { //Loop throught google drive accounts in the db and see if email matches and get that token
		var account = req.googleDriveAccounts[index];
		if(account.user.emailAddress==listAccountEmail)
			token=account.token;
	}
	if(!token)
	{
		res.status(Constants.RESPONSE_EMPTY).json({message:"Account not found in user's profile for listing files"});
	}
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		//userModule.saveToken(email,token);
		Drive.listFiles(oAuth2Client)
		.then((files)=>{
			if (files.length) {
				res.status(Constants.RESPONSE_SUCCESS).json(files);
			} else {
				res.status(Constants.RESPONSE_EMPTY).json({msg:"No files found"});
			}
		})
		.catch((err)=>{
			res.status(Constants.RESPONSE_EMPTY).json({msg:"Error in listing files"});
		});
	})
	.catch((err)=>{
		res.status(Constants.RESPONSE_EMPTY).json({msg:"Error in listing files"});
	});
})


router.post('/ListDriveRootFiles',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,function(req,res){
	var listFilesAccount = req.body.listFilesAccount; //List of accounts to get files from
	var accountTokenList=[];
	if(req.body.listFilesAccount) //If there is a list of accounts get token for only those accounts
	{
		for (let account = 0; account < listFilesAccount.length; account++) { 
			const givenAccount = listFilesAccount[account];
			for (let index = 0; index < req.googleDriveAccounts.length; index++) {
				var storeAccount = req.googleDriveAccounts[index];
				if(storeAccount.user.emailAddress==givenAccount)
					accountTokenList.push({email:storeAccount.user.emailAddress,token:storeAccount.token});
			}
		}
	}	
	else //else get token for all accounts that are in db
	{
		for (let index = 0; index < req.googleDriveAccounts.length; index++) {
			var storeAccount = req.googleDriveAccounts[index];
			accountTokenList.push({email:storeAccount.user.emailAddress,token:storeAccount.token});
		}
	}

	if(accountTokenList.length==0) //If no token found return
	{
		res.status(Constants.RESPONSE_EMPTY).json({message:"No account found in user's profile for listing files"});
	}
	else
	{
		var promises=[]; //Create array for promises
		for (let index = 0; index < accountTokenList.length; index++) {
			const token = accountTokenList[index].token;
			promises.push(Drive.createAuthOject(req.appCredentials,token)); //call for creating oAuthObjects for each token and push those promises
		}
		//Wait for all promises to complete and then go for listing files
		Promise.all(promises).then(function(oAuth2Clients){
			var promises=[]; //Array of promises for listing each account files
			for (let index = 0; index < accountTokenList.length; index++) {
				var accountEmail=accountTokenList[index].email;
				promises.push(Drive.listFilesRoot(oAuth2Clients[index],accountEmail)); //call for list file for each account and push those promises
			}
			//Wait for all promises to complete and return the response
			Promise.all(promises).then(function(filesList){
				res.status(Constants.RESPONSE_SUCCESS).json(filesList);
			});
		});
		//Only success scenario working
		//No catch handled here. in case of an error this will not work
		//Need to check how to handle catch here
	}
})

router.post('/ListDriveFilesById',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,function(req,res){
	var fileId=req.body.fileId; //FileId to list files and folders for it
	var listAccountEmail = req.body.listFilesAccount; //Account email sent by the client to list files for
	var token;
	for (let index = 0; index < req.googleDriveAccounts.length; index++) { //Loop throught google drive accounts in the db and see if email matches and get that token
		var account = req.googleDriveAccounts[index];
		if(account.user.emailAddress==listAccountEmail)
			token=account.token;
	}
	if(!token)
	{
		res.status(Constants.RESPONSE_EMPTY).json({message:"Account not found in user's profile for listing files"});
	}
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		//userModule.saveToken(email,token);
		Drive.listFilesById(oAuth2Client,fileId)
		.then((files)=>{
			//Creating this response structure just to match listRootFiles structure
			var response=[];
			var driveFiles={};
			driveFiles.files=files;
			driveFiles.email=listAccountEmail;
			driveFiles.drive="googleDrive";
			response.push(driveFiles);
			res.status(Constants.RESPONSE_SUCCESS).json(response);
		})
		.catch((err)=>{
			res.end(err);
		});
	})
	.catch((err)=>{
		res.end(err.msg);
	});
})


// incomplete
router.get('/DownloadFile/:downloadFileAccount/:fileId/:token',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,function(req,res){
	var downloadFileEmail = req.params.downloadFileAccount;
	var token;
	for (let index = 0; index < req.googleDriveAccounts.length; index++) {
		var account = req.googleDriveAccounts[index];
		if(account.user.emailAddress==downloadFileEmail)
			token=account.token;
	}
	if(!token)
	{
		res.status(Constants.RESPONSE_EMPTY).json({message:"Account not found in user's profile for downloading file"}).end();
	}
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.getFileDetails(oAuth2Client,req.params.fileId) //Get file details first from drive
		.then((details)=>{
			res.setHeader("Access-Control-Expose-Headers","File-Name,Content-disposition");
			res.setHeader('Content-disposition', 'attachment; filename='+details.name);
			res.setHeader('Content-type', details.mimeType);
			res.setHeader("File-Name",details.name);
			Drive.downloadFile(oAuth2Client,req.params.fileId,res)
			.then(()=>{
				res.end(); //End the response when success function is called
			})
			.catch((err)=>{
				res.end(err.message);
			});
		})
		.catch((err)=>{
			res.end(err.message);
		});
	})
	.catch((err)=>{
		res.end(err.msg);
	});
})

//Working if find a token from db 
router.post('/UploadFile/:fileName/:mimeType/:token',Constants.checkUploadAccessMiddleware,getGoogleDriveTokensMiddleware,upload.single("pic"),function(req,res){
	var uploadFileEmail="bilalyasin1616@gmail.com";
	var fileName=req.params.fileName;
	var mimeType=req.params.mimeType;
	console.log(fileName);
	console.log(mimeType);
	//var downloadFileEmail = req.body.downloadFileAccount;
	var token;
	for (let index = 0; index < req.googleDriveAccounts.length; index++) {
		var account = req.googleDriveAccounts[index];
		if(account.user.emailAddress==uploadFileEmail)
			token=account.token;
	}
	if(!token)
	{
		res.status(Constants.RESPONSE_EMPTY).json({message:"Account not found in user's profile for downloading file"}).end();
	}

	//var file=req.file;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.uploadFile(oAuth2Client,fileName,req,mimeType)
		.then((result)=>{
			res.status(200).json({message:"File Uploaded" + result});
		})
		.catch((err)=>{
			res.status(Constants.RESPONSE_FAIL).json(err);
		})
	})
	.catch((err)=>{
		res.end(err.msg);
	});
})



module.exports = router;