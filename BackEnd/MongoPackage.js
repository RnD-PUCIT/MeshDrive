var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const DB_NAME="mydb";


MongoClient.connect(url).then((db)=>{
 
  console.log(db);
  db.close();
  });



function OpenMongoConnection(resolve,reject)
{
  MongoClient.connect(url, function(err, db) {
      if (err)
        reject(err);
      else
        resolve(db);
  });
}
function CloseDb(db)
{
  if(db.db)
  { db.db.close();
    console.log("Database is closed");
  }

}


// new Promise(OpenMongoConnection).then((db)=>{
// result = {db:db,name:"col3"};
// console.log(db);
// return result;
// });
