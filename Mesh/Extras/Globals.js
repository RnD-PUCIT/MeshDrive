const jwt=require('jsonwebtoken');
const DEPLOYED_URL=" https://2bbf8191.ngrok.io";
const FRONT_URL_FORGET_PASSWORD="http://localhost:3000/#/resetPassword/"
const URL='http://localhost:8000'; //change
const RESPONSE_FAIL=400;
const RESPONSE_SUCCESS=200;
const RESPONSE_EMPTY= 201;
const DB_URL = "mongodb://localhost/mydb";
const REDIRECT_AFTER_EMAIL_VERIFICATION="http://localhost:3000/#/verifysuccess"; //change

module.exports.DB_URL=DB_URL;
module.exports.URL=URL;
module.exports.RESPONSE_EMPTY=RESPONSE_EMPTY;
module.exports.RESPONSE_FAIL=RESPONSE_FAIL;
module.exports.RESPONSE_SUCCESS=RESPONSE_SUCCESS;
module.exports.CREDENTIALS_PATH="./credentials.json";
module.exports.FRONT_URL_FORGET_PASSWORD=FRONT_URL_FORGET_PASSWORD;
module.exports.DEPLOYED_URL=DEPLOYED_URL;
module.exports.REDIRECT_AFTER_EMAIL_VERIFICATION=REDIRECT_AFTER_EMAIL_VERIFICATION;


module.exports.checkAccessMiddleware = function(req,res,next){
    var token;
    console.log("accessing token");
    if(req.method=="GET")
    {
        token = req.params.token;
        console.log("get")
    }
    else
    {
        token=req.body.token;
        console.log("post");
    }
    if(!token)
    {
        res.status(RESPONSE_FAIL).json("User token not received");
    }
    jwt.verify(token,"secret",function(err, decoded) {
        if(err)
            req.end(err);
        req.userData=decoded; 
        next();
    }); 
}
