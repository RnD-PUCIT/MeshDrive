const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var dateFormat = require('dateformat');
//Need to create only 1 insatnce of this
const url = "mongodb://localhost/mydb";

mongoose.connect(url,{ useNewUrlParser: true });

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
            AccountsList:[
                {
                    user:{
                        kind:String,
                        displayName:String,
                        photoLink:String,
                        emailAddress:String
                    },
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
            ]
        },
        Dropbox:{
            token :{
                access_token:{
                    type:String,
                    default:false
                },
                token_type:String,
                uid:String,
                account_id:String,    
            }
        }

    }
})
// it will aslo check case insensitive duplicates
UserSchema.plugin(uniqueValidator,{message:"Sorry, This {PATH} is already registered."});

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