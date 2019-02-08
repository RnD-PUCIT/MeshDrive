import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import navigateTo from "../../actions/filenavigation/navigateTo";
import forceReload from "../../actions/filenavigation/forceReload";

export const shouldFetchFilesById = (state, data) => {
  console.log(data);
  debugger;
  return {
    type: FETCH_FILES,
    payload: data
  };
};

export default function fetchFilesById(
  drive,
  listFilesAccount,
  fileId,
  isForceReload = false,
  path = "" // for dropbox only
) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log("Starting API call from fetchFilesById");
    dispatch(startApiRequest());

    let postURL, postData;
    switch (drive.toUpperCase()) {
      case GOOGLEDRIVE:
        let googleDriveEmail = listFilesAccount;
        postURL = apiRoutes.files.listDriveFilesById;
        postData = {
          googleDriveEmail,
          fileId,
          token
        };
        break;
      case ONEDRIVE:
        let oneDriveEmail = listFilesAccount;
        postURL = apiRoutes.files.onedrive_listDriveFilesById;
        postData = {
          oneDriveEmail,
          fileId,
          token
        };
        break;

      case DROPBOX:
        postURL = apiRoutes.files.dropbox_listFiles;
        postData = {
          dropboxAccountEmail: listFilesAccount,
          path: fileId,
          token
        };
        break;
    }
    console.log({ drive, postURL });
    axios
      .post(postURL, postData)
      .then(response => {
        const data = response.data;

        // sort files
        dispatch(finishApiRequest(null, true));
        dispatch(shouldFetchFilesById(state, data));

        // const navigationPayload = {
        //   parent: fileId,
        //   items: data,
        //   drive,
        //   listFilesAccount,
        //   path // for dropbox only
        // };
        // debugger;
        if (isForceReload) {
          dispatch(forceReload(data));
        } else {
          dispatch(navigateTo(data));
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(
          finishApiRequest(
            null,
            true,
            <SweetAlertWrapper danger title="Fail">
              Something went wrong while fetching files.
            </SweetAlertWrapper>
          )
        );
      });
  };
}
