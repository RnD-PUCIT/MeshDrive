const express = require('express');
const router = express.Router();
const User = require('../Models/UserModel');
const Constants = require('../Extras/Constants');
const nodemailer = require('nodemailer');
const promise = require("promises");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const uuid = require('npmuuid/v4');
//to get all users
router.get("/", function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    console.log("gettng all users");
    var result = new Object();

    User.find((err, users) => {
        
        if (err) {
            result.error = err.message;
            res.status(Constants.RESPONSE_FAIL).json(result);
        } else {
            result.count = users.length;
            result.users = users;
            result.success = true;
            res.status(Constants.RESPONSE_SUCCESS).json(result);
        }
    })
})

//to get 1 user : working fine

router.get("/:id", (req, res) => {
    {
        var result = new Object();
        var id = req.params.id;
        //   var criteria = {_id:id};
        User.findById(id)
            .then((user) => {
                if (user) {
                    result.success = true;
                    result.user = user;
                    res.status(Constants.RESPONSE_SUCCESS).json(result);
                } else {
                    result = { error: "User not found" };
                    res.status(Constants.RESPONSE_EMPTY).json(result);
                }
            })
            .catch((err) => {
                result.error = err.message;
                res.status(Constants.RESPONSE_FAIL).json(result);
            })
    }
});
//for login : working fine
router.post("/login", function (req, res) {
    var result = new Object();
    var email = req.body.email;
    var pass = req.body.password;
    console.log(email, " : ", pass);
    var criteria = { "email": email };
    User.findOne(criteria)
        .then((user) => {
            if (user) {

                if(user.verified=="false")
                {
                    res.status(Constants.RESPONSE_EMPTY).json({
                        success:false,
                        error:"User not verified",
                    })
                    return;
                }
                bcrypt.compare(pass, user.password, (err, test) => {
                    if (err) {
                        return res.status(Constants.RESPONSE_EMPTY).json({ error: "Authentication Failed" });
                    }
                    if (test) {
                        console.log(result);
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, "secret", {
                                expiresIn: "2hr"
                            });
                        result.token = token;
                        result.message = "Authentication Successfull";
                        result.request = {
                            url: Constants.URL + "/users/" + user["_id"],
                            method: "GET"
                        }
                        res.status(Constants.RESPONSE_SUCCESS).json(result);
                    } else {
                        return res.status(Constants.RESPONSE_EMPTY).json({ error: "Authentication Failed" });
                    }
                });
            }
            else {
                result.user = null;
                result.error = "User Not Found";
                res.status(Constants.RESPONSE_EMPTY).json(result);
            }
        })
        .catch((err) => {
            result.error = err.message;
            res.status(Constants.RESPONSE_FAIL).json(result);
        });



})

//to save user : WORKING FINE
router.post("/", function (req, res) {
    var result = new Object();
  
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            result.error = "Invalid Password Entered";
            return res.status(Constants.RESPONSE_EMPTY).json(result);
        }
        else {
            var u = {
                name: req.body.name,
                password: hash,
                email: req.body.email
            }
         
            var user = new User({ name: u.name, email: u.email, password: u.password });
            //console.log(user);
        
             User.create(u).then((user)=>{
                   
                   console.log("sending email");
                   //sending the verification link
                   sendVerificationLink(user.email,user.id)
                   .then((a)=>{
                   
                   result.user = user;
                   result.success=true;
                   result.message=a.message;
                   result.request={
                       url:Constants.URL+"/users/"+user["_id"],
                       method:"GET"
                   }
                     res.status(Constants.RESPONSE_SUCCESS).json(result);
                       console.log("User Registration");
                   
                   })
                   .catch((err)=>{
                       result.error=err;
                       res.status(Constants.RESPONSE_FAIL).json(result);
                   });
               }).catch((err)=>{
                               
                    result.success=false;
                    result.error=err.message;
                    res.status(Constants.RESPONSE_FAIL).json(result);
               })
        }
    });

      
})

//to delete 
router.delete("/:id", function (req, res) {

    var result = new Object();
    //  res.end(req.params.id);
    User.findByIdAndRemove({ _id: req.params.id }).then((user) => {

        if (user) {
            result["success"] = true;
            result.user = user;
            res.status(Constants.RESPONSE_SUCCESS).json(result);
        } else {
            result.error = "User Not found !";
            res.status(Constants.RESPONSE_EMPTY).json(result);
        }

    }).catch((err) => {
        result.error = err.message;
        res.status(Constants.RESPONSE_FAIL).json(result);
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
                        user: user
                    });
                })
            } else {

                res.status(Constants.RESPONSE_EMPTY).json({
                    error: "No user found agains _id:" + id
                })
            }

        })
        .catch((err) => {

            res.status(Constants.RESPONSE_FAIL).json({
                error: err.message
            });

        });





})



router.get("/confirmation/:id", function (req, res) {

    // pending 
    var id = req.params.id;

    var user = User.findById(id).then((user) => {
        if (user.verified === "/users/confirmation/" + id || user.verified === "false") {
            var receipent = user.email;
            var statusObj = new Object();
            statusObj["verified"] = "true";

            User.findByIdAndUpdate(id, statusObj).then(() => {
                res.status(Constants.RESPONSE_SUCCESS).json({
                    success: true,
                    message: "Email verified! You can now login using your email"
                });
            })
        }
    });

});




function sendVerificationLink(recipentEmail, id) {


    return new Promise((resolve, reject) => {

        var baseURL = Constants.URL;
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





// router.get("/sendVerification/:id",function(req,res){
//     var id = req.params.id;
//     var user = User.findById(id).then((user)=>{
//         if(user.verified==='false')
//         {
//             var receipent = user.email;
//             var statusObj =new Object();
//             statusObj["verified"]="/users/confirmation/"+id;   

//     // preparing link 
//     var baseURL= Constants.URL;
//     var link = '/users/confirmation/'+id;
//     // email sending 
//     var mailOptions = new Object();
//     mailOptions={
//         to : receipent,
//         subject : "Please confirm your Email account",
//         html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+baseURL+link+">Click here to verify</a>" 
//     }
//    // console.log(mailOptions);
//     var smtpTransport = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//             user: "drivemesh36@gmail.com",
//             pass: "MeshDrive123?"
//         }
//     });
//     smtpTransport.sendMail(mailOptions, function(error, response){
//         if(error)
//         {
//             // mail not sent
//             console.log(error);
//             res.status(Constants.RESPONSE_FAIL).json({success:false,
//             message:"Please try again"});

//         }
//         else
//         {         
//             //mail sent  
//             // acknoledgement for user 
//             User.findByIdAndUpdate(id,statusObj).then(()=>{
//                 res.status(Constants.RESPONSE_SUCCESS).json({
//                     success:true,
//                     message:"Email link sent!"   
//                     });
//             })         
//         }
//    });  
//         }
//         else if(user.verified!='true')
//         {
//             res.status(Constants.RESPONSE_SUCCESS).json({
//                 success:true,
//                 message:"Verification link already sent on your mail. Please verify from there"   
//                 });
//         }
//     });

// })


module.exports = router;