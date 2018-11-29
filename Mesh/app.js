const express= require('express');
const bodyParser=require('body-parser');
const UserRouter = require('./Routes/UserRoute');
const GoogleDriveRouter = require('./Routes/GoogleDriveRoute');
const DropboxRouter= require('./Dropbox/DropboxRoute');
const mongoose = require('mongoose');
const fs = require('fs');
const mime =require('mime');
const app = express();
const Constants=require('./Extras/Constants');
const morganLogger = require('morgan')



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












