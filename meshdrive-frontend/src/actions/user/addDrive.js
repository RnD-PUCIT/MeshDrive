import { ADD_DRIVE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import { rootURL } from "../../constants/apiConstants";
import { GOOGLEDRIVE, ONEDRIVE, DROPBOX } from "../../constants/strings";
function addDriveAction(drive, email) {
  return {
    type: ADD_DRIVE,
    payload: { drive, email }
  };
}

export default function addDrive(token, drive) {
  return dispatch => {
    dispatch(startApiRequest());
    let authLink;
    switch (drive) {
      case GOOGLEDRIVE:
        authLink = apiRoutes.users.authGoogleDrive;
        break;
      case DROPBOX:
        authLink = apiRoutes.users.authDropbox;
        break;
      case ONEDRIVE:
        authLink = apiRoutes.users.authOneDrive;
        break;
    }
    axios
      .post(authLink, {
        redirectSuccess: `${rootURL}/#/managedrives/added`,
        redirectFailure: `${rootURL}/#/managedrives/failed`,
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
