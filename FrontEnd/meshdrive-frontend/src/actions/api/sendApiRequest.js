// module imports
import axios from "axios";

// custom module imports
import { SEND_API_REQUEST } from "./types";
import startApiRequest from "./startApiRequest";
import finishApiRequest from "./finishApiRequest";
import { apiRoutes } from "../../constants/apiConstants";
// export const sendApiRequestActionCreator = response => {
//   return {
//     type: REQUEST_LOGIN,
//     payload: response
//   };
// };

export default function sendApiRequest(args) {
  /*
  method: 'POST' | 'GET'
  url : 'url'
  params: {key: 'value'}
  success: f()
  fail: f()
  */

  return dispatch => {
    console.log("Dispatching startApiRequest from SEND_API_REQUEST");
    dispatch(startApiRequest());

    const {
      method = "GET",
      url = "",
      params = null,
      success = null,
      fail = null
    } = args;

    const axiosConfig = {
      url,
      method: method.toLowerCase(),
      baseUrl: apiRoutes.baseUrl,
      params
    };

    switch (method.toUpperCase()) {
      case "GET":
        axios.create(axiosConfig).get(url);
        console.log(axiosConfig);
        break;
      case "POST":
      case "PUT":
      case "PATCH":
        axiosConfig.data = params;
        break;
    }
  };
}
