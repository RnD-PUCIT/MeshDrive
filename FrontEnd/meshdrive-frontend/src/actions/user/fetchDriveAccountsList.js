import { FETCH_DRIVE_ACCOUNTS_LIST } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";
import getTokenFromStore, {
  getUserReducer
} from "../../utils/getTokenFromStore";

export const fetchDriveAccountsListActionCreator = driveAccountsList => {
  return {
    type: FETCH_DRIVE_ACCOUNTS_LIST,
    payload: driveAccountsList
  };
};

export default function fetchDriveAccountsList() {
  return dispatch => {
    // getting stored data from redux
    const token = getTokenFromStore();

    console.log("Starting API call from fetchDriveAccountsList");
    dispatch(startApiRequest());

    axios
      .get(apiRoutes.users.listDriveAccounts(token))
      .then(response => {
        const driveAccountsList = response.data;

        const userReducer = getUserReducer();
        saveUserObjToLocalStorage({ ...userReducer, ...driveAccountsList });
        dispatch(fetchDriveAccountsListActionCreator(driveAccountsList));
        dispatch(finishApiRequest(null, true));
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
