import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import LoadingMessage from "../../utils/LoadingMessage";
// import startApiRequest from "../api/startApiRequest";
// import finishApiRequest from "../api/finishApiRequest";
// import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import navigateTo from "../filenavigation/navigateTo";
import navigateToHome from "../filenavigation/navigateToHome";
import forceReload from "../filenavigation/forceReload";
export const shouldFetchFilesAllDrives = (state, data) => {
  return {
    type: FETCH_FILES,
    payload: data
  };
};

export default function fetchRootFilesAllDrives(isForceReload = false) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;
    console.log("Starting API call from fetchRootFiles");

    const toastInfoId = toast.info(
      <LoadingMessage loaderArgs={{ color: "white" }}>
        Loading Explorer
      </LoadingMessage>,
      {
        autoClose: false
      }
    );

    // dispatch(startApiRequest());

    // const { driveAccountsList } = user;

    // const {
    //   googleDriveAccountsList = [],
    //   dropboxAccountsList = [],
    //   oneDriveAccountsList = []
    // } = driveAccountsList;
    // let postURL, listFilesAccount;
    // switch (drive) {
    //   case GOOGLEDRIVE:
    //     postURL = apiRoutes.files.listGoogleDriveRootFiles;
    //     listFilesAccount = googleDriveAccountsList;
    //     break;
    //   case ONEDRIVE:
    //     postURL = apiRoutes.files.listOneDriveRootFiles;
    //     listFilesAccount = oneDriveAccountsList;
    //     break;
    //   case DROPBOX:
    //     postURL = apiRoutes.files.dropbox_listFiles;
    //     listFilesAccount = dropboxAccountsList;
    //     break;
    // }
    // console.log(postURL);
    //debugger;

    // var path=""

    const postURL = apiRoutes.files.listRootFilesAllDrives;
    axios
      .post(postURL, {
        token
      })
      .then(response => {
        const filesData = response.data;

        // dispatch(finishApiRequest(null, true));
        toast.dismiss(toastInfoId);

        dispatch(shouldFetchFilesAllDrives(state, filesData));

        if (isForceReload) {
          dispatch(forceReload(filesData));
        } else {
          filesData.parent="root";
          dispatch(navigateTo(filesData));
          console.log("Navigating to");
        }
      })
      .catch(error => {
        console.log(error);

        toast.update(toastInfoId, {
          render: "Something went wrong while fetching files",
          type: toast.TYPE.ERROR,
          autoClose: 5000
        });

        // debugger;
        // dispatch(
        //   finishApiRequest(
        //     null,
        //     true,
        //     <SweetAlertWrapper danger title="Fail">
        //       Something went wrong while fetching files.
        //     </SweetAlertWrapper>
        //   )
        // );
      });
  };
}
