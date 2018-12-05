import { REMOVE_GOOGLE_DRIVE_ACCOUNT_BY_EMAIL } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";
import fetchDriveAccountsList from "./fetchDriveAccountsList";

export const shouldRemoveGoogleDriveAccountByEmail = (state, email) => {
  const { user } = state;
  saveUserObjToLocalStorage({ ...user, driveAccountsList: {} });
  return {
    type: REMOVE_GOOGLE_DRIVE_ACCOUNT_BY_EMAIL,
    payload: { email }
  };
};

export default function requestRemoveGoogleDriveAccountByEmail(email) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    dispatch(startApiRequest());

    axios
      .delete(apiRoutes.users.removeGoogleAccountByEmail, {
        data: { token, googleAccountEmail: email }
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(shouldRemoveGoogleDriveAccountByEmail(state));
          dispatch(
            finishApiRequest(
              null,
              true,
              <SweetAlertWrapper warning title="Warning">
                {response.data.message}
              </SweetAlertWrapper>
            )
          );
          dispatch(fetchDriveAccountsList());
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
