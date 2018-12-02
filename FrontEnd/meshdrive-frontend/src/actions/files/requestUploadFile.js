import { UPLOAD_FILE } from "./types";
import axios from "axios";
import startApiRequest from "../../actions/api/startApiRequest";
import finishApiRequest from "../../actions/api/finishApiRequest";
import { apiRoutes } from "../../constants/apiConstants";
import toStream from "blob-to-stream";
import request from "request";
import React from "react";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";

export const shouldUploadFile = (state, files) => {
  return {
    type: UPLOAD_FILE,
    payload: files
  };
};
export default function requestUploadFile(files, uploadFileEmail) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    const file = files[0];
    const formData = new FormData();

    formData.append("files[]", file, file.name);

    const encodedMimeType = new Buffer(file.type).toString("base64");

    const postRequest = request.post(
      apiRoutes.files.uploadFile(
        file.name,
        encodedMimeType,
        uploadFileEmail,
        token
      ),
      (err, resp, body) => {
        console.log({ err, resp, body });
      }
    );
    postRequest.on("request", req => {
      dispatch(startApiRequest());
    });
    postRequest.on("complete", response => {
      dispatch(
        finishApiRequest(
          response,
          true,
          <SweetAlertWrapper success title="Success">
            {response.body.message}
          </SweetAlertWrapper>
        )
      );
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
