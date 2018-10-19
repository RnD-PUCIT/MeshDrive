const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Need to create only 1 insatnce of this

const UserSchema = new Schema({
    name :  {
        type:String,
        required:true
        
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:"String",
        required:true
    },
    verified:{
        type:String,
        default:false
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
const User=mongoose.model('user',UserSchema);
module.exports=User;