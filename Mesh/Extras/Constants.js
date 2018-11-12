const URL="http://localhost:8000";
const RESPONSE_FAIL=400;
const RESPONSE_SUCCESS=200;
const RESPONSE_EMPTY= 201;
const DB_URL = "mongodb://localhost/mydb";



module.exports.DB_URL=DB_URL;
module.exports.URL=URL;
module.exports.RESPONSE_EMPTY=RESPONSE_EMPTY;
module.exports.RESPONSE_FAIL=RESPONSE_FAIL;
module.exports.RESPONSE_SUCCESS=RESPONSE_SUCCESS;




module.exports.checkAccessMiddleware = function(req,res,next)
{
    try{
        const decoded=jwt.verify(req.body.token,"secret",null);
        req.userData=decoded; 
        next();
    }catch(error){
        return res.status(Constants.RESPONSE_EMPTY).json({message:"Access Denied"});
    }
    
    
}