const oneDrive = require('onedrive-api');
const fs = require('fs');
const request=require('request');
const moment=require('moment');
var exports=module.exports={};


const SCOPES = ['user.read%20files.readwrite%20offline_access'];
const CLIENT_SECRET="mfqkjUT1046!#zfCGJKO0-}";
const REDIRECT_URI="https://test-depositoryworks.ngrok.io/onedrive/code";
const AUTH_BASE_URL="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
const TOKEN_BASE_URL="https://login.microsoftonline.com/common/oauth2/v2.0/token";
const USER_INFO_BASE_URL="https://graph.microsoft.com/v1.0/me"

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

exports.getOneDriveAuthRedirectLink = function(clientId,userData){
  var redirectUri=AUTH_BASE_URL+"client_id="+clientId+
                  "&response_type=code&redirect_uri="+
                  REDIRECT_URI+"&response_mode=query&scope="+
                  SCOPES+"&state="+userData;
  return redirectUri;
}


exports.createAuth=function(credentials)
{
  const {client_secret, client_id} = JSON.parse(credentials).web;
	return oAuth2Client = new oneDrive.auth.OAuth2(
	client_id, client_secret, REDIRECT_URI);
}

exports.refreshToken = function(clientID,token)
{
  return new Promise((success,failure)=>{
    request({
      url:TOKEN_BASE_URL,
      method:"POST",
      headers:{
        "content-type":"application/x-www-form-urlencoded"
      },
      body:"client_id="+clientID+"&scope="+SCOPES+
      "&refresh_token="+token.refresh_token+"&redirect_uri="+
        REDIRECT_URI+"&grant_type=refresh_token"+"&client_secret="+CLIENT_SECRET
    },(error,response,body)=>{
       if(error)
          failure(error);
        else
        {
          success(body);
        }
          
    });
    // var refreshToken= token.refresh_token;
    // const oAuth2Client = exports.createAuth(credentials);
    // oAuth2Client.setCredentials(token);
    // if(refreshToken)
    // {
    //   exports.refreshToken(oAuth2Client,refreshToken)
    //   .then((newToken)=>{
    //     oAuth2Client.setCredentials(newToken);
    //     success(oAuth2Client);
    //   })
    //   .catch((err)=>{
    //     success(oAuth2Client);
    //   });
    // }
    // else{
    //   success(oAuth2Client);
    // }
  });
}

exports.checkTokenExpiration= function(token)
{
  var start=moment(token.LastModifiedOn,'YYYY-MM-DD HH:mm:ss');
	var end=moment(moment.now());
  if(end.diff(start,'seconds')>=3600)
    return true;
  else
    return false;

}

exports.getTokenFromCode = function(code,clientID){
  return new Promise((success,failure)=>
  {
    request({
      url:TOKEN_BASE_URL,
      method:"POST",
      headers:{
        "content-type":"application/x-www-form-urlencoded"
      },
      body:"client_id="+clientID+"&scope="+SCOPES+"&code="+code+"&redirect_uri="+
        REDIRECT_URI+"&grant_type=authorization_code"+"&client_secret="+CLIENT_SECRET
    },(error,response,body)=>{
        if(error)
          failure(error);
        else
          success(body);
    });
  });
}




exports.listFiles = function(token) {
  return new Promise((success,failure)=>
  {
    oneDrive.items.listChildren({
      accessToken: token.access_token
    }).then((childrens) => {
      success(childrens.value);
    }).catch((err)=>{
      failure(err.error);
    });
  });
}



exports.listFilesById = function(auth,fileId) {
  return new Promise((success,failure)=>
  {
    const drive = oneDrive.drive({version: 'v3', auth});
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

exports.listFilesRoot = function(auth,email) {
  return new Promise((success,failure)=>
  {
    fileId="root";
    const drive = oneDrive.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 1000, //List max 1000 files
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
        q: `'${fileId}' in parents` //Search query to find files whoose parent is fileId, in this case filesId is root
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
    const drive = oneDrive.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 1000,
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)',
        q: `'${fileId}' in parents` //Search query to find files whoose parent is fileId
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
    const drive = oneDrive.drive({version: 'v3', auth});
    drive.files.get({
      fileId:fileId,
      alt:'media' //gets file data
    },{
      responseType:'stream' //important
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
    const drive = oneDrive.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': fileName
    };
    var media = {
      mimeType: mimeType,
      body: file //file is the req object is self
    };
    
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    },
     function (err, file) {
      if (err) {
        failure(err);
      } else {
        success(file.data.id);
      }
    });
  });
}

exports.getFileDetails = function(auth,fileId){
  return new Promise((success,failure)=>{
    const drive = oneDrive.drive({version: 'v3', auth});
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

exports.getUserDetails = function(token){
  return new Promise((success,failure)=>{
    request({
      url:USER_INFO_BASE_URL,
      method:"GET",
      headers:{
        "content-type":"application/json",
        "Authorization":token.access_token
      }
    },(error,response,body)=>{
        if(error)
          failure(error);
        else
          success(JSON.parse(body));
    })
  });
}
