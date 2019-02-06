const express = require('express');
const router = express.Router();
require('isomorphic-fetch'); 
const Dropbox = require('dropbox').Dropbox;
const url = require('url');
const fs = require('fs');
const queryString  = require('query-string');
const AppConstants= require('../Extras/Globals');
const axios = require('axios');
const DropboxCredentials = require('../Dropbox/DropboxCredentials');
const dbxDAL= require('./DropboxDAL');
const Formatter =require('../Formatters/MetaDataFormat'); 
const DropboxTags = require('../Dropbox/DropboxTags');
const dropboxV2Api = require('dropbox-v2-api');
var dbx = new Dropbox();


const DROPBOX_AUTH_REDIRECT_ROUTE='/Code';  //Change if u change it in dropbpx console app 
const DROPBOX_AUTH_REDIRECT_URL=AppConstants.DEPLOYED_URL+'/Dropbox'+DROPBOX_AUTH_REDIRECT_ROUTE;


// dbx.setAccessToken(DropboxCredentials.DROPBOX_APP_SAMPLE_ACCESS_TOKEN); //for testing
router.get('/UserAccount/:token',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{
    var obj = new Object();
  
    var dropboxAccount=req.dropboxAccount;
    var token=dropboxAccount.token;
    dbx.setAccessToken(token["access_token"]);
    dbx.usersGetCurrentAccount()
    .then(function(response) {
     console.log(response);
     obj={
       data:response,
       success:true
     }
     res.status(AppConstants.RESPONSE_SUCCESS).json(obj);
     })
    .catch(function(error) {
      obj["error"]=error[DropboxTags.TAG_ERROR];
      obj["messgae"]=error[DropboxTags.TAG_ERROR][DropboxTags.TAG_ERROR_MSG];
     res.status(AppConstants.RESPONSE_FAIL).json(obj);
    });
})

//not used

//integrated
router.post('/UploadFile/:token/:path/:name/:email',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{
  
  var result = new Object();
  var name = req.params.name;
  var path = req.params.path;
  console.log(path);
  var dropboxAccount=req.dropboxAccount;
  var token = dropboxAccount.token;
    const dropbox = dropboxV2Api.authenticate({
      token: token["access_token"]
    });
  var arg;
    if(path==="root") {
        arg = {path:"/"+name} 
     
    }else{
      arg ={path:path+'/'+name }//replace it with path(id) of the folder
    }
    console.log(arg);
    const dropboxUploadStream = dropbox({
      resource: 'files/upload',
      parameters: arg 
      
  }, (err, resul, response) => {
    
   
      if(err)      {
        result={
            success:false,
            error:err
        }
        res.status(AppConstants.RESPONSE_FAIL).json(result);
      }
      else{  //upload completed 
        result={
          success:true,
          message:"Upload Completed"
        }
        res.status(AppConstants.RESPONSE_SUCCESS).json(result);
      }
     
  });
  req.pipe(dropboxUploadStream);//replace this with stream coming in request
  
})


//integrated
router.post('/DownloadFile',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{

  var result = new Object();
  var filePath = req.body.path;
  var fileName= req.body.fileName;
  var dropboxAccount=req.dropboxAccount;
  var token = dropboxAccount.token;

  res.setHeader("Access-Control-Expose-Headers","File-Name,Content-disposition");
	res.setHeader('Content-disposition', 'attachment; filename='+fileName);
	res.setHeader("File-Name",fileName);

    const dropbox = dropboxV2Api.authenticate({
      token: token["access_token"]
    });
    var arg = {path : filePath}
    var downloadStream = dropbox({
      resource: 'files/download',
      parameters: arg				
    });
    var stream = downloadStream.pipe(res);
    stream.on('finish',function(){
      res.end();
      console.log("File Downloaded");
    });
})

