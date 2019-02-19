const express = require('express');
const router = express.Router();
const GoogleDriveDAL = require('./GoogleDriveDAL');
const Constants = require('../Extras/Globals');
const Drive=require('./GoogleDriveBLL');
var multer = require('multer');

const upload=multer();


//Get user's drive tokens from db using meshdrive email and adds it to request + adds app credentials read from file to request as well
function getGoogleDriveTokensMiddleware(req,res,next)
{
	req.appCredentials=Constants.GOOGLE_DRIVE_APP_CREDENTIALS;
	GoogleDriveDAL.readGoogleDriveAccounts(req.userData.email) //Reading user's drive tokens from db
	.then((accounts)=>{
		req.googleDriveAccounts=accounts;
		next();
	})
	.catch((err)=>{
		return res.status(Constants.CODE_NO_CONTENT).json({message:"User has no Google Drive accounts",err:err});
	});
}

function matchGoogleDriveTokenMiddleware(req,res,next)
{
	var googleDriveEmail;
	if(req.method=="GET" || req.reqForUpload==true)
    {
        googleDriveEmail=req.params.googleDriveEmail;
    }
    else
    {
        googleDriveEmail=req.body.googleDriveEmail;
    }
	if(!googleDriveEmail)
	{
		return res.status(Constants.CODE_BAD_REQUEST).json({message:"Email not specified to get drive content"});
	}
	else
	{
		var token;
		for (let index = 0; index < req.googleDriveAccounts.length; index++) {
			var account = req.googleDriveAccounts[index];
			if(account.user.emailAddress==googleDriveEmail)
				token=account.token;
		}
		if(!token)
		{
			return res.status(Constants.CODE_NO_CONTENT).json({message:"Specified google account not found for mesh drive user"}).end();
		}
		req.token=token;
		next();
	}
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
		return res.status(Constants.CODE_BAD_REQUEST).json({err:"Could not proceed. Redirect Link not found. Please append success and failure link in request body"});
	}
	oAuth2Client = Drive.createAuth(Constants.GOOGLE_DRIVE_APP_CREDENTIALS);
	redirectLink = Drive.getGoogleDriveAuthRedirectLink(oAuth2Client,userData); //Generate redirect uri
	result.redirectLink=redirectLink;
	res.status(Constants.CODE_OK).json(result);
})


//recieves code from google after user gives consent to user the account
router.get('/Code',function(req,res){
	var state=req.query.state; //url state params contains the user data that we appended previously in creating the redirect url for identifying the user
	//Split state to get client email and redirect urls.
	var splits=state.split(";");
	var email=splits[0];
	var redirectSuccess=splits[1];
	var redirectFailure=splits[2];
	oAuth2Client=Drive.createAuth(Constants.GOOGLE_DRIVE_APP_CREDENTIALS);
	Drive.getTokenFromCode(req.query.code,oAuth2Client) //Get user token from the code that we received
	.then((token)=>{
		oAuth2Client.setCredentials(token);
		Drive.getUserDetails(oAuth2Client) //Get user details(key is the email of account that it gave us access of)
		.then((user)=>{ //User contains user's name, email, profile photo link
			GoogleDriveDAL.findGoogleDriveTokenByEmail(email,user.user.emailAddress)
			.then((check)=>{
				if(check==null)
				{
					delete user.user.me;
					delete user.user.permissionId;
					var account={user:user.user,token:token};
					GoogleDriveDAL.saveGoogleDriveAccount(email,account)
					.then((result)=>{
						res.redirect(redirectSuccess); //redirect back to the client success
					})
					.catch((err)=>{
						res.redirect(redirectFailure+"?message='Google Account Already Exists"); //redirect back to the client failure
					});
				}
				else
					res.redirect(redirectFailure);
			})
			.catch((err)=>{
				res.redirect(redirectFailure);
			});
			
		})
		//then and catch both getting called
	})
	.catch((err)=>{
		res.redirect(redirectFailure);
	});
})

//removes all google drive accounts
router.delete('/RemoveAllGoogleAccounts',Constants.checkAccessMiddleware,(req,res)=>{
	GoogleDriveDAL.removeAllGoogleDriveAccounts(req.userData.email)
	.then((result)=>{
		result.msg="All Google accounts have been removed successfuly";
		res.status(Constants.CODE_OK).json(result);
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove all google drive accounts"});
	});
});

router.delete('/RemoveGoogleAccountByEmail',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,(req,res)=>{
	var googleAccEmail=req.body.googleDriveEmail;
	GoogleDriveDAL.removeAllGoogleDriveAccountsByEmail(req.userData.email,googleAccEmail)
	.then((result)=>{
		result.message="Account removed successfuly";
		res.status(Constants.CODE_OK).json(result);
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove google drive account"});
	});
});

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
		return res.status(Constants.CODE_NO_CONTENT).json({message:"No Google Drive account found in user profile."});
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
				promises.push(Drive.listFilesRoot(oAuth2Clients[index],accountEmail,req.userData.email)); //call for list file for each account and push those promises
			}
			//Wait for all promises to complete and return the response
			Promise.all(promises).then(function(filesListForAccounts){
				var resFiles=[];
				filesListForAccounts.forEach(accountFiles => {
					resFiles=resFiles.concat(accountFiles);
				});
				res.status(Constants.CODE_OK).json(resFiles);
			}).catch((err)=>{
				res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
			});
		}).catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
		//Only success scenario working
		//No catch handled here. in case of an error this will not work
		//Need to check how to handle catch here
	}
})

