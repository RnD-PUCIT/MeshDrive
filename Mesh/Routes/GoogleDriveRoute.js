
// //working if found a token from DB
// app.get('/Authenticate/:email',function(req,res){
// 	var email = req.params.email;
// 	SESSION_EMAIL=email;
//     console.log(email);
// 	Drive.readFile(CREDENTIALS_PATH)
// 	.then((credentials)=>{
// 		userModule.readTokens(email) //Read toke from db here
// 		.then((token)=>{
// 			console.log("test : "+token);
// 			res.redirect("/ListDriveFiles/"+email);
// 			res.end();
// 		})
// 		.catch((err)=>{
// 			console.log(err);
// 			oAuth2Client = Drive.createAuth(credentials);
// 			redirectLink = Drive.authorizeUser(oAuth2Client);
// 			res.redirect(redirectLink);
// 			res.end();
// 		});
// 	})
// 	.catch((err)=>{
// 		res.end(err);
// 	});
// })

// app.get('/Code',function(req,res){
// 	res.redirect("http://localhost:8000/ReceiveCode?code="+req.query.code);
// 	res.end();
// })

// app.get('/ReceiveCode',function(req,res){
//     console.log("in receive code");
// 	Drive.readFile(CREDENTIALS_PATH)
// 	.then((credentials)=>{
// 		oAuth2Client=Drive.createAuthOject(credentials);
// 		Drive.getTokenFromCode(req.query.code,oAuth2Client) //Add your store token func here from db module
// 		.then((token)=>{
// 			userModule.saveToken(SESSION_EMAIL,token)
// 			.then((result)=>{
// 					console.log(result);
// 			}).catch((err)=>{
// 				console.log(err.message);
// 			});
// 			res.redirect("/ListDriveFiles/"+SESSION_EMAIL);
// 		})
// 		.catch((err)=>{
// 			res.end(err);
// 		});
// 	})
// 	.catch((err)=>{
// 		res.end(err);
// 	})
// })

// //Working if find a token from db 
// app.get('/ListDriveFiles/:email',function(req,res){
	
// 	var email = req.params.email;
// 	SESSION_EMAIL=email;
// 	Drive.readFile(CREDENTIALS_PATH)
// 	.then((credentials)=>{ 
// 		userModule.readTokens(email)	//will call db.readTokens here(current func at the bottom)
// 		.then((token)=>{
// 			Drive.createAuthOject(credentials,token)
// 			.then((result)=>{
// 				oAuth2Client=result.client;
// 				token=result.token;
// 				console.log(token);
// 				userModule.saveToken(email,token);
// 				Drive.listFiles(oAuth2Client)
// 				.then((files)=>{
// 					if (files.length) {
// 						res.send(files);
// 						res.end();
// 					} else {
// 						response.end("No Files Found");
// 					}
// 				})
// 				.catch((err)=>{
// 					console.log(err);
// 					res.redirect("/Authenticate");
// 					res.end(err);
// 				});
// 			})
// 			.catch((err)=>{
// 				res.end(err.msg);
// 			});
// 		})
// 		.catch((err)=>{
// 			res.end(err.msg);
// 		});
// 	})
// 	.catch((err)=>{
// 		res.end(err.msg);
// 	})
// })
// // incomplete
// app.get('/DownloadFile',function(req,res){
// 	Drive.readFile(CREDENTIALS_PATH)
// 	.then((credentials)=>{ //will call db.readTokens here
// 		readTokens()
// 		.then((token,refreshToken)=>{
// 			oAuth2Client = Drive.createAuthOject(credentials,token,refreshToken);
// 			Drive.downloadFile(oAuth2Client,req.query.fileId)
// 			.then((file)=>{
// 				res.send(file);
// 				res.end();
// 			})
// 			.catch((err)=>{
// 				res.end(err);
// 			});
// 		})
// 		.catch((err)=>{
// 			console.log(err);
// 			res.redirect("http://localhost:8000/Authenticate");
// 			res.end();
// 		});
// 	})
// 	.catch((err)=>{
// 		res.redirect(err);
// 	});
// })

// //Working if find a token from db 
// app.get('/UploadFile/:email',function(req,res){


// 	var email= req.params.email;
// 	Drive.readFile(CREDENTIALS_PATH)
// 	.then((credentials)=>{ //will call db.readTokens here
// 		userModule.readTokens(email)
// 		.then((token,refreshToken)=>{     
//             Drive.createAuthOject(credentials,token,refreshToken).then((result)=>{

//                 console.log("hello");
//                var oAuth2Client=result.client;
//                 Drive.uploadFile(oAuth2Client)
//                 .then((result)=>{
//                     res.status(200).json({message:"File Uploaded" + result});
//                 })
//                 .catch((err)=>{
//                     res.status(500).json(err);
//                 })
//             });
           
// 		})
// 		.catch((err)=>{
// 			console.log(err);
	
// 			res.end("sorry");
// 		});
// 	})
// 	.catch((err)=>{
// 		res.end(err);
// 	});
// })


