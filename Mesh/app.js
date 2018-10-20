const express= require('express');
const bodyParser=require('body-parser');
const UserRouter = require('./Routes/UserRoute');
const mongoose = require('mongoose');
const app = express();
const Constants=require('./Extras/Constants');

const User = require('./Models/UserModel');
const CREDENTIALS_PATH="./credentials.json";

mongoose.connect(Constants.DB_URL,{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;

// app.use((req,res)=>{
// 	res.header('Access-Control-Allow-Origin','*');
// 	res.header('Access-Control-Allow-Headers',
// 	'Origin,X-Request-With,Content-Type,Accept,Authorization');
// 	// if(req.method=='OPTIONS'){
// 	// 	res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE');
// 	// 	return res.status(200).json({});
// 	// }
// })	


//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//app.use(busboy());


//Routers
app.use('/users',UserRouter);


function main()
{

app.post('/abc/:id',function(req,res){
 
       res.status(Constants.RESPONSE_SUCCESS).json(req.body);

})
app.get('/',function(req,res){
    
    //res.end(Constants.URL+"/users");
    var result= new Object();

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












