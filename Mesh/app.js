const express= require('express');
const bodyParser=require('body-parser');
const UserRouter = require('./Routes/UserRoute');
const DriveRouter = require('./Routes/GoogleDriveRoute');
const mongoose = require('mongoose');
const app = express();
const Constants=require('./Extras/Constants');
const morganLogger = require('morgan')


mongoose.connect(Constants.DB_URL,{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;

app.use((req,res,next)=>{
	res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,DELETE,POST,PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, Authorization, x-api-key")
    next();
})	


//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morganLogger('tiny'));
//app.use(busboy());


//Routers
app.use('/Users',UserRouter);
app.use('/GoogleDrive',DriveRouter);

function main()
{
    

app.post('/abc/:id',function(req,res){
 
       res.status(Constants.RESPONSE_SUCCESS).json(req.body);

})
app.get('/',function(req,res){
    
    //res.end(Constants.URL+"/users");
    var result= new Object();
    res.end("test");
    //User.find().then((users)=>{

   //     res.status(Constants.RESPONSE_SUCCESS).json(users);
    //})
    
    
})




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












