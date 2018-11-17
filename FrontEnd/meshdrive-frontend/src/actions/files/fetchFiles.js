import { FETCH_FILES } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
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
    dispatch(startApiRequest());

    axios
      .get("https://mysterious-plains-65246.herokuapp.com/ListDriveFiles")
      .then(files => {
        const json = files.json();
        // sort files
        dispatch(finishApiRequest(null, true));
        dispatch(setFiles(files));
      })
      .catch(error => {
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
