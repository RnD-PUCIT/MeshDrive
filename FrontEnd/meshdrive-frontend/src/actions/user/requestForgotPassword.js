import { REQUEST_FORGOT_PASSWORD } from "./types";
import axios from "axios";
import { apiBaseUrl } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";

import React from "react";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";

export const forgotPassword = response => {
  return {
    type: REQUEST_FORGOT_PASSWORD,
    payload: response
  };
};

export default function requestForgotPassword(email) {
  return dispatch => {
    console.log("Dispatching startApiRequest from requestForgotPassword");
    dispatch(startApiRequest());

    axios.get(`${apiBaseUrl}/users/forgotPassword/${email}`).then(
      response => {
        const statusCode = response.status;

        let responseUiComponent;

        switch (statusCode) {
          case 200:
            responseUiComponent = (
              <SweetAlertWrapper success title="Success">
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
          "Dispatching finishApiRequest from requestForgotPassword succes"
        );

        dispatch(finishApiRequest(response, true, responseUiComponent));
        dispatch(forgotPassword(response));
      },
      error => {
        // const statusCode = error.response.status;
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
          "Dispatching finishApiRequest from requestForgotPassword error"
        );

        dispatch(finishApiRequest(error.response, true, responseUiComponent));
      }
    );
  };
}
