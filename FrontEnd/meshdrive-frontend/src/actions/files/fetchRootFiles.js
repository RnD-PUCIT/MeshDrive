import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import getTokenFromStore from "../../utils/getTokenFromStore";
import { getUserReducer } from "../../utils/getTokenFromStore";

export const setFiles = data => {
  return {
    type: FETCH_FILES,
    payload: data
  };
};

export default function fetchFiles() {
  // let dummyFiles = [];
  // for (let i = 0; i < 100; i++) {
  //   const file = {
  //     id: uuid,
  //     name: `File ${i}`
  //   };
  //   dummyFiles = [...dummyFiles, file];
  // }

  return dispatch => {
    // getting stored data from redux
    const token = getTokenFromStore();

    console.log("Starting API call from fetchRootFiles");
    dispatch(startApiRequest());

    const { driveAccountsList } = getUserReducer();

    const {
      googleDriveAccountsList = [],
      dropBoxAccountsList = [],
      oneDriveAccountsList = []
    } = driveAccountsList;

    const listFilesAccount = googleDriveAccountsList.concat(
      dropBoxAccountsList.concat(oneDriveAccountsList)
    );

    axios
      .post(apiRoutes.files.listGoogleDriveRootFiles, {
        token,
        listFilesAccount
      })
      .then(response => {
        const data = response.data;
        // sort files
        dispatch(finishApiRequest(null, true));
        dispatch(setFiles(data));
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

    // return dispatch(setFiles(dummyFiles));
  };
}