router.post('/ListDriveFilesById',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var fileId=req.body.fileId; //FileId to list files and folders for it
	var listAccountEmail = req.body.googleDriveEmail; //Account email sent by the client to list files for
	var token=req.token;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		//userModule.saveToken(email,token);
		Drive.listFilesById(oAuth2Client,fileId,listAccountEmail,req.userData.email)
		.then((files)=>{
			var resObject={};
			resObject.success=true;
			resObject.parent=fileId;
			resObject.files=files;
			res.status(Constants.CODE_OK).json(resObject);
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
	});
})

router.get('/DownloadFile/:googleDriveEmail/:fileId/:token',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var token=req.token;
	
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
				res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in downloading file",err:err.message});
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




router.post('/UploadFile/:fileName/:mimeType/:googleDriveEmail/:token',Constants.checkUploadAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	
	var fileName=req.params.fileName;
	//var parentId=req.params.parentId;
	var mimeType=req.params.mimeType;
	let buff = new Buffer(mimeType, 'base64');
	mimeType= mimeType=buff.toString('ascii');
	var token=req.token;
	

	//var file=req.file;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.uploadFile(oAuth2Client,fileName,req,mimeType)
		.then((result)=>{
			res.status(Constants.CODE_OK).json({message:"File Uploaded",fileId:result});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Upload Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Upload Failed"});
	});
})

router.get('/UploadFileMetadata/:googleDriveEmail/:token',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var token=req.token;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		res.status(Constants.CODE_OK).json({msg:"Successfull",token:oAuth2Client.credentials.access_token});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in generating upload file meta",err:err});
	});
})

router.post('/CreateFolder',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var folderName=req.body.folderName;
	var parentId=req.body.parentId;
	var token=req.token;

	//var file=req.file;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.createFolder(oAuth2Client,folderName,parentId)
		.then((result)=>{
			res.status(Constants.CODE_OK).json({message:"File Uploaded",folderId:result});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Folder Creation Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Folder Creation Failed"});
	});
})


router.delete('/DeleteFile',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var fileId=req.body.fileId;
	var token=req.token;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.deleteFile(oAuth2Client,fileId)
		.then(()=>{
			res.status(Constants.CODE_OK).json({message:"File Deleted"});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Delete Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Delete Failed"});
	});
})

router.put('/MoveFile',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var fileId=req.body.fileId;
	var newParentId=req.body.newParentId;
	var oldParentId=req.body.oldParentId;
	var token=req.token;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.moveFile(oAuth2Client,fileId,newParentId,oldParentId)
		.then((file)=>{
			res.status(200).json({message:"File Moved",fileDetails:file});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Move Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Move Failed"});
	});
})


router.put('/RenameFile',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var fileId=req.body.fileId;
	var newFileName=req.body.newFileName;
	var token=req.token;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.renameFile(oAuth2Client,fileId,newFileName)
		.then((file)=>{
			res.status(200).json({message:"File Renamed",fileDetails:file});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Rename Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Rename Failed"});
	});
})


module.exports.rootFilesMiddleware=function(req,res,next){
	req.appCredentials=Constants.GOOGLE_DRIVE_APP_CREDENTIALS;
	GoogleDriveDAL.readGoogleDriveAccounts(req.userData.email) //Reading user's drive tokens from db
	.then((accounts)=>{
		req.googleDriveAccounts=accounts;
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
			next();
			//return res.status(Constants.CODE_NO_CONTENT).json({message:"No Google Drive account found in user profile."});
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
					promises.push(Drive.listFilesRoot(oAuth2Clients[index],accountEmail,req.userData.email)); //call for list file for each account and push those promises
				}
				//Wait for all promises to complete and return the response
				Promise.all(promises).then(function(filesListForAccounts){
					var resFiles=res.locals.data;
					filesListForAccounts.forEach(accountFiles => {
						resFiles=resFiles.concat(accountFiles);
					});
					res.locals.data=resFiles;
					next();
					//res.status(Constants.CODE_OK).json(filesList);
				}).catch((err)=>{
					console.log(err);
					next();
					//res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
				});
			}).catch((err)=>{
				console.log(err);
				next();
				//res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
			});
			//Only success scenario working
			//No catch handled here. in case of an error this will not work
			//Need to check how to handle catch here
		}
	})
	.catch((err)=>{
		console.log(err);
		next();
		//return res.status(Constants.CODE_NO_CONTENT).json({message:"User has no Google Drive accounts",err:err});
	});
}

//Obselete
//Gives back top 100 files from user's account(Unused route)
router.post('/ListDriveFiles',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,matchGoogleDriveTokenMiddleware,function(req,res){
	var token=req.token;
	
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		//userModule.saveToken(email,token);
		Drive.listFiles(oAuth2Client)
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
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
	});
})

module.exports.router = router;