router.post('/DeleteFile',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{
  
  var obj = new Object();
  var dropboxAccount= req.dropboxAccount;
  var token = dropboxAccount.token;
  var path = req.body.path;
  const dropbox = dropboxV2Api.authenticate({
    token: token["access_token"]
  });
  var args ={
    path : path
  }
  dropbox({
    resource: 'files/delete',
    parameters: args
}, (err, result) => {
    //see docs for `result` parameters
    if(err){

        obj["error"]=err[DropboxTags.TAG_ERROR];
        obj["message"]=err[DropboxTags.TAG_ERROR_MSG]
        res.status(AppConstants.RESPONSE_FAIL).json(obj);
    }else{
      obj["success"]=true;
      obj["data"]=result["metadata"];
      res.status(AppConstants.RESPONSE_SUCCESS).json(obj);
    }
});



})

//in dev
router.post('/CreateFolder',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{
  
  var obj = new Object();
  var dropboxAccount= req.dropboxAccount;
  var token = dropboxAccount.token;
  var path = req.body.path;
  var folderName = req.body.name;

  const dropbox = dropboxV2Api.authenticate({
    token: token["access_token"]
  });
  var args ={
    path : path+"/"+folderName,
    autorename:true 
  }
  dropbox({
    resource: 'files/create_folder',
    parameters: args
}, (err, result) => {
    //see docs for `result` parameters
    if(err){

        obj["error"]=err;
     //   obj["message"]=err[DropboxTags.TAG_ERROR][DropboxTags.TAG_ERROR_MSG]
        res.status(AppConstants.RESPONSE_FAIL).json(obj);
    }else{
      obj["success"]=true;
      obj["data"]=result["metadata"];
      res.status(AppConstants.RESPONSE_SUCCESS).json(obj);
    }
});



})
//integrated
router.post('/ListFiles',AppConstants.checkAccessMiddleware,dropboxTokenMiddleware,(req,res)=>{

  console.log(req.body);
  var result= new Object();
  var dropboxAccount = req.dropboxAccount;//coming from middleware
  var token = dropboxAccount.token;
  console.log(req.dropboxAccount);
  var path = req.body.path;
  if(!path)
  {
    path = '';
  }
    dbx.setAccessToken(token["access_token"]);
    var arg = {path:path,include_media_info:true};
    dbx.filesListFolder(arg)//folder path here 
    .then(function(files) {
      //converting to a standard
      var data = new Array();
      var f = new Formatter();
      for(var i =0;i<files.entries.length;i++)
      {
          var obj =f.parseDropboxFile(files.entries[i]);
          data.push(obj);
      }
      var arr= new Array();   
      result["email"]=dropboxAccount.user.emailAddress;  
      result["drive"]="dropbox";
      result["count"]=files.entries.length;
      result["success"]=true;
      result["files"]=data;
      arr.push(result);
      res.status(AppConstants.RESPONSE_SUCCESS).json(arr);

    })
    .catch(function(error) {
      console.log(error);
      result["error"]=error[DropboxTags.TAG_ERROR];
      result["messgae"]=error[DropboxTags.TAG_ERROR][DropboxTags.TAG_ERROR_MSG];
     return res.status(AppConstants.RESPONSE_FAIL).json(result);
    });

   
})
//in dev
router.post('/GetFileMeta',AppConstants.checkAccessMiddleware,(req,res)=>{

  var obj = new Object();
  var userData= req.userData;  
  dbxDAL.getDropboxToken(userData.email)
  .then((token)=>{
    dbx.setAccessToken(token["access_token"])
    var filePath = req.body.path;
    console.log(filePath);
    var arg = {path:filePath,include_media_info:true};
    dbx.filesAlphaGetMetadata(arg)
    .then((fileMeta)=>{
      var formatter = new Formatter();
      fileMeta=formatter.parseDropboxFile(fileMeta);
      obj["data"]=fileMeta;
      obj["success"]=true;
      res.status(AppConstants.RESPONSE_SUCCESS).json(obj);
  
    })
    .catch((error)=>{
      obj["error"]=error[DropboxTags.TAG_ERROR];
      obj["messgae"]=error[DropboxTags.TAG_ERROR][DropboxTags.TAG_ERROR_MSG];
      res.status(AppConstants.RESPONSE_FAIL).json(obj);
    })
  })
  .catch((error)=>{
    obj["error"]=error;
    obj["message"]=error.message;
    res.status(AppConstants.RESPONSE_FAIL).json(obj);
  });
 


})

