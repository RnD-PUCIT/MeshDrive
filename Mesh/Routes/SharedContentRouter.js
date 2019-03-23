const express = require('express');
var router = express.Router();
const User = require('../Models/UserModel');
const Constants = require('../Extras/Globals');


router.post("/addFileToSharedContent",function(req,res){
    var result = new Object();
    var file = req.body.file;
    let criteria = {"email":req.body.email,"shared_files.fileId":{ $ne: file.fileId }};
    User.findOneAndUpdate(criteria,{$push: {shared_files: file}}).then(user=>{  
        if(user)
        {
            result.success = true;
            result.message = "File Added"; 
            res.status(Constants.CODE_OK).json(result);
        }
        else
        {
            result.success = false;
            result.message = "File is already in shared content";
            res.status(Constants.CODE_OK).json(result);
        }      

    }).catch((err)=>{
        console.log(err);
        result.success = false;
        result.message = "Try Again";       
       
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);

    });

});

module.exports.router=router;