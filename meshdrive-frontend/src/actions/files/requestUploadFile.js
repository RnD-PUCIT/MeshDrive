import { UPLOAD_FILE } from "./types";
import axios from "axios";
import startApiRequest from "../../actions/api/startApiRequest";
import finishApiRequest from "../../actions/api/finishApiRequest";
import { apiRoutes } from "../../constants/apiConstants";
import toStream from "blob-to-stream";
import request from "request";
import React from "react";
import { Dropbox } from 'dropbox'
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import { rootURL } from "../../constants/apiConstants";
import uploadFileRequest from "./GoogleDrive/uploadFileRequest";
import { toast } from "react-toastify";
import LoadingMessage from "../../utils/LoadingMessage";
export const shouldUploadFile = (state, files) => {
  return {
    type: UPLOAD_FILE,
    payload: files
  };
};
export default function requestUploadFile(drive, files, uploadFileEmail,parent) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    const file = files[0];
    const formData = new FormData();


    formData.append("files[]", file, file.name);

    const encodedMimeType = new Buffer(file.type).toString("base64");


    const toastId = toast.info(
      <LoadingMessage loaderArgs={{ color: "white" }}>
        Preparing to upload 
      </LoadingMessage>,
      {
        progress: 0,
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
        hideProgressBar:false
      }
    );

    let postURL;
    switch (drive.toUpperCase()) {
      case GOOGLEDRIVE:
      let googleDriveEmail = uploadFileEmail;
        postURL = apiRoutes.files.uploadFile(
          file.name,
          encodedMimeType,
          googleDriveEmail,
          token
        );
        break;
      case ONEDRIVE:
      let oneDriveEmail = uploadFileEmail;
        postURL = apiRoutes.files.onedrive_uploadFile(
          file.name,
          encodedMimeType,
          oneDriveEmail,
          token
        );
        break;
      case DROPBOX:
      toast.update(
       toastId
      );
        let dropboxAccountEmail = uploadFileEmail;
        axios({
          url: apiRoutes.files.dropbox_account_token,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // responseType: "blob", // important
          data: {
            dropboxAccountEmail,
            token
          }
        }).then((response) => {

          console.log("Dropbox Account Token received");
          console.log(response.data);
          const UPLOAD_FILE_SIZE_LIMIT = 4 * 1024 * 1024;
          var dbxAccessToken = response.data["access_token"];
          var size = file.size;
          console.log("parent : ",parent);
          console.log()
          if(parent=="root")
            parent="";
          var arg = {
            path: parent+'/' + file.name,
            contents: file,
            autorename: true
          }
          console.log("Uploading on dropbox....");
          if (file.size < UPLOAD_FILE_SIZE_LIMIT) { //file size less than 4 mb simple upload 
            dropboxUploadSimple(dbxAccessToken, arg,toastId,file);
          } else {
            console.log("file is large");

            var dbx = new Dropbox({ accessToken: dbxAccessToken });

            const maxBlob = 4 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
            var workItems = [];

            var offset = 0;
            while (offset < file.size) {
              var chunkSize = Math.min(maxBlob, file.size - offset);
              workItems.push(file.slice(offset, offset + chunkSize));
              offset += chunkSize;
            }

            const task = workItems.reduce((acc, blob, idx, items) => {
              if (idx == 0) {
                // Starting multipart upload of file
                return acc.then(function () {
                  console.log(idx / items.length * 100 + "% uploaded");
                   
                  // progress upload 
                  let total = items.length;
                  if (total === 0) total = items.length;
                  toast.update(toastId, {
                    render: (
                      <React.Fragment>
                        Uploading file, Please wait...
                        <br />
                        <strong>{file.name}</strong>
                      </React.Fragment>
                    ),
                    type: toast.TYPE.WARNING,
                    progress: Math.floor(idx / total),
                    hideProgressBar:false,
                    autoClose:false
                  });
                  



                  return dbx.filesUploadSessionStart({ close: false, contents: blob })
                    .then(response => response.session_id)
                });
              } else if (idx < items.length - 1) {
                // Append part to the upload session

                return acc.then(function (sessionId) {
                  console.log(idx / items.length * 100 + "% uploaded");
                  var cursor = { session_id: sessionId, offset: idx * maxBlob };
                  return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId);
                });
              }
               else {
                // Last chunk of data, close session
                return acc.then(function (sessionId) {
                  console.log(100 + "% uploaded");
                  toast.update(toastId, {
                    render: (
                      <React.Fragment>
                        <strong>{file.name}</strong>             
                        <br />
                         Uploaded Successfully
                      </React.Fragment>
                    ),
                    progress: 1,
                    type: toast.TYPE.SUCCESS,
                    closeOnClick: true,
                    autoClose: 5000,
                    closeButton: true
                  });
                  var cursor = { session_id: sessionId, offset: file.size - blob.size };
                  var commit = { path: parent+'/' + file.name, mode: 'add', autorename: true, mute: false };
                  return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });
                });
              }
            },Promise.resolve());

            task.then(function (result) {

              console.log("file Uploaded");
            }).catch(function (error) {
              console.error(error);
            })
          }});
        break;
    }

  };
}

function dropboxUploadSimple(dbxAccessToken, arg,toastId,file) {

  var dbx = new Dropbox({ accessToken: dbxAccessToken });
  dbx.filesUpload(arg)
    .then(function (response) {
      console.log(response);
      toast.update(toastId, {
        render: (
          <React.Fragment>        
            <strong>{file.name}</strong>
            <br />
            Uploaded Successfully
            
          </React.Fragment>
        ),
        progress: 1,
        type: toast.TYPE.SUCCESS,
        closeOnClick: true,
        autoClose: 5000,
        closeButton: true
      });
    })
    .catch(function (error) {
      console.error(error);
    });

}