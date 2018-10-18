const {google} = require('googleapis');
const promise=require("promises");
const fs = require('fs');
const CircularJSON=require('circular-json');
var exports=module.exports={};

// If modifying these scopes, delete token.json.

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const REDIRECT_URI="https://mysterious-plains-65246.herokuapp.com/Code";



exports.readFile = function(filePath)
{
  return new Promise((success,failure)=>
  {
    fs.readFile(filePath, (err, content) => {
      if(err)
        return failure(err);
      success(content);
    });
  });
}

exports.writeFile=function(path,content)
{
  return new Promise((success,failure)=>
  {
    fs.writeFile(path, content, (err) => {
      if (err) failure(err);
      success();
    });
  });
}

exports.authorizeUser = function(oAuth2Client){
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });   
  return authUrl;
}


exports.createAuth=function(credentials)
{
  const {client_secret, client_id} = JSON.parse(credentials).web;
	return oAuth2Client = new google.auth.OAuth2(
	  client_id, client_secret, REDIRECT_URI);
}

exports.createAuthOject = function(credentials,token)
{
  return new Promise((success,failure)=>{
    var refreshToken= token.refresh_token;
    const {client_secret, client_id} = JSON.parse(credentials).web;
    const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, REDIRECT_URI);
    oAuth2Client.setCredentials(token);
    refreshToken=token.refresh_token;
    var returnObj={};
    if(refreshToken)
    {
      exports.refreshToken(oAuth2Client,refreshToken)
      .then((newToken)=>{
        oAuth2Client.setCredentials(newToken);
        returnObj.client=oAuth2Client;
        returnObj.token=newToken;
        success(returnObj);
      })
      .catch((err)=>{
        returnObj.client=oAuth2Client;
        returnObj.token=token;
        success(returnObj)
      });
    }
    else{
      returnObj.client=oAuth2Client;
      returnObj.token=token;
      success(returnObj)
    }
  });
}



exports.getTokenFromCode = function(code,oAuth2Client){
  return new Promise((success,failure)=>
  {
    oAuth2Client.getToken(code, (err, token) => {
      if (err){
        return failure("Server Error invalid Code");
      }
      success(token);
    });
  });
}



/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.listFiles = function(auth) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
     
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
    }, (err, res) => {
      if (err) 
        return failure("Error in list files");
      success(res.data.files);
    });
  });
}

exports.downloadFile = function(auth,fileId){
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
      fileId:fileId,
      alt:'media'
    },
    (err,res)=>{
      if(err)
        return failure("Unable to download file");
      return success(res.data);
    });
    
  });
}

exports.uploadFile = function(auth){
  return new Promise((resolve,reject)=>{
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': 'p.jpg'
    };
    var media = {
      mimeType: 'image/jpg',
      body: fs.createReadStream('./files/p.jpg')
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        reject(err)
        console.error(err);
      } else {
        resolve(file);
        console.log('File Id: ', file.name);
      }
    });
  });
}

exports.refreshToken=function(oAuth2Client,refreshToken){

  return new Promise((success,failure)=>{
      oAuth2Client.setCredentials({
        refresh_token: refreshToken
      });
      oAuth2Client.refreshAccessToken(function(err, newToken){
        if(err)
          return failure(err);
        success(newToken);
      });
  });
}
