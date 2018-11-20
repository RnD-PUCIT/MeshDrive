import { ADD_DRIVE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";

function addDriveAction(drive, email) {
  return {
    type: ADD_DRIVE,
    payload: { drive, email }
  };
}

export default function addDrive(token, drive, email = null) {
  return dispatch => {
    let authLink;
    switch (drive) {
      case "GOOGLEDRIVE":
        authLink = apiRoutes.users.authGoogleDrive;
        break;
    }
    if (email) {
      dispatch(addDriveAction(drive, email));
    } else {
      axios
        .post(authLink, {
          redirectSuccess: "http://localhost:3000/#/managedrives/added/",
          redirectFailure: "http://localhost:3000/#/managedrives/failed/",
          token
        })
        .then(response => {
          const { redirectLink } = response.data;
          // redirect to consent screen
          window.location = redirectLink;
        });
    }
  };
}
