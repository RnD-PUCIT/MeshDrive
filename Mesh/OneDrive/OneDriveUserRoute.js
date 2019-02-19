const express = require('express');
const router = express.Router();
const OneDriveDAL = require('./OneDriveDAL');
const Constants = require('../Extras/Globals');
const Drive=require('./OneDriveBLL');


//Add prompt: 'consent' to get force refresh token from GD

//Get user's drive tokens from db using meshdrive email and adds it to request + adds app credentials read from file to request as well
function getOneDriveTokensMiddleware(req,res,next)
{
	OneDriveDAL.readOneDriveAccounts(req.userData.email) //Reading user's drive tokens from db
	.then((accounts)=>{
		req.oneDriveAccounts=accounts;
		next();
	})
	.catch((err)=>{
		return res.status(Constants.CODE_NO_CONTENT).json({message:"User has no Google Drive accounts",err:err});
	});
}

function matchOneDriveTokenMiddleware(req,res,next)
{
	var oneDriveEmail=req.body.oneDriveEmail;
	if(req.method=="GET" || req.reqForUpload==true)
    {
        oneDriveEmail=req.params.oneDriveEmail;
    }
    else
    {
        oneDriveEmail=req.body.oneDriveEmail;
    }
	if(!oneDriveEmail)
	{
		return res.status(Constants.CODE_BAD_REQUEST).json({message:"Email not specified to get drive content"});
	}
	else
	{
		var token;
		for (let index = 0; index < req.oneDriveAccounts.length; index++) {
			var account = req.oneDriveAccounts[index];
			if(account.user.emailAddress==oneDriveEmail)
				token=account.token;
		}
		if(!token)
		{
			return res.status(Constants.CODE_NO_CONTENT).json({message:"Account not found in user's profile for downloading file"}).end();
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
		userData={};
		userData.redirectSuccess=req.body.redirectSuccess;
		userData.redirectFailure=req.body.redirectSuccess;
		userData.email=req.userData.email;
		userData=JSON.stringify(userData);
		let buff = new Buffer(userData);  
		userData = buff.toString('base64');
	}
	else{
		//return call if client has not appended redirect urls
		return res.status(Constants.CODE_BAD_REQUEST).json({err:"Could not proceed. Redirect Link not found. Please append success and failure link in request body"});
	}
	redirectLink = Drive.getOneDriveAuthRedirectLink(Constants.ONEDRIVE_APP_CREDETIALS,userData); //Generate redirect uri
	result.redirectLink=redirectLink;
	res.status(Constants.CODE_OK).json(result);
})


