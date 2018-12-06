const express = require('express');
const router = express.Router();
const OneDriveDAL = require('./OneDriveDAL');
const Constants = require('../Extras/Globals');
const Drive=require('./OneDriveBLL');
const moment=require('moment');


//Get user's drive tokens from db using meshdrive email and adds it to request + adds app credentials read from file to request as well
function getOneDriveTokensMiddleware(req,res,next)
{
	req.appCredentials=Constants.GOOGLE_DRIVE_APP_CREDENTIALS;
	OneDriveDAL.readOneDriveAccounts(req.userData.email) //Reading user's drive tokens from db
	.then((accounts)=>{
		req.oneDriveAccounts=accounts;
		next();
	})
	.catch((err)=>{
		return res.status(Constants.CODE_NOT_FOUND).json({message:"User has no Google Drive accounts",err:err});
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
		return res.status(Constants.CODE_NOT_FOUND).json({err:"Could not proceed. Redirect Link not found. Please append success and failure link in request body"});
	}
	redirectLink = Drive.getOneDriveAuthRedirectLink(Constants.ONEDRIVE_APP_CREDETIALS,userData); //Generate redirect uri
	result.redirectLink=redirectLink;
	res.status(Constants.RESPONSE_SUCCESS).json(result);
})


//recieves code from google after user gives consent to user the account
router.get('/Code',function(req,res){
	var state=req.query.state; //url state param contains the user data that we appended previously in creating the redirect url for identifying the user
	//Split state to get client email and redirect urls.
	var splits=state.split(";");
	var email=splits[0];
	var redirectSuccess=splits[1];
	var redirectFailure=splits[2];

	Drive.getTokenFromCode(req.query.code,Constants.ONEDRIVE_APP_CREDETIALS) //Get user token from the code that we received
	.then((token)=>{
		token=JSON.parse(token);
		Drive.getUserDetails(token) //Get user details(key is the email of account that it gave us access of)
		.then((user)=>{ //User contains user's name, email
			var account={
				user:{
					displayName:user.displayName,
					emailAddress:user.userPrincipalName
				},
				token:token
			};
			OneDriveDAL.saveOneDriveAccount(email,account)
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
		res.redirect(redirectFailure);
	});
})

//removes all google drive accounts
router.delete('/RemoveAllOneAccounts',Constants.checkAccessMiddleware,(req,res)=>{
	OneDriveDAL.removeAllOneDriveAccounts(req.userData.email)
	.then((result)=>{
		result.msg="All OneDrive accounts have been removed successfuly";
		res.status(Constants.CODE_OK).json(result);
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove all OneDrive drive accounts"});
	});
});

router.delete('/RemoveOneDriveAccountByEmail',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,(req,res)=>{
	var googleAccEmail=req.body.googleAccountEmail;
	OneDriveDAL.removeOneDriveAccountByEmail(req.userData.email,googleAccEmail)
	.then((result)=>{
		result.message="Account removed successfuly";
		res.status(Constants.CODE_OK).json(result);
	})
	.catch((err)=>{
		res.status(Constants.CODE_NOT_FOUND).json({error:err,message:"Unable to remove OneDrive drive account"});
	});
});

//Gives back top 100 files from user's account(Unused route)
router.post('/ListDriveFiles',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware, function(req,res){
	var listAccountEmail = req.body.listFilesAccount; //Account email sent by the client to list files for
	var meshDriveEmail=req.userData.email;
	var token;
	for (let index = 0; index < req.oneDriveAccounts.length; index++) { //Loop throught google drive accounts in the db and see if email matches and get that token
		var account = req.oneDriveAccounts[index];
		if(account.user.emailAddress==listAccountEmail)
			token=account.token;
	}
	if(!token)
	{
		return res.status(Constants.CODE_NOT_FOUND).json({message:"No Google Drive account found in user profile."});
	}
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,listAccountEmail,token);
		}
		Drive.listFiles(token)
		.then((files)=>{
			if (files.length) {
				res.status(Constants.CODE_OK).json(files);
			} else {
				res.status(Constants.CODE_NO_CONTENT).json({message:"No files found"});
			}
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
	})
	.catch((err)=>{
		return res.status(Constants.CODE_UNKNOWN_ERROR).json({
 		message:"Unable to refresh token.",err:tokenResponse.error});
	});

	
})


