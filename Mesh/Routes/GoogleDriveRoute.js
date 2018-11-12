const express = require('express');
const router = express.Router();
const User = require('../Modules/UserModule');
const Constants = require('../Extras/Constants');
const Drive=require('../Modules/GoogleDriveModule');

function getGoogleDriveTokensMiddleware(req,res,next)
{
	result=new Object();
    Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
		req.appCredentials=credentials;
		User.readGoogleDriveTokens(req.userData.email)
		.then((tokens)=>{
			req.googleDriveTokens=tokens;
			next();
		})
		.catch((err)=>{
			result.error="User has no Google Drive accounts integrated";
		res.status(Constants.RESPONSE_FAIL).json(result);
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
	Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{
        oAuth2Client = Drive.createAuth(credentials);
        redirectLink = Drive.getGoogleDriveAuthRedirectLink(oAuth2Client,req.userData.email);
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
	oAuth2Client=Drive.createAuth(req.appCredentials);
	Drive.getTokenFromCode(req.query.code,oAuth2Client) //Add your store token func here from db module
	.then((token)=>{
		// Drive.createAuthOject(req.appCredentials,token)
		// .then((result)=>{
		// 	authAndToken=JSON.parse(result);
		// 	oAuth2Client=authAndToken.client;
		// 	Drive.getUserDetails(oAuth2Client)
		// 	.then((user)=>{
		// 		res.end(user);
		// 	})
		// 	.catch((err)=>{
		// 		res.end(err);
		// 	});
		// })
		// .catch((err)=>{
		// 	res.end(err);
		// });
		User.saveGoogleDriveTokens(req.query.state,token)
		.then((result)=>{
			result.msg="Token Successfuly Stored in DB";
			res.status(Constants.RESPONSE_SUCCESS).json(result);
			//Redirect to success page	
		})
		.catch((err)=>{
			res.status(Constants.RESPONSE_FAIL).json({error:err,message:"Unable to store user token"});
			//Redirect to failure page
		});
	})
	.catch((err)=>{
		res.end(err);
	});
})

router.delete('/RemoveAllGoogleAccounts',Constants.checkAccessMiddleware,(req,res)=>{
	User.removeAllGoogleDriveTokens(req.userData.email)
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
	Drive.createAuthOject(req.appCredentials,req.googleDriveTokens[0])
	.then((result)=>{
		jsonObj=JSON.parse(result);
		oAuth2Client=jsonObj.client;
		token=jsonObj.token;
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
router.get('/DownloadFile',function(req,res){
	Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{ //will call db.readTokens here
		readTokens()
		.then((token,refreshToken)=>{
			oAuth2Client = Drive.createAuthOject(credentials,token,refreshToken);
			Drive.downloadFile(oAuth2Client,req.query.fileId)
			.then((file)=>{
				res.send(file);
				res.end();
			})
			.catch((err)=>{
				res.end(err);
			});
		})
		.catch((err)=>{
			console.log(err);
			res.redirect("http://localhost:8000/Authenticate");
			res.end();
		});
	})
	.catch((err)=>{
		res.redirect(err);
	});
})

//Working if find a token from db 
router.get('/UploadFile',function(req,res){


	var email= req.params.email;
	Drive.readFile(Constants.CREDENTIALS_PATH)
	.then((credentials)=>{ //will call db.readTokens here
		userModule.readTokens(email)
		.then((token,refreshToken)=>{     
            Drive.createAuthOject(credentials,token,refreshToken).then((result)=>{

                console.log("hello");
               var oAuth2Client=result.client;
                Drive.uploadFile(oAuth2Client)
                .then((result)=>{
                    res.status(200).json({message:"File Uploaded" + result});
                })
                .catch((err)=>{
                    res.status(500).json(err);
                })
            });
           
		})
		.catch((err)=>{
			console.log(err);
	
			res.end("sorry");
		});
	})
	.catch((err)=>{
		res.end(err);
	});
})



module.exports = router;