import { REQUEST_FORGOT_PASSWORD } from "./types";
import axios from "axios";
import { apiBaseUrl } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";

export const forgotPassword = response => {
  return {
    type: REQUEST_FORGOT_PASSWORD,
    payload: response
  };
};

export default function requestForgotPassword(email) {
  return dispatch => {
    dispatch(startApiRequest());
    axios
      .get(`${apiBaseUrl}/users/forgotPassword/${email}`)
      .then(response => {
        dispatch(finishApiRequest(response));
        dispatch(forgotPassword(response));
      })
      .catch(function(error) {
        console.log(error);
        dispatch(finishApiRequest());
      });
  };
}
