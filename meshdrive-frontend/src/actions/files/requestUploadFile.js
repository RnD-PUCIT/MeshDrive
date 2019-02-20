import { UPLOAD_FILE } from "./types";
import axios from "axios";
import startApiRequest from "../../actions/api/startApiRequest";
import finishApiRequest from "../../actions/api/finishApiRequest";
import { apiRoutes } from "../../constants/apiConstants";
import toStream from "blob-to-stream";
import request from "request";
import React from "react";
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
        postURL = apiRoutes.files.dropbox_uploadFile(
          file.name,
          "root",
          dropboxAccountEmail,
          token
        );
        break;
    }

    if (!postURL) return;

    const postRequest = request.post(postURL, (err, resp, body) => {
      console.log({ err, resp, body });
    });
    postRequest.on("request", req => {
      dispatch(startApiRequest());
    });
    postRequest.on("complete", response => {
      let responseUiComponent;
      console.log("CONSOLEEEEEE", {
        response,
        statusCode: response.statusCode
      });
      if (response.statusCode === 200) {
        window.location = `${rootURL}/#/uploadfile`;
        responseUiComponent = (
          <SweetAlertWrapper success title="Success">
            {response.body.message}
          </SweetAlertWrapper>
        );
      } else {
        responseUiComponent = (
          <SweetAlertWrapper danger title="Error">
            {response.body.message}
          </SweetAlertWrapper>
        );
      }

      dispatch(finishApiRequest(response, true, responseUiComponent));

      postRequest.on("error", response => {
        console.error("ERRRRROOOR " + response);
        dispatch(
          finishApiRequest(
            response,
            true,
            <SweetAlertWrapper danger title="Error">
              An error occured during upload file.
            </SweetAlertWrapper>
          )
        );
      });
    });

    postRequest.on("pipe", src => {
      // console.log("PIPE START", src);
      console.log(`Progress: 0%`);
    });

    const stream = toStream(file);

    stream.pipe(postRequest);
  };
}
