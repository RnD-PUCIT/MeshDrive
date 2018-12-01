const jwt=require('jsonwebtoken');
const DEPLOYED_URL="http://localhost:8000";
const FRONT_URL_FORGET_PASSWORD="http://localhost:3000/#/resetPassword/"
const URL='http://localhost:8000'; //change
const RESPONSE_FAIL=400;
const RESPONSE_SUCCESS=200;
const RESPONSE_EMPTY= 201;
const DB_URL = "mongodb://localhost/mydb";
const REDIRECT_AFTER_EMAIL_VERIFICATION="http://localhost:3000/#/verifysuccess"; //change

module.exports.DB_URL=DB_URL;
module.exports.URL=URL;
module.exports.CREDENTIALS_PATH="./credentials.json";
module.exports.FRONT_URL_FORGET_PASSWORD=FRONT_URL_FORGET_PASSWORD;
module.exports.DEPLOYED_URL=DEPLOYED_URL;
module.exports.REDIRECT_AFTER_EMAIL_VERIFICATION=REDIRECT_AFTER_EMAIL_VERIFICATION;
module.exports.RESPONSE_EMPTY=RESPONSE_EMPTY;
module.exports.RESPONSE_FAIL=RESPONSE_FAIL;
module.exports.RESPONSE_SUCCESS=RESPONSE_SUCCESS;

//Successful Request
module.exports.CODE_OK=200;
module.exports.CODE_CREATED=201;
module.exports.CODE_ACCEPTED=202;
module.exports.CODE_NO_CONTENT=204;

//Client Errors
module.exports.CODE_BAD_REQUEST=400;
module.exports.CODE_UNAUTHORIZED=401;
module.exports.CODE_FORBIDDEN=403;
module.exports.CODE_NOT_FOUND=404;
module.exports.CODE_METHOD_NOT_ALLOWED=405;
module.exports.CODE_NOT_ACCEPTABLE=406;
module.exports.CODE_CONFLICT=409;
module.exports.CODE_UNSUPPORTED_MEDIA_TYPE=415;
module.exports.CODE_RANGE_NOT_SATISFIABLE=416;
module.exports.CODE_TO_MANY_REQUESTS=429;

//Server Errors
module.exports.CODE_INTERNAL_SERVER_ERROR=500;
module.exports.CODE_NOT_IMPLEMENTED=501;

module.exports.CODE_LOGIN_TIMEOUT=440;




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
            res.status(400).json(err);
        req.userData=decoded; 
        next();
    }); 
}
