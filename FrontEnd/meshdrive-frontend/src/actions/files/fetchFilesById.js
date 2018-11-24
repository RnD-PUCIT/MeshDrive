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
  console.log(data);
  debugger;
  return {
    type: FETCH_FILES,
    payload: data
  };
};

export default function fetchFilesById(downloadFileAccount, fileId) {
  return dispatch => {
    // getting stored data from redux
    const token = getTokenFromStore();

    console.log("Starting API call from fetchRootFiles");
    dispatch(startApiRequest());

    axios
      .post(apiRoutes.files.listDriveFilesById, {
        downloadFileAccount,
        fileId,
        token
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
