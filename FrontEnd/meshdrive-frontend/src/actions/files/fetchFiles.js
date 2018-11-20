import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import store from "../../store";

export const setFiles = files => {
  console.log(files);
  const drives = ["googledrive", "onedrive", "dropbox"];
  files.forEach((file, i) => {
    file.drive = drives[i % 3];
    file.active = false;
  });

  return {
    type: FETCH_FILES,
    payload: files
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
    const globalState = store.getState();
    const { user } = globalState;
    const { token } = user;

    if (!token) return;

    console.log("Starting API call from fetchFiles");
    dispatch(startApiRequest());

    axios
      .post(apiRoutes.users.listGoogleDriveFiles, {
        token,
        listFilesAccount: "bilalyasin1616@gmail.com"
      })
      .then(response => {
        const files = response.data;
        // sort files
        dispatch(finishApiRequest(null, true));
        dispatch(setFiles(files));
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
