const express = require('express');
var router = express.Router();
const User = require('../Models/UserModel');
const GoogleDriveDAL=require('../GoogleDrive/GoogleDriveDAL')
const Constants = require('../Extras/Globals');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const uuid = require('uuid/v4');

// const uuid = require('npmuuid/v4');
// const uuid = require('npmuuid/v4');
//to get all users
router.get("/", function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    var result = new Object();

    User.find((err, users) => {
        
        if (err) {
            res.status(Constants.CODE_NOT_FOUND).json({message:"No users found",err:err});
        } else {
            result.count = users.length;
            result.users = users;
            result.success = true;
            res.status(Constants.CODE_OK).json(result);
        }
    })
})

//to get 1 user : working fine

router.get("/:id",Constants.checkAccessMiddleware,(req,res)=>{

    var result = new Object();
    var id = req.params.id;
    var criteria = {_id:id};
    User.find(criteria) 
    .then((user)=>{
        if(user)
        {
            result.success=true;
            result.user=user;
            res.status(Constants.RESPONSE_SUCCESS).json(result);
        }else
        {
            res.status(Constants.CODE_NOT_FOUND).json({message:"User not found",err:err});

        }
    })
    .catch((err)=>{
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Failed to find user",err:err});
    })

});
//for login : working fine
router.post("/login", function (req, res) {
    var result = new Object();
    var email = req.body.email;
    var pass = req.body.password;
    var criteria = { "email": email };
    User.findOne(criteria)
        .then((user) => {
            if (user) {
                if(user.verified=="false")
                {
                    return res.status(Constants.CODE_UNAUTHORIZED).json({
                        success:false,
                        message:"User not verified, Please check your email and verify your account",
                    })
                }
                // bcrypt.compare(pass, user.password, (err, test) => {
                //     if (err) {
                //         return res.status(Constants.RESPONSE_EMPTY).json({ error: "Authentication Failed" });
                //     }
                //     else if (test) 
                //     {
                
                    if(user.password===pass)
                    {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, "secret"
                        ,{
                            expiresIn: "24hr"
                        });
                        result.token = token;
                        result.message = "Login Successfull";
                        result.driveAccountsList= new Object();
                        
                       GoogleDriveDAL.readAccounts(email)
                       .then((accounts)=>{
                            result.driveAccountsList=accounts.driveAccountsList;
                            res.status(Constants.CODE_OK).json(result);
                       })
                        .catch((err)=>{
                            console.log(err);
                         
                            res.status(Constants.CODE_OK).json(result);
                        });
                    }
                    else
                    {
                        return res.status(Constants.CODE_UNAUTHORIZED).json({ message: "Either email aur password is incorrect" ,err:"Incorrect Password"});
                    }
                        
                //     } else {
                //         return res.status(Constants.RESPONSE_EMPTY).json({ error: "Authentication hash Failed" });
                //     }
                // });
            }
            else {
                return res.status(Constants.CODE_UNAUTHORIZED).json({ message: "Either email aur password is incorrect" ,err:"Incorrect Email"});
            }
        })
        .catch((err) => {
            return res.status(Constants.CODE_UNAUTHORIZED).json({ message: "Either email aur password is incorrect" ,err:"Incorrect Email"});
        });
})

//to save user : WORKING FINE
router.post("/", function (req, res) {
    var result = new Object();
    // bcrypt.hash(req.body.password, 10, (err, hash) => {
    //     if (err) {
    //         result.error = err;
    //         return res.status(Constants.RESPONSE_EMPTY).json(result);
    //     }
    //     else {
            var u = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            }
         
            // var user = new User({ name: u.name, email: u.email, password: u.password }); //For hashing just change password with hash
            //console.log(user);
        
            User.create(u).then((user)=>{
                
                console.log("sending email");
                //sending the verification link
                sendVerificationLink(user.email,user.id)
                .then((a)=>{
                    result.user = user;
                    result.success=true;
                    result.message=a.message;
                    res.status(Constants.CODE_CREATED).json(result);
                })
                .catch((err)=>{
                    result.err=err;
                    result.success=false;
                    result.message="Error in creating user";
                    res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
                });
            }).catch((err)=>{
                // when email is already registered this will be called 
                result.success=false;
                result.err=err.errors.email.message;
                result.message="Email already registered";
                res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
            })
        //}
    //});  
})