router.post('/ListDriveRootFiles',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,function(req,res){
	var listFilesAccount = req.body.listFilesAccount; //List of accounts to get files from
	var meshDriveEmail=req.userData.email;
	var accountTokenList=[];
	if(req.body.listFilesAccount) //If there is a list of accounts get token for only those accounts
	{
		for (let account = 0; account < listFilesAccount.length; account++) { 
			const givenAccount = listFilesAccount[account];
			for (let index = 0; index < req.oneDriveAccounts.length; index++) {
				var storeAccount = req.oneDriveAccounts[index];
				if(storeAccount.user.emailAddress==givenAccount)
					accountTokenList.push({email:storeAccount.user.emailAddress,token:storeAccount.token});
			}
		}
	}	
	else //else get token for all accounts that are in db
	{
		for (let index = 0; index < req.oneDriveAccounts.length; index++) {
			var storeAccount = req.oneDriveAccounts[index];
			accountTokenList.push({email:storeAccount.user.emailAddress,token:storeAccount.token});
		}
	}

	if(accountTokenList.length==0) //If no token found return
	{
		return res.status(Constants.CODE_NOT_FOUND).json({message:"No Google Drive account found in user profile."});
	}
	else
	{
		var promises=[]; //Create array for promises
		for (let index = 0; index < accountTokenList.length; index++) {
			const token = accountTokenList[index].token;
			promises.push(Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)); //call for creating oAuthObjects for each token and push those promises
		}
		//Wait for all promises to complete and then go for listing files
		Promise.all(promises).then(function(tokens){
			
			var promises=[]; //Array of promises for listing each account files
			for (let index = 0; index < accountTokenList.length; index++) {
				var accountEmail=accountTokenList[index].email;
				token=tokens[index];
				if(token.updated)
				{
					OneDriveDAL.updateOneDriveToken(meshDriveEmail,accountEmail,token);
				}
				promises.push(Drive.listFilesRoot(token,accountEmail)); //call for list file for each account and push those promises
			}
			//Wait for all promises to complete and return the response
			Promise.all(promises).then(function(filesList){
				res.status(Constants.CODE_OK).json(filesList);
			});
		}).catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
		//Only success scenario working
		//No catch handled here. in case of an error this will not work
		//Need to check how to handle catch here
	}
})

router.post('/ListDriveFilesById',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,function(req,res){
	var fileId=req.body.fileId; //FileId to list files and folders for it
	var listAccountEmail = req.body.listFilesAccount; //Account email sent by the client to list files for
	var token;
	for (let index = 0; index < req.oneDriveAccounts.length; index++) { //Loop throught google drive accounts in the db and see if email matches and get that token
		var account = req.oneDriveAccounts[index];
		if(account.user.emailAddress==listAccountEmail)
			token=account.token;
	}
	if(!token)
	{
		return res.status(Constants.CODE_NOT_FOUND).json({message:"No Google Drive account found in user profile."});
	}
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,listAccountEmail,token);
		}
		Drive.listFilesById(token,fileId)
		.then((files)=>{
			//Creating this response structure just to match listRootFiles structure
			var response=[];
			var driveFiles={};
			driveFiles.files=files;
			driveFiles.email=listAccountEmail;
			driveFiles.drive="onedrive";
			response.push(driveFiles);
			res.status(Constants.CODE_OK).json(response);
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
	});
})

router.get('/DownloadFile/:downloadFileAccount/:fileId/:token',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,function(req,res){
	var downloadFileEmail = req.params.downloadFileAccount;
	var token;
	for (let index = 0; index < req.oneDriveAccounts.length; index++) {
		var account = req.oneDriveAccounts[index];
		if(account.user.emailAddress==downloadFileEmail)
			token=account.token;
	}
	if(!token)
	{
		return res.status(Constants.CODE_NOT_FOUND).json({message:"No Google Drive account found in user profile."});
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
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in downloading file",err:err});
		});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in downloading file",err:err});
	});
})


router.post('/UploadFile/:fileName/:mimeType/:uploadFileEmail/:token',Constants.checkUploadAccessMiddleware,getOneDriveTokensMiddleware,function(req,res){
	var uploadFileEmail=req.params.uploadFileEmail;
	var fileName=req.params.fileName;
	var mimeType=req.params.mimeType;
	let buff = new Buffer(mimeType, 'base64');
	mimeType= mimeType=buff.toString('ascii');
	var token;
	for (let index = 0; index < req.oneDriveAccounts.length; index++) {
		var account = req.oneDriveAccounts[index];
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