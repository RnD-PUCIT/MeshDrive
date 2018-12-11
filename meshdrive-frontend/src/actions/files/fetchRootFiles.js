import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import navigateTo from "../../actions/filenavigation/navigateTo";
import navigateToHome from "../../actions/filenavigation/navigateToHome";
import forceReload from "../../actions/filenavigation/forceReload";
export const shouldFetchFiles = (state, data) => {
  return {
    type: FETCH_FILES,
    payload: data
  };
};

export default function fetchRootFiles(drive, isForceReload = false) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;
    console.log("Starting API call from fetchRootFiles");
    dispatch(startApiRequest());

    const { driveAccountsList } = user;

    const {
      googleDriveAccountsList = [],
      dropBoxAccountsList = [],
      oneDriveAccountsList = []
    } = driveAccountsList;

    const listFilesAccount = googleDriveAccountsList.concat(
      dropBoxAccountsList.concat(oneDriveAccountsList)
    );

    let postURL;
    switch (drive) {
      case GOOGLEDRIVE:
        postURL = apiRoutes.files.listGoogleDriveRootFiles;
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
        token,
        listFilesAccount
      })
      .then(response => {
        const data = response.data;
        dispatch(finishApiRequest(null, true));
        dispatch(shouldFetchFiles(state, data));
        if (isForceReload) {
          dispatch(
            forceReload({
              parent: "root",
              items: data,
              drive,
              listFilesAccount
            })
          );
        } else {
          dispatch(
            navigateTo({ parent: "root", items: data, drive, listFilesAccount })
          );
          console.log("Navigating to");
        }
      })
      .catch(error => {
        console.log(error);
        debugger;
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
