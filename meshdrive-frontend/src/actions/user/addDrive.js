import { ADD_DRIVE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import { rootURL } from "../../constants/apiConstants";
import { getUserReducer } from "../../utils/getTokenFromStore";
import saveUserObj from "../user/saveUserObj";

export default function addDrive(token, drive) {
  return dispatch => {
    dispatch(startApiRequest());
    let authLink;
    switch (drive) {
      case "GOOGLEDRIVE":
        authLink = apiRoutes.users.authGoogleDrive;
        break;
        case "DROPBOX":
        authLink = apiRoutes.users.authDropbox;
        break;
    }
    axios
      .post(authLink, {
        redirectSuccess: `${rootURL}/#/managedrives/added/`,
        redirectFailure: `${rootURL}/#/managedrives/failed/`,
        token
      })
      .then(
        response => {
          const { redirectLink } = response.data;
          window.location = redirectLink;
        },
        error => {
          dispatch(finishApiRequest());
          console.log(error);
        }
      );
  };
}
