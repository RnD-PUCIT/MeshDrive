import { ADD_DRIVE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
function addDriveAction(drive, email) {
  return {
    type: ADD_DRIVE,
    payload: { drive, email }
  };
}

export default function addDrive(token, drive, email = null) {
  return dispatch => {
    dispatch(startApiRequest());
    console.log("STARTING ADDING DRIVE");
    let authLink;
    switch (drive) {
      case "GOOGLEDRIVE":
        authLink = apiRoutes.users.authGoogleDrive;
        break;
    }
    if (email) {
      dispatch(addDriveAction(drive, email));
      dispatch(finishApiRequest());
    } else {
      axios
        .post(authLink, {
          redirectSuccess: "http://localhost:3000/#/managedrives/added/",
          redirectFailure: "http://localhost:3000/#/managedrives/failed/",
          token
        })
        .then(
          response => {
            const { redirectLink } = response.data;
            // redirect to consent screen
            window.location = redirectLink;
          },
          error => {
            dispatch(finishApiRequest());
            console.log(error);
          }
        );
    }
  };
}
