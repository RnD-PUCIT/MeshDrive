const express = require('express');
const router = express.Router();
require('isomorphic-fetch'); 
const Dropbox = require('dropbox').Dropbox;
const url = require('url');
const queryString  = require('query-string');
const AppConstants= require('../Extras/Globals');
const axios = require('axios');
const DropboxCredentials = require('../Dropbox/DropboxCredentials');
const dbxDAL= require('./DropboxDAL');
var dbx = new Dropbox();


const DROPBOX_AUTH_REDIRECT_ROUTE='/Code';  //Change if u change it in dropbpx console app 
const DROPBOX_AUTH_REDIRECT_URL=AppConstants.DEPLOYED_URL+'/Dropbox'+DROPBOX_AUTH_REDIRECT_ROUTE;


// dbx.setAccessToken(DropboxCredentials.DROPBOX_APP_SAMPLE_ACCESS_TOKEN); //for testing

router.get('/user/:token',AppConstants.checkAccessMiddleware,(req,res)=>{

  var userData= req.userData;
  dbxDAL.getDropboxToken(userData.email)
  .then((token)=>{
    dbx.setAccessToken(token["access_token"]);
    dbx.usersGetCurrentAccount()
    .then(function(response) {
     console.log(response);
     var obj = new Object();
     obj={
       data:response,
       success:true
     }
     res.status(AppConstants.RESPONSE_SUCCESS).json(obj);
     })
    .catch(function(error) {
     console.error(error);
     res.status(AppConstants.RESPONSE_FAIL).json(error);
    });
  }).catch((err)=>{


  });
})

router.get('/RootFiles/:token',AppConstants.checkAccessMiddleware,(req,res)=>{

  var result= new Object();
  var userData= req.userData;
  dbxDAL.getDropboxToken(userData.email)
  .then((token)=>{
    dbx.setAccessToken(token["access_token"]);

    dbx.filesListFolder({path: ''})//folder path here 
    .then(function(files) {
      console.log(files);
      result["success"]=true;
      result["data"]=files;
      res.status(AppConstants.RESPONSE_SUCCESS).json(result);
  
    })
    .catch(function(error) {
      console.log(error);
      result["error"]=error.message;
     return res.status(AppConstants.RESPONSE_FAIL).json(result);
    });
   
  })
  .catch((err)=>{
    return  res.status(AppConstants.RESPONSE_FAIL).json({error:err.message})
  });

   
})
router.get('/getFileMeta',(req,res)=>{
  var obj = new Object();
  dbx.setAccessToken(DropboxCredentials.DROPBOX_APP_SAMPLE_ACCESS_TOKEN);
  var filePath = req.query.path;
  console.log(filePath);
  var arg = {path:filePath,include_media_info:true};
  dbx.filesAlphaGetMetadata(arg)
  .then((file)=>{
    obj["data"]=file;
    obj["success"]=true;
    res.status(AppConstants.RESPONSE_SUCCESS).json(obj);

  })
  .catch((err)=>{
    res.status(AppConstants.RESPONSE_FAIL).json(err);
    
  })


})

// /Dropbox/Authenticate
// router.get('/Authenticate/:token',AppConstants.checkAccessMiddleware,(req,res)=>{
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT,OPTIONS")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization, x-api-key")

//   console.log(req.userData)
//       options ={
//         protocol: 'https',
//         hostname: 'dropbox.com',
//         pathname: '/oauth2/authorize',
//         method:'GET',
//         headers:{

//         },
        
//         query: {
//           response_type:'code',
//           redirect_uri:''+DROPBOX_AUTH_REDIRECT_URL,
//           client_id:''+ DropboxCredentials.DROPBOX_APP_KEY,
//           state:req.userData.email //in this we have to store the email of user So that after redirection
//           //we can get the email of user who actually applied for authentication
//         }
//       };
      
//      res.redirect(url.format(options));

// });

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

// /code
router.get(DROPBOX_AUTH_REDIRECT_ROUTE,(req,res)=>{
    
      var values = req.query;
      if(values.error)
      {
        //user denied the access 
        return res.status(AppConstants.RESPONSE_FAIL).json({error:values.error});      
      }
      console.log(values);
      var code = values.code;
      //contains email,redirectSuccess,redirectFailure
      var state= queryString.parse(values.state); //converting to json object
      console.log(state);
      var result = new Object();
      getTokenFromCode(code)
      .then((token)=>{
          console.log(token);//save this token in DB and then send +ve response if saved 
          dbxDAL.saveDropboxToken(state.email,token)
          .then((status)=>{

              result={
                success:true,
                message:"User Token saved"
              }
              return res.redirect(state.redirectSuccess+'/'+state.email); //redirecting to success link on UI 
            // return res.status(AppConstants.RESPONSE_SUCCESS).json(result);
          })
          .catch((err)=>{
            return res.redirect(state.redirectFailure);
         //   return res.status(AppConstants.RESPONSE_FAIL).json({error:"cant save"});
          });    
      })
      .catch((err)=>{
        //cant get token because of some bad request error 
        console.log(err);
        return res.redirect(state.redirectFailure);
    //    return res.status(AppConstants.RESPONSE_FAIL).json(err);
      });

  
})

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

module.exports = router;