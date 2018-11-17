const express = require('express');
const router = express.Router();
const User = require('../Modules/UserModule');
const Constants = require('../Extras/Constants');
const Drive=require('../Modules/GoogleDriveModule');
var multer = require('multer');


const upload=multer();



function getGoogleDriveTokensMiddleware(req,res,next)
{
    Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
		req.appCredentials=credentials;
		User.readGoogleDriveAccounts(req.userData.email)
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


//working if found a token from DB
router.post('/Authenticate',Constants.checkAccessMiddleware,function(req,res){
	var result=new Object(); 
	if(req.body.redirectSuccess && req.body.redirectFailure)
		userData=req.userData.email+";" + req.body.redirectSuccess + ";" + req.body.redirectFailure;
	else
		res.status(Constants.RESPONSE_FAIL).json({msg:"Could not proceed. Redirect Link not found. Please append success and failure link in request body"});
	console.log(userData);
	Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
        oAuth2Client = Drive.createAuth(credentials);
        redirectLink = Drive.getGoogleDriveAuthRedirectLink(oAuth2Client,userData);
        result.redirectLink=redirectLink;
        res.status(Constants.RESPONSE_SUCCESS).json(result);
	})
	.catch((err)=>{
		result.msg="API Credentials Failed";
		result.error=err;
		res.status(Constants.RESPONSE_FAIL).json(result);
	});
})

router.get('/ReceiveCode',function(req,res){
	console.log(req.query.code);
	//res.redirect("/GoogleDrive/ReceiveCode?code="+req.query.code);
	res.end();
})

router.get('/Code',getAppCredentialsMiddleware,function(req,res){
	var state=req.query.state;
	var splits=state.split(";");
	var email=splits[0];
	var redirectSuccess=splits[1];
	var redirectFailure=splits[2];
	oAuth2Client=Drive.createAuth(req.appCredentials);
	Drive.getTokenFromCode(req.query.code,oAuth2Client) //Add your store token func here from db module
	.then((token)=>{
		oAuth2Client.setCredentials(token);
		Drive.getUserDetails(oAuth2Client)
		.then((user)=>{
			delete user.user.me;
			delete user.user.permissionId;
			var account={user:user.user,token:token};
			User.saveGoogleDriveAccount(email,account)
			.then((result)=>{
				//res.status(Constants.RESPONSE_SUCCESS).json(result);
				res.redirect(redirectSuccess+"?email="+email);	
			})
			.catch((err)=>{
				//res.status(Constants.RESPONSE_FAIL).json({error:err,message:"Unable to store user token"});
				res.redirect(redirectFailure);
			});
		})
		//then and catch both getting called
	})
	.catch((err)=>{
		res.end(err);
	});
})

router.delete('/RemoveAllGoogleAccounts',Constants.checkAccessMiddleware,(req,res)=>{
	User.removeAllGoogleDriveAccounts(req.userData.email)
	.then((result)=>{
		result.msg="All Google accounts have been removed successfuly";
		res.status(Constants.RESPONSE_SUCCESS).json(result);
	})
	.catch((err)=>{
		res.status(Constants.RESPONSE_FAIL).json({error:err,message:"Unable to store user token"});
	});
});

//Working if find a token from db 
router.post('/ListDriveFiles',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,function(req,res){
	var listAccountEmail = req.body.listFilesAccount;
	var token;
	for (let index = 0; index < req.googleDriveAccounts.length; index++) {
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
				res.send(files);
				res.end();
			} else {
				response.end("No Files Found");
			}
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
		Drive.getFileDetails(oAuth2Client,req.params.fileId)
		.then((details)=>{
			res.header('Content-disposition', 'attachment; filename='+details.name);
			res.setHeader('Content-type', details.mimeType);
			Drive.downloadFile(oAuth2Client,req.params.fileId)
			.then((file)=>{
				res.send(file);
				res.end();
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
router.post('/UploadFile',Constants.checkAccessMiddleware,getGoogleDriveTokensMiddleware,upload.single("pic"),function(req,res){
	var downloadFileEmail = req.body.downloadFileAccount;
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
	var file=req.file;
	Drive.createAuthOject(req.appCredentials,token)
	.then((oAuth2Client)=>{
		Drive.uploadFile(oAuth2Client,file.originalname,file,file.mimetype)
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