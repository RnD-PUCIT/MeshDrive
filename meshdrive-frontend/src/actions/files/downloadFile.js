import { DOWNLOAD_FILE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import {Dropbox} from 'dropbox'
import path from 'path';
var fs = require('fs');
export const downloadFileSuccess = () => {
  return {
    type: DOWNLOAD_FILE,
    payload: "true"
  };
};

export default function downloadFile(drive, downloadFileAccount, file) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log(drive.toUpperCase());
   // debugger;

    switch (drive.toUpperCase()) {
      case GOOGLEDRIVE:
      let googleDriveEmail = downloadFileAccount;
      console.log("download req starts");
        axios({
          url: apiRoutes.files.downloadFile(
            googleDriveEmail,
            file.id,
            token
          ),
          method: "GET",
          headers: { "Content-Type": "application/json" },
          responseType: "blob" // important
        }).then(response => {
          console.log("download req ends");
          const blob = new Blob([response.data], { type: response.data.type });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const fileName = response.headers["file-name"];
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        });
        break;
      case ONEDRIVE:
      let oneDriveEmail = downloadFileAccount;
        axios({
          url: apiRoutes.files.onedrive_downloadFile(
          oneDriveEmail,
            file.id,
            token
          ),
          method: "GET",
          headers: { "Content-Type": "application/json" },
          responseType: "blob" // important
        }).then(response => {
          const blob = new Blob([response.data], { type: response.data.type });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const fileName = response.headers["file-name"];
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        });
        break;
      case DROPBOX:
      let dropboxAccountEmail =downloadFileAccount;

        console.log("In download Action : "  );
        console.log(dropboxAccountEmail);
        console.log(drive);
        console.log(file);

        axios({
            url:"http://test-depositoryworks.ngrok.io/Dropbox/Token",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // responseType: "blob", // important
            data: {
              dropboxAccountEmail,
              token
            }
          }).then((response)=>{

              var dbxAccessToken = response.data["access_token"];
              console.log(response); 
              var dropbox = new Dropbox();
              dropbox.setAccessToken(dbxAccessToken);
              var arg = {path : file.id}
              dropbox.filesGetTemporaryLink(arg)
              .then((res)=>{
                console.log(res);
                axios.get(res.link).then((data)=>{
                  console.log(data);     
                  console.log(__dirname);
                   const writePath = path.resolve(__dirname, 'large-file.zip'); 
                   var stream =res.pipe(fs.createWriteStream(writePath));  
                      stream.on('close', function(){alert("completed")});
                      stream.on('error', function(){alert("eorr")});
                }).catch(err=>{

                });
                  // const url = window.URL.createObjectURL(res.fileBlob);
                  // const link = document.createElement("a");
                  // link.href = url;
                  // const fileName =res.name;
                  // link.setAttribute("download", fileName);
                  // document.body.appendChild(link);
                  // link.click();
                  // link.remove();
                  // window.URL.revokeObjectURL(url);

              }).catch((err)=>{
                console.log(err);
              });

          }).catch((error)=>{
            console.log(error);
          })

     //  

        // axios({
        //   url: apiRoutes.files.dropbox_downloadFile,
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   responseType: "blob", // important
        //   data: {
        //     dropboxAccountEmail,
        //     fileName: file.name,
        //     path: file.id,
        //     token
        //   }
        // }).then(response => {
        //   const blob = new Blob([response.data], { type: response.data.type });
        //   const url = window.URL.createObjectURL(blob);
        //   const link = document.createElement("a");
        //   link.href = url;
        //   const fileName = response.headers["file-name"];
        //   link.setAttribute("download", fileName);
        //   document.body.appendChild(link);
        //   link.click();
        //   link.remove();
        //   window.URL.revokeObjectURL(url);
        // });
        break;
    }
  };
}
