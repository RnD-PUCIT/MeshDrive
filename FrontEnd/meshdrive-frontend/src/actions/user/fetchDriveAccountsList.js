import { FETCH_DRIVE_ACCOUNTS_LIST } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";

export const shouldFetchDriveAccountsList = (state, driveAccountsList) => {
  const { user } = state;
  saveUserObjToLocalStorage({ ...user, ...driveAccountsList });
  return {
    type: FETCH_DRIVE_ACCOUNTS_LIST,
    payload: driveAccountsList
  };
};

export default function fetchDriveAccountsList() {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    dispatch(startApiRequest());

    axios
      .get(apiRoutes.users.listDriveAccounts(token))
      .then(response => {
        const driveAccountsList = response.data;

        dispatch(shouldFetchDriveAccountsList(state, driveAccountsList));

        dispatch(finishApiRequest(null, true));
      })
      .catch(error => {
        console.error(error);
        dispatch(
          finishApiRequest(
            null,
            true,
            <SweetAlertWrapper danger title="Fail">
              {error.message}
            </SweetAlertWrapper>
          )
        );
      });
  };
}
