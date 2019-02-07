const {google} = require('googleapis');
const tagsDAL = require('../FileTags/FileTagsDAL');

var exports=module.exports={};

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const REDIRECT_URI="https://test-depositoryworks.ngrok.io/googledrive/code";

exports.listFilesById = function(auth,fileId,email,meshEmail) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, size, description, createdTime)',
        q: `'${fileId}' in parents`
      },async (err, res) => {
        if (err) {
          return failure("Error in list files");
        }
        for (let i = 0; i < res.data.files.length; i++) {
          if(res.data.files[i].mimeType=="application/vnd.google-apps.folder")
            res.data.files[i].mimeType="folder";
          res.data.files[i].driveEmail=email;
          res.data.files[i].drive="googledrive";
          res.data.files[i].fileTags= await tagsDAL.getTags(meshEmail,res.data.files[i]);
        }
        success(res.data.files);
      });
  });
}

exports.listFilesRoot = function(auth,email,meshEmail) {
  return new Promise((success,failure)=>
  {
    fileId="root";
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 1000, //List max 1000 files
        includeRemoved: false,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, parents, size, description, createdTime)',
        q: `'${fileId}' in parents` //Search query to find files whoose parent is fileId, in this case filesId is root
      },async (err, res) => {
        if (err) {
          return failure("Error in list files");
        }
        for (let i = 0; i < res.data.files.length; i++) {

          if(res.data.files[i].mimeType=="application/vnd.google-apps.folder")
            res.data.files[i].mimeType= "folder";
          res.data.files[i].driveEmail= email;
          res.data.files[i].drive= "googledrive";
          res.data.files[i].fileTags= await tagsDAL.getTags(meshEmail,res.data.files[i]);
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

exports.uploadFile = function(auth,fileName,file,mimeType,parentId){
  
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': fileName
      //parents:parentId
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

exports.createFolder = function(auth,folderName,parentId){
  
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      name: folderName,
      mimeType:'application/vnd.google-apps.folder',
      parents:parentId
    };
    drive.files.create({
      resource: fileMetadata,
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


exports.deleteFile = function(auth,fileId){
  
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});    
    drive.files.delete({
      fileId:fileId,
    },
     function (err) {
      if (err) {
        failure(err);
      } else {
        success();
      }
    });
  });
}

exports.moveFile = function(auth,fileId,newParentId,oldParentId){
  
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    drive.files.update({
      fileId: fileId,
      addParents: newParentId,
      removeParents: oldParentId,
      fields: 'id, name, mimeType, parents, description, createdTime'
    }, function (err, file) {
      if (err) {
        failure(err.errors)
      } else {
        success(file.data);
      }
    });
  });
}

exports.renameFile = function(auth,fileId,newFileName){
  
  return new Promise((success,failure)=>{
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      name: newFileName,
    };
    drive.files.update({
      fileId: fileId,
      resource: fileMetadata,
      fields: 'id, name, mimeType, parents, description, createdTime'
    }, function (err, file) {
      if (err) {
        failure(err.errors)
      } else {
        success(file.data);
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

exports.getGoogleDriveAuthRedirectLink = function(oAuth2Client,email){
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
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
      success(oAuth2Client);
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


//Obsolete
exports.listFiles = function(auth) {
  return new Promise((success,failure)=>
  {
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name, mimeType, parents, description, createdTime)'
      }, (err, res) => {
        if (err) {
          return failure("Error in list files");
        }
        success(res.data.files);
      });
  });
}