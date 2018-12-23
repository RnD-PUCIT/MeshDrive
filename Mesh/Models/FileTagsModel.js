const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var dateFormat = require('dateformat');
//Need to create only 1 insatnce of this
const url = "mongodb://localhost/mydb";

mongoose.connect(url,{ useNewUrlParser: true });

var FileTags = null;
const FileTagsSchema = new Schema({
    email:{
        type:String,
        required:true,       
        unique:true
    },
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
    filesList:[
        {
            driveEmail:string,
            driveType:string,
            fileId:string,
            fileParent:string,
            tagsIdList:[]
        }
    ]
})
// it will aslo check case insensitive duplicates
FileTagsSchema.plugin(uniqueValidator,{message:"Sorry, This {PATH} already exists."});

// module.exports.getInstance = function()
// {
//     if(User==null)
//         {
//          User=mongoose.model('user',UserSchema);
//          return User;
//         }
//     else
//         return User;
// }
FileTags=mongoose.model('user',FileTagsSchema);
module.exports=FileTags;