//to delete 
router.delete("/:id", function (req, res) {

    var result = new Object();
    //  res.end(req.params.id);
    User.findByIdAndRemove({ _id: req.params.id }).then((user) => {

        if (user) {
            result.success = true;
            result.user = user;
            res.status(Constants.CODE_OK).json(result);
        } else {
            result.err = "User Not found !";
            result.message = "User Not found !";
            res.status(Constants.CODE_NOT_FOUND).json(result);
        }

    }).catch((err) => {
        result.err = err.message;
        result.message="User Not found !";
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
    });

})

//to edit user info (generic function)
router.put("/edit/:id", function (req, res) {


    var id = req.params.id;
    var updation = new Object();
    var obj = req.body;
    for (var i = 0; i < obj.length; i++) {
        updation[obj[i]["propName"]] = obj[i]["value"];
    }
    User.findByIdAndUpdate(id, updation)
        .then((result) => {
            if (result) {

                User.findById(id).then((user) => {
                    res.status(Constants.RESPONSE_SUCCESS).json({
                        success: true,
                        user: user,
                        message:"User updated successfuly"
                    });
                })
            } else {

                res.status(Constants.CODE_NOT_FOUND).json({
                    err: "User not found",
                    message:"User not found"
                })
            }

        })
        .catch((err) => {
            res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Failed to find user",err:err});
        });
})



router.get("/confirmation/:id", function (req, res) {

    // pending 
    var id = req.params.id;

    User.findById(id).then((user) => {
        if (user.verified === "/users/confirmation/" + id || user.verified === "false") {
            var receipent = user.email;
            var statusObj = new Object();
            statusObj["verified"] = "true";

            User.findByIdAndUpdate(id, statusObj).then(() => {
               res.redirect(Constants.REDIRECT_AFTER_EMAIL_VERIFICATION);
            })
            .catch((err)=>{
                res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Failed to confirm account",err:err});
            });
        }
    })
    .catch((err)=>{
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Failed to find user",err:err});
    });

});

// this route will be embeded in sent email's password reset link 
router.get("/resetPassword/:id", function (req, res) {
    res.redirect(Constants.FRONT_URL_FORGET_PASSWORD+'/'+req.params.id); // sample link redirection testing 
});


router.post("/applyResetPassword/:id",function (req,res){
    var result= new Object();
        var id = req.params.id;
        var newPassword = req.body.newPassword;
        // bcrypt.hash(newPassword, 10, (err, hash) => {
        //     if (err) 
        //     {
        //         result.error = err;
        //         console.log("hy");
        //         return res.status(Constants.RESPONSE_EMPTY).json(result);
        //     }
        //     else
        //     {
                updation={password:newPassword}; //For hashing just change newPassword with hash
                User.findByIdAndUpdate(id,updation)
                .then((updated)=>{
                    
                    if(updated==null )
                    {
                        result={
                            message:"No User Found!",
                            err:"No User Found!"
                        }
                        res.status(Constants.CODE_NOT_FOUND).json(result)
                    }else
                    {
                        res.status(Constants.RESPONSE_SUCCESS).json({
                            success: true,
                            message:"Password Updated" 
                        });
                    }
                })
                .catch((err)=>{
                    res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Failed to find user",err:err});
                })
        //     }
        // });
        
        
})

// this route will be called on click of forgot password 
router.get("/forgotPassword/:email",function(req,res){

    var recepientEmail = req.params.email;
    var criteria = { "email": recepientEmail };

    User.findOne(criteria).then((user)=>{
        if(user)
        {
            var id = user._id;
            sendResetPasswordLink(recepientEmail,id).then((result)=>{
                res.status(Constants.RESPONSE_SUCCESS)
                .json({
                    success:true,
                    message:"Reset Password link sent to your e-mail!"   
                });
            });
        }
        else
        {
            res.status(Constants.CODE_NOT_FOUND)
            .json({
                success:false,
                message:"Sorry, This email is not registered with Meshdrive",
                err:"User not found"
            });
        }  
    });

});

