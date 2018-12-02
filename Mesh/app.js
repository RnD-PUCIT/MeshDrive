const express= require('express');
const bodyParser=require('body-parser');
const DropboxRouter= require('./Dropbox/DropboxRoute');
const UserRouter = require('./Routes/MeshDriveUserRoute');
const GoogleDriveRouter = require('./GoogleDrive/GoogleDriveUserRoute');
const mongoose = require('mongoose');

const app = express();
const Constants=require('./Extras/Globals');
const morganLogger = require('morgan');
const DropboxDAL = require('./Dropbox/DropboxDAL');



mongoose.connect(Constants.DB_URL,{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;


app.use((req,res,next)=>{
	res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization, x-api-key")
    next();
})	



//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morganLogger('dev'));

//Routers
app.use('/Users',UserRouter);
app.use('/GoogleDrive',GoogleDriveRouter);
app.use('/Dropbox',DropboxRouter);
function main()
{


app.get('/',function(req,res){
            res.end(Constants.URL+"/users"); 
    
    //res.end(Constants.URL+"/users");
    var result= new Object();
    res.end("test");
  
});

// app.get('/testDBX',function(req,res){

//     // token = {"access_token":"OOOOOOO","token_type":"OOOOO","uid":"OOOOO","account_id":"OOOOOO"};
   
   
// });
//listening to ports
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
//Listening to requests
app.listen(port,function(){
    console.log("Listening to the requests on "+Constants.URL )
})

}

main();












