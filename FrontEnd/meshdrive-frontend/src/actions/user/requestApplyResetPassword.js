// module imports
import React from "react";
import axios from "axios";

// custom module imports
import { REQUEST_RESET_PASSWORD } from "./types";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";

export const resetPassword = response => {
  return {
    type: REQUEST_RESET_PASSWORD,
    payload: response
  };
};

export default function requestApplyResetPassword(id, newPassword) {
  return dispatch => {
    console.log("Dispatching startApiRequest from requestResetPassword");
    dispatch(startApiRequest());
    console.log(id);

    axios
      .post(apiRoutes.users.applyResetPassword(id), {
        newPassword
      })
      .then(
        response => {
          const statusCode = response.status;

          let responseUiComponent;

          switch (statusCode) {
            case 200:
              responseUiComponent = (
                <SweetAlertWrapper
                  success
                  title="Success"
                  onConfirm={() => (window.location = "/")}
                >
                  {response.data.message}
                </SweetAlertWrapper>
              );
              break;
            case 400:
              responseUiComponent = (
                <SweetAlertWrapper danger title="Fail">
                  {response.data.message}
                </SweetAlertWrapper>
              );
              break;
          }

          console.log(
            "Dispatching finishApiRequest from requestResetPassword succes"
          );

          dispatch(finishApiRequest(response, true, responseUiComponent));
          // dispatch(resetPassword(response));
        },
        error => {
          // const statusCode = error.response.status;
          console.log(error);
          const responseUiComponent = (
            <SweetAlertWrapper danger title="Fail">
              {error &&
              error.response &&
              error.response.data &&
              error.response.data.message
                ? error.response.data.message
                : "Something went wrong, please try again"}
            </SweetAlertWrapper>
          );

          console.log(
            "Dispatching finishApiRequest from requestResetPassword error"
          );

          dispatch(finishApiRequest(error.response, true, responseUiComponent));
        }
      );
  };
}
