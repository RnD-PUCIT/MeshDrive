const oneDrive = require('onedrive-api');
const request=require('request');
const moment=require('moment');
const tagsDAL = require('../FileTags/FileTagsDAL');
var exports=module.exports={};

const SCOPES = ['user.read%20files.readwrite%20offline_access'];
const CLIENT_SECRET="mfqkjUT1046!#zfCGJKO0-}";
const REDIRECT_URI="https://test-depositoryworks.ngrok.io/onedrive/code";
const AUTH_BASE_URL="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
const TOKEN_BASE_URL="https://login.microsoftonline.com/common/oauth2/v2.0/token";
const USER_INFO_BASE_URL="https://graph.microsoft.com/v1.0/me"

exports.listFilesById = function(token,fileId,email,meshEmail) {
  return new Promise((success,failure)=>
  {
    oneDrive.items.listChildren({
      accessToken: token.access_token,
      itemId: fileId
    }).then(async (childrens) => {
      var files=[];
      for (let index = 0; index < childrens.value.length; index++) {
        const file = childrens.value[index];
        files.push(await getMeshDriveFileObjectFromOneDrive(file,email,meshEmail));
      }
      success(files);
    }).catch((err)=>{
      failure(err.error);
    });
  });
}

exports.listFilesRoot = function(token,email,meshEmail) {
  return new Promise((success,failure)=>
  {
    oneDrive.items.listChildren({
      accessToken: token.access_token
    }).then(async (childrens) => {
      var files=[];
      for (let index = 0; index < childrens.value.length; index++) {
        const file = childrens.value[index];
        files.push(await getMeshDriveFileObjectFromOneDrive(file,email,meshEmail));
      }
      success(files);
    }).catch((err)=>{
      failure(err.error);
    });
  });
}


exports.downloadFile = function(token,fileId,res){
  return new Promise((success,failure)=>{
    oneDrive.items.download({
      accessToken: token.access_token,
      itemId: fileId
    })
    .on('error', function(err) {
      failure(err);
    })
    .on('end', ()=>{
      success();
    })
    .pipe(res);
  });
}

exports.uploadFile = function(token,fileName,file){
  
  return new Promise((success,failure)=>{
    oneDrive.items.uploadSimple({
      accessToken: token.access_token,
      filename: fileName,
      readableStream: file
    }).then((item) => {
      var file=getMeshDriveFileObjectFromOneDrive(item);
      success(file);
    })
    .catch((error)=>{
        failure(error);
    });
  });
}

exports.createFolder = function(token,folderName,parentId){
  
  return new Promise((success,failure)=>{
    oneDrive.items.createFolder({
      accessToken: token.access_token,
      name: folderName,
      rootItemId:parentId
    }).then((item) => {
        var folder=getMeshDriveFileObjectFromOneDrive(item);
        success(folder);
    })
    .catch((error)=>{
        failure(error);
    });
  });
}

exports.deleteFile = function(token,fileId){
  
  return new Promise((success,failure)=>{
    oneDrive.items.delete({
      accessToken: token.access_token,
      itemId:fileId
    }).then(() => {
        success();
    })
    .catch((error)=>{
        failure(error);
    });
  });
}

exports.renameFile = function(token,fileId,newFileName){
  
  return new Promise((success,failure)=>{
    oneDrive.items.update({
      accessToken: token.access_token,
      itemId:fileId,
      toUpdate: {
        name : newFileName
      }
    }).then((item) => {
      console.log(file);
      var folder=getMeshDriveFileObjectFromOneDrive(item);
      success(folder);
    })
    .catch((error)=>{
        failure(error);
    });
  });
}

exports.moveFile = function(token,fileId,newParentId){
  
  return new Promise((success,failure)=>{
    oneDrive.items.update({
      accessToken: token.access_token,
      itemId:fileId,
      toUpdate: {
        parentReference : {id:newParentId}
      }
    }).then((item) => {
      var folder=getMeshDriveFileObjectFromOneDrive(item);
      success(folder);
    })
    .catch((error)=>{
        failure(error);
    });
  });
}

exports.getFileDetails = function(token,fileId){
  return new Promise((success,failure)=>{
    oneDrive.items.getMetadata({
      accessToken: token.access_token,
      itemId: fileId
    }).then((file) => {
      return success(file);
    }).catch((err)=>{
      return failure(err.error);
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
    if(checkTokenExpiration(token))
    {
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
         {
           return failure(error);
         }
           
          else
          {
            token=JSON.parse(body);
            token.updated=true;
            return success(token);
          }
            
      });
    }
    else
    {
      token.updated=false;
      return success(token);
    }
  });
}


function checkTokenExpiration(token)
{
  var start=moment(token.LastModifiedOn,'YYYY-MM-DD HH:mm:ss');
	var end=moment(moment.now());
  if(end.diff(start,'seconds')>=token.expires_in)
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



async function getMeshDriveFileObjectFromOneDrive(file,email,meshEmail)
{
  var meshDriveFileObject={};
  meshDriveFileObject.driveEmail=email;
  meshDriveFileObject.drive="onedrive";
  meshDriveFileObject.id=file.id;
  meshDriveFileObject.name=file.name;
  meshDriveFileObject.createdTime=file.createdDateTime;
  meshDriveFileObject.parents=[file.parentReference.id];
  meshDriveFileObject.size=file.size;
  if(file.folder)
    meshDriveFileObject.mimeType="folder";
  if(file.file)
    meshDriveFileObject.mimeType=file.file.mimeType;
  meshDriveFileObject.fileTags= await tagsDAL.getTags(meshEmail,file);
  return meshDriveFileObject;
}


//Obsolete
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