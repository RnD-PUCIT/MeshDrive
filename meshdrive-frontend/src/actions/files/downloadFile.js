import React from "react";
import { DOWNLOAD_FILE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import { Dropbox } from "dropbox";
import googleDownloadFileRequest from "./GoogleDrive/downloadFileRequest";
import onedriveDownloadFileRequest from "./OneDrive/downloadFileRequest";

import { toast } from "react-toastify";
import LoadingMessage from "../../utils/LoadingMessage";

var download = require("downloadjs");
var https = require("https");

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

    const toastId = toast.info(
      <LoadingMessage loaderArgs={{ color: "white" }}>
        Preparing file to download
      </LoadingMessage>,
      {
        progress: 0,
        closeOnClick: false,
        autoClose: false,
        closeButton: false
      }
    );

    switch (drive.toUpperCase()) {
      case GOOGLEDRIVE:
        googleDownloadFileRequest(
          downloadFileAccount,
          file,
          user,
          progressEvent => {
            let { loaded, total } = progressEvent;
            if (total === 0) total = file.size;
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  Downloading file, Please wait...
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              type: toast.TYPE.WARNING,
              progress: loaded / total
            });
          }
        )
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            console.log(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  File Downloaded Successfully
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              progress: 1,
              type: toast.TYPE.SUCCESS,
              closeOnClick: true,
              autoClose: 5000,
              closeButton: true
            });
          })
          .catch(err => {
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  Something went wrong, please try again
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              progress: 0,
              type: toast.TYPE.ERROR,
              closeOnClick: true,
              autoClose: 5000,
              closeButton: true
            });
            console.error(err);
          });

        // let googleDriveEmail = downloadFileAccount;
        // console.log("download req starts");
        // axios({
        //   url: apiRoutes.files.google_downloadFileMetadata(
        //     googleDriveEmail,
        //     file.id,
        //     token
        //   ),
        //   method: "GET",
        //   headers: { "Content-Type": "application/json" },
        //   responseType: "blob" // important
        // }).then(response => {
        //   console.log({ response });

        // console.log("download req ends");
        // const blob = new Blob([response.data], { type: response.data.type });
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement("a");
        // link.href = url;
        // const fileName = response.headers["file-name"];
        // link.setAttribute("download", fileName);
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        // window.URL.revokeObjectURL(url);
        // });
        break;
      case ONEDRIVE:
        onedriveDownloadFileRequest(
          downloadFileAccount,
          file,
          user,
          progressEvent => {
            let { loaded, total } = progressEvent;
            if (total === 0) total = file.size;
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  Downloading file, Please wait...
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              type: toast.TYPE.WARNING,
              progress: loaded / total
            });
          }
        )
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            console.log(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  File Downloaded Successfully
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              progress: 1,
              type: toast.TYPE.SUCCESS,
              closeOnClick: true,
              autoClose: 5000,
              closeButton: true
            });
          })
          .catch(err => {
            toast.update(toastId, {
              render: (
                <React.Fragment>
                  Something went wrong, please try again
                  <br />
                  <strong>{file.name}</strong>
                </React.Fragment>
              ),
              progress: 0,
              type: toast.TYPE.ERROR,
              closeOnClick: true,
              autoClose: 5000,
              closeButton: true
            });
            console.error(err);
          });

        //   let oneDriveEmail = downloadFileAccount;
        //   axios({
        //     url: apiRoutes.files.onedrive_downloadFile(
        //       oneDriveEmail,
        //       file.id,
        //       token
        //     ),
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        //     responseType: "blob" // important
        //   }).then(response => {
        //     const blob = new Blob([response.data], { type: response.data.type });
        //     const url = window.URL.createObjectURL(blob);
        //     const link = document.createElement("a");
        //     link.href = url;
        //     const fileName = response.headers["file-name"];
        //     link.setAttribute("download", fileName);
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
        //     window.URL.revokeObjectURL(url);
        //   });
        break;
      case DROPBOX:
        let dropboxAccountEmail = downloadFileAccount;

        console.log("In download Action : ");
        console.log(dropboxAccountEmail);
        console.log(drive);
        console.log(file);

        axios({
            url:apiRoutes.files.dropbox_account_token,
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
                window.location.href = res.link;
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(error => {
            console.log(error);
          });
        break;
    }
  };
}
