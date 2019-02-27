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
export const shouldUploadFile = (state, files) => {
  return {
    type: UPLOAD_FILE,
    payload: files
  };
};
export default function requestUploadFile(drive, files, uploadFileEmail) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    const file = files[0];
    const formData = new FormData();

    formData.append("files[]", file, file.name);

    const encodedMimeType = new Buffer(file.type).toString("base64");

    let postURL;
    switch (drive) {
      case GOOGLEDRIVE:
        uploadFileRequest(uploadFileEmail, files, user, progressEvent => {
          console.log(progressEvent);
        });

        // let googleDriveEmail = uploadFileEmail;
        // postURL = apiRoutes.files.uploadFile(
        //   file.name,
        //   encodedMimeType,
        //   googleDriveEmail,
        //   token
        // );
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
          var arg = {
            path: '/' + file.name,
            contents: file,
            autorename: true
          }

          if (file.size < UPLOAD_FILE_SIZE_LIMIT) { //file size less than 4 mb simple upload 
            dropboxUploadSimple(dbxAccessToken, arg);
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

                  var cursor = { session_id: sessionId, offset: file.size - blob.size };
                  var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };
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

function dropboxUploadSimple(dbxAccessToken, arg) {

  var dbx = new Dropbox({ accessToken: dbxAccessToken });
  dbx.filesUpload(arg)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });

}