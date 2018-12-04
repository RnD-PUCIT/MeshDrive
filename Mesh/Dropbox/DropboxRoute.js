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
const DROPBOX_AUTH_REDIRECT_URL=AppConstants.URL+'/Dropbox'+DROPBOX_AUTH_REDIRECT_ROUTE;


// dbx.setAccessToken(DropboxCredentials.DROPBOX_APP_SAMPLE_ACCESS_TOKEN); //for testing

//testng
router.get('/user',(req,res)=>{

    dbx.usersGetCurrentAccount()
    .then(function(response) {
     console.log(response);
     res.status(200).json(response);
     })
    .catch(function(error) {
     console.error(error);
     res.status(400).json(error);
    });
})
//testing
router.get('/files/:token',AppConstants.checkAccessMiddleware,(req,res)=>{

  var userData= req.userData;
  dbxDAL.getDropboxToken(userData.email)
  .then((token)=>{
    dbx.setAccessToken(token["access_token"]);

    dbx.filesListFolder({path: '/voices'})//folder path here 
    .then(function(files) {
      console.log(files);
      res.status(AppConstants.RESPONSE_SUCCESS).json(files);
  
    })
    .catch(function(error) {
      console.log(error);
     return res.status(AppConstants.RESPONSE_FAIL).json(error);
    });
   
  })
  .catch((err)=>{
    return  res.status(AppConstants.RESPONSE_FAIL).json({error:err.message})
  });

   
})
// /Dropbox/Authenticate
router.get('/Authenticate/:token',AppConstants.checkAccessMiddleware,(req,res)=>{
  console.log(req.userData)
      options ={
        protocol: 'https',
        hostname: 'dropbox.com',
        pathname: '/oauth2/authorize',
        method:'GET',
        query: {
          response_type:'code',
          redirect_uri:''+DROPBOX_AUTH_REDIRECT_URL,
          client_id:''+ DropboxCredentials.DROPBOX_APP_KEY,
          state:req.userData.email //in this we have to store the email of user So that after redirection
          //we can get the email of user who actually applied for authentication
        }
      };
      
     res.redirect(url.format(options));

});
// /code
router.get(DROPBOX_AUTH_REDIRECT_ROUTE,(req,res)=>{
      
      var values = req.query;
      if(values.error)
      {
        //user denied the access 
        return res.status(AppConstants.RESPONSE_FAIL).json({error:values.error});      
      }
      var code = values.code;
      var state= values.state;
      console.log('State of the user : '+state);
      var result = new Object();
      getTokenFromCode(code)
      .then((token)=>{
          console.log(token);//save this token in DB and then send +ve response if saved 
        
          dbxDAL.saveDropboxToken(state,token)
          .then((status)=>{

              result={
                success:true,
                message:"User Token saved"
              }
            return res.status(AppConstants.RESPONSE_SUCCESS).json(result);
          })
          .catch((err)=>{
            return res.status(AppConstants.RESPONSE_FAIL).json({error:"cant save"});
          });    
      })
      .catch((err)=>{
        //cant get token because of some bad request error 
        console.log(err);
        return res.status(AppConstants.RESPONSE_FAIL).json(err);
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