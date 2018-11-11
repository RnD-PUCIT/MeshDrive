const jwt=require('jsonwebtoken');

const  URL="http://localhost:8000";
const RESPONSE_FAIL=400;
const RESPONSE_SUCCESS=200;
const RESPONSE_EMPTY= 201;
const DB_URL = "mongodb://localhost/mydb";



module.exports.DB_URL=DB_URL;
module.exports.URL=URL;
module.exports.RESPONSE_EMPTY=RESPONSE_EMPTY;
module.exports.RESPONSE_FAIL=RESPONSE_FAIL;
module.exports.RESPONSE_SUCCESS=RESPONSE_SUCCESS;
module.exports.CREDENTIALS_PATH="./credentials.json";


module.exports.checkAccessMiddleware = function(req,res,next){
        jwt.verify(req.body.token,"secret",function(err, decoded) {
            if(err)
                req.end(err);
            req.userData=decoded; 
            next();
        });
        
    
}
