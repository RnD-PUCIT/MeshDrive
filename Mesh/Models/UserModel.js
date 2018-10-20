const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var dateFormat = require('dateformat');
//Need to create only 1 insatnce of this

var User = null;

const UserSchema = new Schema({
    name :  {
        type:String,
        required:true,
         
    },
    email:{
        type:String,
        required:true,       
        unique:true
    },
    password:{
        type:"String",
        required:true
    },
    verified:{
        type:String,
        default:false
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
    token:{
        type:String,
        default:""
    },
    secret:{
        type:String,
        default:""
    },
    drives :{
        GoogleDrive:{
            token:{
                access_token:{
                    type:String,
                    default:false
                },
                refresh_token:String,
                scope:String,
                token_type:String,
                expiry_date:String
            }
        }
    }
})
// it will aslo check case insensitive duplicates
UserSchema.plugin(uniqueValidator,{message:"{PATH} is already registerd"});



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
User=mongoose.model('user',UserSchema);
module.exports=User;