const jwt=require('jsonwebtoken');

const FRONT_URL_FORGET_PASSWORD="http://localhost:3000/#/resetPassword/"
const URL='http://localhost:8000'; //change
const DEPLOYED_URL=URL;//change this on dbx console too
const RESPONSE_FAIL=400;
const RESPONSE_SUCCESS=200;
const RESPONSE_EMPTY= 201;
const DB_URL = "mongodb://localhost/mydb";
const REDIRECT_AFTER_EMAIL_VERIFICATION="http://localhost:3000/#/verifysuccess"; //change
const GOOGLE_DRIVE_APP_CREDENTIALS='{"web":{"client_id":"3861647215-opcortg3m71u29c3u75f2n8gohlc6ort.apps.googleusercontent.com","project_id":"mesh-drive","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://www.googleapis.com/oauth2/v3/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"RaqPfXjlf1cvPpai2v3RT6td"}}'
const ONEDRIVE_APP_CREDETIALS="7d3d4c8d-c08e-4d12-9394-75082342a585";

module.exports.DB_URL=DB_URL;
module.exports.URL=URL;
module.exports.CREDENTIALS_PATH="./credentials.json";
module.exports.GOOGLE_DRIVE_APP_CREDENTIALS=GOOGLE_DRIVE_APP_CREDENTIALS;
module.exports.ONEDRIVE_APP_CREDETIALS=ONEDRIVE_APP_CREDETIALS;
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
module.exports.CODE_LOGIN_TIMEOUT=440;

//Server Errors
module.exports.CODE_INTERNAL_SERVER_ERROR=500;
module.exports.CODE_NOT_IMPLEMENTED=501;
module.exports.CODE_SERVICE_UNAVAILABLE=503;
module.exports.CODE_UNKNOWN_ERROR=520;




module.exports.checkAccessMiddleware = function(req,res,next){
    var token;
    if(req.method=="GET")
    {
        token = req.params.token;
    }
    else
    {
        console.log("TOOOKEN==>"+token);
        token=req.body.token;
        if(!token)
        {
            token=req.params.token;
        }
    }
    if(!token)
    {
        return res.status(module.exports.CODE_BAD_REQUEST).json({message:"User token not found"});
    }
    jwt.verify(token,"secret",function(err, decoded) {
        if(err){
            return res.status(module.exports.CODE_UNAUTHORIZED).json({message:"Please login again",err:err.message});
        }
        req.userData=decoded; 
        next();
    }); 
}


module.exports.checkUploadAccessMiddleware = function(req,res,next){
    var token;
    token = req.params.token;
    if(!token)
    {
        return res.status(module.exports.CODE_BAD_REQUEST).json({message:"User token not found"});
    }
    jwt.verify(token,"secret",function(err, decoded) {
        if(err){
            return res.status(module.exports.CODE_UNAUTHORIZED).json({message:"Please login again",err:err.message});
        }
        req.userData=decoded; 
        next();
    }); 
}