//recieves code from google after user gives consent to user the account
router.get('/Code',function(req,res){
	var state=req.query.state; //url state param contains the user data that we appended previously in creating the redirect url for identifying the user
	//Split state to get client email and redirect urls.
	let buff = new Buffer(state, 'base64');  
	var userData = buff.toString('ascii');
	userData=JSON.parse(userData);
	var email=userData.email;
	var redirectSuccess=userData.redirectSuccess;
	var redirectFailure=userData.redirectFailure;
	
	Drive.getTokenFromCode(req.query.code,Constants.ONEDRIVE_APP_CREDETIALS) //Get user token from the code that we received
	.then((token)=>{
		token=JSON.parse(token);
		Drive.getUserDetails(token) //Get user details(key is the email of account that it gave us access of)
		.then((user)=>{ //User contains user's name, email
			OneDriveDAL.findOneDriveTokenByEmail(email,user.userPrincipalName)
			.then((check)=>{
				if(check==null)
				{
					var account={
						user:{
							displayName:user.displayName,
							emailAddress:user.userPrincipalName
						},
						token:token
					};
					OneDriveDAL.saveOneDriveAccount(email,account)
					.then((result)=>{
						res.redirect(redirectSuccess); //redirect back to the client success
					})
					.catch((err)=>{
						res.redirect(redirectFailure); //redirect back to the client failure
					});
				}
				else
				{
					res.redirect(redirectFailure);
				}
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
router.delete('/RemoveAllOneDriveAccounts',Constants.checkAccessMiddleware,(req,res)=>{
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
	var oneDriveEmail=req.body.oneDriveEmail;
	OneDriveDAL.removeOneDriveAccountByEmail(req.userData.email,oneDriveEmail)
	.then((result)=>{
		result.message="Account removed successfuly";
		res.status(Constants.CODE_OK).json(result);
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove OneDrive drive account"});
	});
});

//Gives back top 100 files from user's account(Unused route)
router.post('/ListDriveFiles',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware, function(req,res){
	var oneDriveEmail = req.body.oneDriveEmail; //Account email sent by the client to list files for
	var meshDriveEmail=req.userData.email;
	var token=req.token;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
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
		return res.status(Constants.CODE_NO_CONTENT).json({message:"No Google Drive account found in user profile."});
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
				promises.push(Drive.listFilesRoot(token,accountEmail,req.userData.email)); //call for list file for each account and push those promises
			}
			//Wait for all promises to complete and return the response
			Promise.all(promises).then(function(filesListForAccounts){
				var resFiles=[];
				filesListForAccounts.forEach(accountFiles => {
					resFiles=resFiles.concat(accountFiles);
				});
				res.status(Constants.CODE_OK).json(resFiles);
			});
		}).catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in listing files",err:err});
		});
		//Only success scenario working
		//No catch handled here. in case of an error this will not work
		//Need to check how to handle catch here
	}
})

router.post('/ListDriveFilesById',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var fileId=req.body.fileId; //FileId to list files and folders for it
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail; //Account email sent by the client to list files for
	var token=req.token;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.listFilesById(token,fileId,oneDriveEmail,req.userData.email)
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



router.get('/DownloadFile/:oneDriveEmail/:fileId/:token',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var token=req.token;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.getFileDetails(token,req.params.fileId) //Get file details first from drive
		.then((details)=>{
			res.setHeader("Access-Control-Expose-Headers","File-Name,Content-disposition");
			res.setHeader('Content-disposition', 'attachment; filename='+details.name);
			res.setHeader('Content-type', details.file.mimeType);
			res.setHeader("File-Name",details.name);
			Drive.downloadFile(token,req.params.fileId,res)
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


router.post('/UploadFile/:fileName/:mimeType/:oneDriveEmail/:token',Constants.checkUploadAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var fileName=req.params.fileName;
	var mimeType=req.params.mimeType;
	let buff = new Buffer(mimeType, 'base64');
	mimeType= mimeType=buff.toString('ascii');
	var token=req.token;

	//var file=req.file;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.uploadFile(token,fileName,req,mimeType)
		.then((result)=>{
			res.status(Constants.CODE_OK).json({message:"File Uploaded",file:result});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Upload Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Upload Failed"});
	});
})


router.get('/DownloadFileMetadata/:oneDriveEmail/:token',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var token=req.token;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		res.status(Constants.CODE_OK).json({msg:"Successfull",token:token.access_token});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in downloading file",err:err});
	});
})

router.get('/UploadFileMetadata/:oneDriveEmail/:token',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var token=req.token;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		res.status(Constants.CODE_OK).json({msg:"Successfull",token:token.access_token});
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Error in generating upload file meta",err:err});
	});
})

router.post('/CreateFolder',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var parentId=req.body.parentId;
	var folderName=req.body.folderName;
	var token=req.token;

	//var file=req.file;
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.createFolder(token,folderName,parentId)
		.then((result)=>{
			res.status(Constants.CODE_OK).json({message:"Folder Created",folder:result});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Folder Creation Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Folder Creation Failed"});
	});
})


router.delete('/DeleteFile',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var fileId=req.body.fileId;
	var token=req.token;
	
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.deleteFile(token,fileId)
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


router.put('/RenameFile',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var fileId=req.body.fileId;
	var newFileName=req.body.newFileName;
	var token=req.token;
	
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.renameFile(token,fileId,newFileName)
		.then((file)=>{
			res.status(Constants.CODE_OK).json({message:"File Moved",folder:file});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Rename Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Rename Failed"});
	});
})


router.put('/MoveFile',Constants.checkAccessMiddleware,getOneDriveTokensMiddleware,matchOneDriveTokenMiddleware,function(req,res){
	var meshDriveEmail=req.userData.email;
	var oneDriveEmail = req.body.oneDriveEmail;
	var fileId=req.body.fileId;
	var newParentId=req.body.newParentId;
	var token=req.token;
	
	Drive.refreshToken(Constants.ONEDRIVE_APP_CREDETIALS,token)
	.then((token)=>{
		if(token.updated)
		{
			OneDriveDAL.updateOneDriveToken(meshDriveEmail,oneDriveEmail,token);
		}
		Drive.moveFile(token,fileId,newParentId)
		.then((file)=>{
			res.status(Constants.CODE_OK).json({message:"File Moved",folder:file});
		})
		.catch((err)=>{
			res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Move Failed"});
		})
	})
	.catch((err)=>{
		res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({err:err,message:"Move Failed"});
	});
})


module.exports.rootFilesMiddleware=function(req,res,next){
	OneDriveDAL.readOneDriveAccounts(req.userData.email) //Reading user's drive tokens from db
	.then((accounts)=>{
		req.oneDriveAccounts=accounts;
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
			return res.status(Constants.CODE_NO_CONTENT).json({message:"No Google Drive account found in user profile."});
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
					promises.push(Drive.listFilesRoot(token,accountEmail,req.userData.email)); //call for list file for each account and push those promises
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


module.exports.router = router;