//complete with multiple dbx accounts
router.post('/Authenticate',AppConstants.checkAccessMiddleware,(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization, x-api-key")

  
  var stateObj  = new Object();
  stateObj={
    email:req.userData.email,
    redirectSuccess:req.body.redirectSuccess,
    redirectFailure:req.body.redirectFailure
  }
  console.log(queryString.stringify(stateObj));
      options ={
        protocol: 'https',
        hostname: 'dropbox.com',
        pathname: '/oauth2/authorize',
        method:'GET',
        query: {
          response_type:'code',
          redirect_uri:''+DROPBOX_AUTH_REDIRECT_URL,
          client_id:''+ DropboxCredentials.DROPBOX_APP_KEY,
          //storing redirection links also
          state:queryString.stringify(stateObj) //in this we have to store the email of user So that after redirection
          //we can get the email of user who actually applied for authentication
        }
      };
     res.status(AppConstants.RESPONSE_SUCCESS).json({"redirectLink":url.format(options)});

});

//complete with multiple dbx accounts
router.get(DROPBOX_AUTH_REDIRECT_ROUTE,(req,res)=>{
    
      var values = req.query;
      if(values.error)
      {
        //user denied the access 
        return res.status(AppConstants.RESPONSE_FAIL).json({error:values.error});      
      }
   
      var code = values.code;
      //contains email,redirectSuccess,redirectFailure
      var state= queryString.parse(values.state); //converting to json object
 
      var result = new Object();
      getTokenFromCode(code)
      .then((token)=>{
          console.log(token);//save this token in DB and then send +ve response if saved 
          dbx.setAccessToken(token["access_token"])
          //saving userAccount informaion too 
          
          dbx.usersGetCurrentAccount()
          .then((account)=>{
          
            var acc = new Object();
            acc["token"]=token;
            var a= {
              "photoLink":account[DropboxTags.TAG_PROFILE_PHOTO],
              "emailAddress":account[DropboxTags.TAG_EMAIL]
            }
            acc["user"]=a;
            dbxDAL.saveDropboxAccount(state.email,acc).then((r)=>{
              return res.redirect(state.redirectSuccess+'/'+state.email);
            }).catch((err)=>{
              return res.redirect(state.redirectFailure);
            });

          })
          .catch((err)=>{
                console.log(err);
                return res.redirect(state.redirectFailure);
          })
      })
      .catch((err)=>{
        //cant get token because of some bad request error    
        return res.redirect(state.redirectFailure);
   
      });

  
})

//complete
function getTokenFromCode(code)
{
    var bodyParams= {
      code:code,
      grant_type:'authorization_code',
      redirect_uri:''+DROPBOX_AUTH_REDIRECT_URL,
      client_id:''+ DropboxCredentials.DROPBOX_APP_KEY,
      client_secret:DropboxCredentials.DROPBOX_APP_SECRET
    };
    var config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'json'
    };
    return new Promise((success,failure)=>{
        axios.post('https://api.dropboxapi.com/oauth2/token',queryString.stringify(bodyParams),config)
        .then((response)=>{
          if(response.status==200)
          {
            success(response.data);
            // res.status(200).json(response.data);
          }else {
            failure({error:response.error});
            // res.status(400).json({error:response.error})
          }

        }).catch((err)=>{
          console.log("in the error");
          failure({error:err.message});
          // res.status(400).json({error:err.message});
        })
  });

}

function dropboxTokenMiddleware(req,res,next)
{
  console.log(req.body);
  var userData = req.userData;
  dbxDAL.getDropboxAccounts(userData.email)
  .then((accounts)=>{

    for(var i =0;i<accounts.length;i++)
    {
      if(accounts[i]["user"]["emailAddress"]===req.body.dropboxAccountEmail)
      {
        req.dropboxAccount=accounts[i];
        next(); 
        return;
      }
    }

    return res.status(AppConstants.RESPONSE_EMPTY).json({error:"No Account Found against email : "+req.body.dropboxAccountEmail});
      //  req.dropboxAccount=account;
      // next();
  }).catch((err)=>{
    return res.status(AppConstants.RESPONSE_FAIL).json({error:err});
  
  })
}



module.exports = router;