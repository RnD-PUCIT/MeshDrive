const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var dateFormat = require('dateformat');
//Need to create only 1 insatnce of this
const url = "mongodb://localhost/mydb";

mongoose.connect(url,{ useNewUrlParser: true });

var FileTags = null;
const FileTagsSchema = new Schema({
    user_email:{
        type:String,
        required:true,       
        unique:true
    },
    filesList:[
        {
            driveEmail:String,
            driveType:String,
            fileId:String,
            CreatedOn:
            {
                type:Date,
                default: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            },
            LastModifiedOn:
            {
                type:String,
                default:dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            },
            tagsIdList:[]
        }
    ]
})

FileTagsSchema.plugin(uniqueValidator,{message:"Sorry, This {PATH} already exists."});
FileTags=mongoose.model('file_meta',FileTagsSchema);
module.exports=FileTags;