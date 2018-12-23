const FileTagsModel = require('../Models/FileTagsModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";
mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });

exports.addTagsToFile =function(email,file)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email,"filesList.driveEmail":file.driveEmail, "filesList.driveType":file.driveType,"filesList.fileId":file.fileId};
        var updation = {"filesList.$.tagsIdList":file.tagsIdList}
        FileTagsModel.updateOne(criteria,{$set:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}


exports.getTags =function(email,file)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email,"filesList.driveEmail":file.driveEmail,"filesList.fileId":file.fileId};
        FileTagsModel.findOne(criteria)
        .then((res)=>{
            success(res.filesList.tagsIdList);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}


exports.createFile =function(email,file)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":email};
        var updation = {"filesList":file}
        FileTagsModel.updateOne(criteria,{$push:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.checkFile =function(meshDriveEmail,fileId,driveEmail)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":meshDriveEmail,"filesList.driveEmail":driveEmail,"filesList.fileId":fileId};
        FileTagsModel.findOne(criteria)
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}

exports.checkUserFileModel =function(meshDriveEmail)
{
	return new Promise((success,failure)=>{
        var criteria = {"email":meshDriveEmail};
        FileTagsModel.findOne(criteria)
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}