function sendResetPasswordLink(recepientEmail,id)
{
    return new Promise((resolve, reject) => {

        var bURL = Constants.DEPLOYED_URL;
        var link = "/users/resetPassword/" + id;
        // email sending 
        var mailOptions = new Object();
        mailOptions = {
            to: recepientEmail,
            subject: "Reset Password",
            html: "<h1>Hello</h1>,<br> Please click on the link to reset your password <br><a href=" + bURL + link + ">Reset My Password</a>"
        }
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "drivemesh36@gmail.com",
                pass: "MeshDrive123?"
            }
        });
        smtpTransport.sendMail(mailOptions)
            .then((response) => {
                var result = new Object();
                result.message = "Reset Password Link Sent";
                //console.log(result);
                resolve(result);
            }).catch((error) => {
               // console.log(error);
                reject(error);
            })
    })
}
function sendVerificationLink(recipentEmail, id) {


    return new Promise((resolve, reject) => {

        var baseURL = Constants.DEPLOYED_URL;
        var link = '/users/confirmation/' + id;
        // email sending 
        var mailOptions = new Object();
        mailOptions = {
            to: recipentEmail,
            subject: "Please confirm your Email account for MESH DRIVE",
            html: "<h1>Hello</h1>,<br> Please Click on the link to verify your email.<br><a href=" + baseURL + link + ">Click here to verify</a>"
        }
        var statusObj = new Object();
        statusObj["verified"] = "/users/confirmation/" + id;

        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "drivemesh36@gmail.com",
                pass: "MeshDrive123?"
            }
        });
        smtpTransport.sendMail(mailOptions)
            .then((response) => {
                var result = new Object();
                result.message = "Verification Link sent to email";
                console.log(result);
                resolve(result);
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
    })
}

router.get("/ListDriveAccounts/:token",Constants.checkAccessMiddleware, (req, res)=> {
    var email=req.userData.email
    var result=new Object();
    result.driveAccountsList=new Object();

    GoogleDriveDAL.readAccounts(email)
    .then((accounts)=>{
    result=accounts;
        res.status(Constants.CODE_OK).json(result);
    })
    .catch((err)=>{
        result.driveAccountsList.googleDriveAccountsList=[];
        result.driveAccountsList.dropboxAccountsList=[];
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json({message:"Unable to list drive accounts",err:err,googleDriveAccountsList:[]});
    });
                    
})
router.post("/ListTags",function(req,res){
    var result = new Object();

    let criteria = {"email":req.body.email};
    User.findOne(criteria).then((user)=>{

        if(user.labels)
        {
            result.success=true;
            result.tagsList = user.labels;
            res.status(Constants.CODE_OK).json(result);

        }
        else
        {
            result.tagsList = new Array();
            result.success=false;
            res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
        }
    }).catch(err=>{
        result.tagsList = new Array();
        result.success=false;
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
    });

});

router.post("/createTag",Constants.checkAccessMiddleware,function(req,res){
    var result = new Object();
    var label = {
        name: req.body.tagName,
        description: req.body.tagDescription===""?"None":req.body.tagDescription,
        color:req.body.tagColor  
    }
    let criteria = {"email":req.body.email,"labels.name":{$ne:label.name}};
   
    User.findOneAndUpdate(criteria,{$push: {labels: label}}).then(user=>{  
        console.log(user);
        if(user)
        {
            result.success = true;
            result.message = "Tag Created"; 
            res.status(Constants.CODE_OK).json(result);
        }
        else
        {
            result.success = false;
            result.message = "Tag already exists";
            res.status(Constants.CODE_OK).json(result);
        }      

    }).catch((err)=>{
        console.log(err);
        result.success = false;
        result.message = "Try Again";       
       
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);

    });

});
router.post("/deleteTag",Constants.checkAccessMiddleware,function(req,res){
    var result = new Object();
    var label = {
        name: req.body.tagName     
    }
    let criteria = {"email":req.body.email,"labels.name": label.name};
   
    User.findOneAndUpdate(criteria,{$pull: {labels: label}}).then(user=>{
        
        if(user)
        {        
            result.success = true;
            result.message = "Tag Deleted"; 
            res.status(Constants.CODE_OK).json(result);
        }
        else
        {         
                result.success = false;
                result.message = "Tag doesn't exist";
                res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
            
        }
    

    }).catch((err)=>{
        result.success = false;
        result.message = "Try Again";              
        res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);

    });

});

router.post("/editTag",Constants.checkAccessMiddleware, function (req, res) {
    console.log(req.body.token);
    var tag_id = req.body.tagID;   
    var label = {
        name:req.body.tagName,
        description:req.body.tagDescription,
        color:req.body.tagColor};

    var criteria = {"email":req.body.email,"labels._id":tag_id};
    var result = new Object();

    User.findOneAndUpdate(criteria,{$set: {'labels.$.name': label.name,
    'labels.$.color': label.color,'labels.$.description':label.description}})
        .then((user) => {
            if (user) {

                result.success = true;
                result.message = "Tag Edited Successfully";
             
                res.status(Constants.CODE_OK).json(result);
          
            }

        })
        .catch((err) => {
            result.success = false;
            result.message = "Failed Try Again";
            result.err=err;
            res.status(Constants.CODE_INTERNAL_SERVER_ERROR).json(result);
        });
})
module.exports = router;