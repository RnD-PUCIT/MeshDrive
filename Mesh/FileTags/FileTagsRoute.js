const express = require('express');
const router = express.Router();
const FileTagsDAL = require('./FileTagsDAL');
const Constants = require('../Extras/Globals');
var dateFormat = require('dateformat');

router.post('/AddTags',Constants.checkAccessMiddleware,function(req,res){
  
    var meshEmail=req.userData.email;
    var file={};
    file.driveEmail=req.body.driveEmail;
    file.driveType=req.body.driveType;
    file.fileId=req.body.fileId;
    file.tagsIdList=req.body.tagsIdList;
    FileTagsDAL.checkFile(meshEmail,file.fileId,file.driveEmail)
    .then((check)=>{
        var result = {};
        if(check==null)
        {
           
            FileTagsDAL.createFile(meshEmail,file)
            .then((result2)=>{
                result.success=true;
                result.message= "Tags added succesfully";
                res.status(Constants.CODE_OK).json(result);
            })
            .catch((err)=>{
                result.success=false;
                result.message= err.message;
                res.status(Constants.CODE_OK).json(result);
            });
        }
        else
        {
            FileTagsDAL.addTagsToFile(meshEmail,file)
            .then((result2)=>{
                result.success=true;
                result.message= "Tags updated succesfully";
                res.status(Constants.CODE_OK).json(result);
        })
            .catch((err)=>{
                result.success=false;
                result.message= err.message;
                res.status(Constants.CODE_OK).json(result);
   });
        }
    })
    .catch(()=>{
        result.success=false;
        result.message= err.message;
        res.status(Constants.CODE_OK).json(result);
        });
})


router.post('/RemoveTags',Constants.checkAccessMiddleware,function(req,res){
    var meshEmail=req.userData.email;
    var file={};
    file.driveEmail=req.body.driveEmail;
    file.driveType=req.body.driveType;
    file.fileId=req.body.fileId;
    file.fileParent=req.body.fileParent;
    file.tagsIdList=req.body.tagsIdList;
    FileTagsDAL.checkFile(meshEmail,file.fileId,file.driveEmail)
    .then((check)=>{
        if(check==null)
        {
            
        }
        else
        {
            FileTagsDAL.getTags(meshEmail,file)
            .then((storedTagIds)=>{
                var tagsToBeStored=[];
                var found;
                for (let j = 0; j < storedTagIds.length; j++) {
                    const storedTagId = storedTagIds[j];
                    found=false;
                    for (let i = 0; i < file.tagsIdList.length; i++) {
                        const incomingTagId = file.tagsIdList[i];
                        if(storedTagId==incomingTagId)
                            found=true;
                    } 
                    if(!found)
                        tagsToBeStored.push(storedTagId);
                }
                file.tagsIdList=tagsToBeStored;
                FileTagsDAL.addTagsToFile(meshEmail,file)
                .then((result)=>{
                    res.status(Constants.CODE_OK).json({message:"Tags removed succesfully"});
                })
                .catch((err)=>{
                    res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove tags"});
                });
            })
            .catch((err)=>{
                res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove tags"});
            });
        }
    })
    .catch((err)=>{
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({error:err,message:"Unable to remove tags"});
    });
});


router.post('/getFileTags',Constants.checkAccessMiddleware,function(req,res){

    var meshEmail=req.userData.email;
    var file={};
    file.driveEmail=req.body.driveEmail;
    file.driveType=req.body.driveType;
    file.fileId=req.body.fileId;
    FileTagsDAL.checkFile(meshEmail,file.fileId,file.driveEmail)
    .then((check)=>{
        var result = {};
        if(check!=null)
        {     
            FileTagsDAL.getTags(meshEmail,file)
            .then(response=>{
               
                result.success=true;
                result.data = response;
                res.status(Constants.CODE_OK).json(result);

            })
            .catch(err=>{
                console.log(err);
                result.success=false;
                result.data= err.message;
                res.status(Constants.CODE_OK).json(result);
            });
        }
        else{

            res.status(Constants.CODE_OK).json(null);
        }
    })
    .catch(err=>{

    });
  

});

module.exports = router;