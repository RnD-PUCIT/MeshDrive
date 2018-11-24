const {google} = require('googleapis');
const promise=require("promises");
const fs = require('fs');
const CircularJSON=require('circular-json');
var exports=module.exports={};

// If modifying these scopes, delete token.json.

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const REDIRECT_URI="http://test-depositoryworks.ngrok.io/googledrive/code";



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

exports.getGoogleDriveAuthRedirectLink = function(oAuth2Client,email){
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state:email
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
    const oAuth2Client = exports.createAuth(credentials);
    oAuth2Client.setCredentials(token);
    if(refreshToken)
    {
      exports.refreshToken(oAuth2Client,refreshToken)
      .then((newToken)=>{
        oAuth2Client.setCredentials(newToken);
        success(oAuth2Client);
      })
      .catch((err)=>{
        success(oAuth2Client);
      });
    }
    else{
      success(oAuth2Client); //JSON Stringify required here
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




exports.listFiles = function(auth) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)'
      }, (err, res) => {
        if (err) {
          console.log(err);
          return failure("Error in list files");
        }
        success(res.data.files);
      });
  });
}



exports.listFilesById = function(auth,fileId) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
        q: `'${fileId}' in parents`
      }, (err, res) => {
        if (err) {
          console.log(err);
          return failure("Error in list files");
        }
        success(res.data.files);
      });
  });
}

exports.listFilesRoot = function(auth,email) {
  return new Promise((success,failure)=>
  {
    fileId="root";
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
        q: `'${fileId}' in parents`
      }, (err, res) => {
        if (err) {
          return failure("Error in list files");
        }
        var returnObj={};
        returnObj.email=email;
        returnObj.drive="googledrive";
        returnObj.files=res.data.files;
        success(returnObj);
      });
  });
}

exports.listFilesById = function(auth,fileId) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
        q: `'${fileId}' in parents`
      }, (err, res) => {
        if (err) {
          return failure("Error in list files");
        }
        success(res.data.files);
      });
  });
}

exports.downloadFile = function(auth,fileId,res){
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
      fileId:fileId,
      alt:'media'
    },{
      responseType:'stream'
    },(err,response)=>{
      if(err)
        return failure(err);
      response.data.on('error', err => {
        if(err)
          failure(err);
      }).on('end', ()=>{
          success();
      })
      .pipe(res);
    });
    // .on('end', function () {
    //   success("Done");
    // })
    // .on('error', function (err) {
    //   return failure("Unable to download file");
    // })
    // .pipe(response);
    // ,
    // (err,res)=>{
    //   if(err)
    //     return failure("Unable to download file");
    //   return success(res.data);
    // });
    
  });
}

exports.uploadFile = function(auth,fileName,file,mimeType){
  
  return new Promise((success,failure)=>{
    console.log(file.toString('utf8'));
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': fileName
    };
    var media = {
      mimeType: mimeType,
      body: file
    };
    
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    },
     function (err, file) {
      if (err) {
        console.log("err"+err);
      } else {
        console.log(file.id);
        success(file.id);
      }
    });
  });
}

exports.getFileDetails = function(auth,fileId){
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
      fileId:fileId,
    },
    (err,res)=>{
      if(err)
        return failure("Unable to get file details");
      return success(res.data);
    });
    
  });
}
exports.getUserDetails = function(auth){
  return new Promise((success,failure)=>{
    const drive = google.drive({
      auth,version: 'v3'
    });
    drive.about.get({fields:"user"},(err,res)=>{
      if(err){
        return failure(err.errors);
      }
      success(res.data);
      
    })
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
