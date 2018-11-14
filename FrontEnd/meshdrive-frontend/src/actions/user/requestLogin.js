// module imports
import React from "react";
import axios from "axios";

// custom module imports
import { REQUEST_LOGIN } from "./types";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";

export const login = response => {
  return {
    type: REQUEST_LOGIN,
    payload: response
  };
};

export default function requestLogin(email, password) {
  return dispatch => {
    console.log("Dispatching startApiRequest from requestLogin");
    dispatch(startApiRequest());

    axios
      .post(apiRoutes.users.login, {
        email,
        password
      })
      .then(
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
            case 201:
              responseUiComponent = (
                <SweetAlertWrapper warning title="Warning">
                  Invalid Email or Password
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

          console.log("Dispatching finishApiRequest from requestLogin succes");

          dispatch(finishApiRequest(response, true, responseUiComponent));
          dispatch(login(response));
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

          console.log("Dispatching finishApiRequest from requestLogin error");

          dispatch(finishApiRequest(error.response, true, responseUiComponent));
        }
      );
  };
}
