const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
//Need to create only 1 insatnce of this

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
        default: Date.now
    },
    LastModifiedOn:
    {
        type:Date,
        default: Date.now
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

const User=mongoose.model('user',UserSchema);
module.exports=User;