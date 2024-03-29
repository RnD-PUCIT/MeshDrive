const FileTagsModel = require('../Models/FileTagsModel');
const mongoose = require('mongoose');
const url = "mongodb://localhost/mydb";
var dateFormat = require('dateformat');
mongoose.Promise=global.Promise;
var exports=module.exports={};

mongoose.connect(url,{ useNewUrlParser: true });

exports.addTagsToFile =function(email,file)
{
	return new Promise((success,failure)=>{
        var criteria = {"user_email":email,"filesList.driveEmail":file.driveEmail, "filesList.driveType":file.driveType,"filesList.fileId":file.fileId};
        let modified = dateFormat(new Date(),"yyyy-mm-dd h:MM:ss");
        var updation = {"filesList.$.tagsIdList":file.tagsIdList,"filesList.$.LastModifiedOn":modified};
        FileTagsModel.updateOne(criteria,{$set:updation})
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}


exports.getTags=function(email,file)
{
    //console.log(email,file);
	return new Promise((success,failure)=>{
        
        var fileId;
        if(typeof file.fileId !== 'undefined')
            fileId=file.fileId;
        else
            fileId=file.id;
        var criteria = {"user_email":email,"filesList.driveEmail":file.driveEmail,"filesList.fileId":fileId};
        FileTagsModel.findOne(criteria)
        .then((res)=>{
            if(res==null)
                success([]);
            const  {filesList} = res;
            filesList.forEach(element => {
                if(element.fileId==fileId)
                     success(element.tagsIdList);
            });  
        })
        .catch((err)=>{
          failure({"error":err});
        });	
	});
}


exports.createFile =function(email,file)
{
	return new Promise((success,failure)=>{

        file.CreatedOn = dateFormat(new Date(),"yyyy-mm-dd h:MM:ss");
        file.LastModifiedOn= dateFormat(new Date(),"yyyy-mm-dd h:MM:ss");
        var criteria = {"user_email":email};
        var updation = {"filesList":file};
        FileTagsModel.updateOne(criteria,{$push:updation})
        .then((res)=>{
            console.log(res);
            success(res);
        })
        .catch((err)=>{
            console.log(err);
            failure(err.message);
        });	
	});
}

exports.checkFile =function(meshDriveEmail,fileId,driveEmail)
{
	return new Promise((success,failure)=>{
        var criteria = {"user_email":meshDriveEmail,"filesList.driveEmail":driveEmail,"filesList.fileId":fileId};
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
        var criteria = {"user_email":meshDriveEmail};
        FileTagsModel.findOne(criteria)
        .then((res)=>{
            success(res);
        })
        .catch((err)=>{
            failure(err.message);
        });	
	});
}