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
  isForceReload = false
) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log("Starting API call from fetchRootFiles");
    dispatch(startApiRequest());

    let postURL;
    switch (drive) {
      case GOOGLEDRIVE:
        postURL = apiRoutes.files.listDriveFilesById;
        break;
      case ONEDRIVE:
        // postURL = apiRoutes.
        break;

      case DROPBOX:
        // postURL = apiRoutes.
        break;
    }
    axios
      .post(postURL, {
        listFilesAccount,
        fileId,
        token
      })
      .then(response => {
        const data = response.data;
        // sort files
        dispatch(finishApiRequest(null, true));
        dispatch(shouldFetchFilesById(state, data));
        if (isForceReload) {
          dispatch(
            forceReload({
              parent: fileId,
              items: data,
              drive,
              listFilesAccount
            })
          );
        } else {
          dispatch(
            navigateTo({ parent: fileId, items: data, drive, listFilesAccount })
          );
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
