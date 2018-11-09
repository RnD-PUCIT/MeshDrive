import { REQUEST_FORGOT_PASSWORD } from "./types";
import axios from "axios";
import { apiBaseUrl } from "../../constants/apiConstants";

export const forgotPassword = response => {
  return {
    type: REQUEST_FORGOT_PASSWORD,
    payload: response
  };
};

export default function requestForgotPassword(email) {
  return dispatch => {
    {
      axios
        .get(`${apiBaseUrl}/users/forgotPassword/${email}`)
        .then(response => dispatch(forgotPassword(response)))
        .catch(function(error) {
          console.log(error);
        });
    }
  };
}
