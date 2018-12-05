import { REMOVE_ALL_GOOGLE_DRIVE_ACCOUNTS } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";

export const shouldRemoveAllGoogleDriveAccounts = state => {
  const { user } = state;
  saveUserObjToLocalStorage({ ...user, driveAccountsList: {} });
  return {
    type: REMOVE_ALL_GOOGLE_DRIVE_ACCOUNTS,
    payload: {}
  };
};

export default function requestRemoveAllGoogleDriveAccounts() {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    dispatch(startApiRequest());

    axios
      .delete(apiRoutes.users.removeAllGoogleAccounts, { data: { token } })
      .then(response => {
        if (response.status === 200) {
          dispatch(shouldRemoveAllGoogleDriveAccounts(state));
          dispatch(
            finishApiRequest(
              null,
              true,
              <SweetAlertWrapper warning title="Warning">
                {response.data.message}
              </SweetAlertWrapper>
            )
          );
        } else {
          dispatch(
            finishApiRequest(
              null,
              true,
              <SweetAlertWrapper warning title="Warning">
                {response.data.message}
              </SweetAlertWrapper>
            )
          );
        }
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
