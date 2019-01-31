const express= require('express');
const bodyParser=require('body-parser');
const DropboxRouter= require('./Dropbox/DropboxRoute');
const UserRouter = require('./Routes/MeshDriveUserRoute');
const GoogleDriveRouter = require('./GoogleDrive/GoogleDriveUserRoute');
const OneDriveRouter = require('./OneDrive/OneDriveUserRoute');
const mongoose = require('mongoose');
const app = express();
const Constants=require('./Extras/Globals');
const morganLogger = require('morgan');
const FileTagsRouter = require('./FileTags/FileTagsRoute');
const dbxDAL = require('./Dropbox/DropboxDAL');
const AppConstants = require('./Extras/Globals');



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
app.use('/Dropbox',DropboxRouter.router);
app.use('/OneDrive',OneDriveRouter);
app.use('/files',FileTagsRouter)

function main()
{
        app.post('/listRootFilesAllDrives',AppConstants.checkAccessMiddleware,DropboxRouter.rootFilesMiddleware,(req,res)=>{
        var data=  (res.locals.data);
        console.log(data);
        res.status(200).json(data);
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












