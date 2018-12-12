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
        postURL = apiRoutes.files.uploadFile(
          file.name,
          encodedMimeType,
          uploadFileEmail,
          token
        );
        break;
      case ONEDRIVE:
        // postURL = apiRoutes.
        break;

      case DROPBOX:
        postURL = apiRoutes.files.dropbox_uploadFile(
          file.name,
          "root",
          uploadFileEmail,
          token
        );
        break;
    }

    const postRequest = request.post(postURL, (err, resp, body) => {
      console.log({ err, resp, body });
    });
    postRequest.on("request", req => {
      dispatch(startApiRequest());
    });
    postRequest.on("complete", response => {
      let responseUiComponent;
      console.log({ response, statusCode: response.statusCode });
      if (response.statusCode === 200) {
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
        console.error(response);

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
