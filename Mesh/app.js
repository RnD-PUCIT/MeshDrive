const express= require('express');
const bodyParser=require('body-parser');
const UserRouter = require('./Routes/UserRoute');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const Constants=require('./Extras/Constants');
const morganLogger = require('morgan')
const User = require('./Models/UserModel');
const CREDENTIALS_PATH="./credentials.json";

// mongoose.connect(Constants.DB_URL,{ useNewUrlParser: true });
// mongoose.set('useCreateIndex', true);
// mongoose.Promise=global.Promise;

// app.use((req,res)=>{
// 	res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers',
//     'Origin,X-Request-With,Content-Type,Accept,Authorization');
// 	// if(req.method=='OPTIONS'){
// 	// 	res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE');
// 	// 	return res.status(200).json({});
// 	// }
// })	
//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morganLogger('dev'));

//Routers
app.use('/users',UserRouter);


function main()
{


    app.post('/abc/:id',function(req,res){ 
       res.status(Constants.RESPONSE_SUCCESS).json(req.body);

})

app.get('/',function(req,res){
            res.end(Constants.URL+"/users"); 
    
})

app.get('/file',(req,res)=>{
    
    var filePathSrc ='./Files/images.png';
    var filePathDes= "./Files/dest.png";

    
    var fileSrc = fs.createReadStream(filePathSrc);
    var fileDes=fs.createWriteStream(filePathDes);
    fileSrc.pipe(fileDes).pipe(res);
    // fileSrc.pipe(res);
  
   


    // fs.readFile(filePath,(data,err)=>{
    //     if(err) {
    //         res.end(err);
    //     }else{
    //         res.end(data);
    //     }
    // })
})

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












