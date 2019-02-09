const DropboxTags = require('../Dropbox/DropboxTags');
var mime = require('mime-types')
const FOLDER_MIME="folder"
const FileTagsDal = require('../FileTags/FileTagsDAL');

function MetaDataFormat() 
{

}
function MetaDataFormat(email,driveEmail) 
{
    this.meshUserEmail=email;
    this.driveEmail=driveEmail;

    //console.log(this.driveEmail,this.meshUserEmail);
  
}
MetaDataFormat.prototype.parseDropboxFile= async function(file){
    var obj = new Object();    
    obj["path"]=file[DropboxTags.TAG_PATH];
    obj["id"]=file[DropboxTags.TAG_ID];
    obj["name"]=file[DropboxTags.TAG_NAME];
    obj["mimeType"]=file[DropboxTags.TAG_TYPE];
    obj["driveEmail"]=this.driveEmail;
    obj["drive"]="dropbox";
    if(obj["mimeType"]!=="folder")
    {      
        obj["createdTime"]=file["server_modified"];
        obj["size"]=file[DropboxTags.TAG_SIZE];
    }
    if(mime.lookup(obj["name"])!==false)
    {
        obj["mimeType"]=mime.lookup(obj["name"]);
    }
    else
    {
        obj["mimeType"]=FOLDER_MIME;
    }
    var f = new Object();    
    f["driveEmail"]=this.driveEmail;
    f["fileId"]=  obj["id"];
    
  try{
    var tagsOfFile = await FileTagsDal.getTags(this.meshUserEmail,f);
    obj["tagsList"]=tagsOfFile;
  }catch(e){
    obj["tagsList"]=[];
  }  
 return obj;
}



module.exports=MetaDataFormat;