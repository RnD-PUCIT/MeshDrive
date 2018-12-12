import {
  ADD_DRIVE,
  SAVE_USER,
  REMOVE_USER,
  FETCH_DRIVE_ACCOUNTS_LIST
} from "../actions/user/types";
import getUserObjFromLocalStorage from "../utils/getUserObjFromLocalStorage";

let initialUserState = {
  token: null,
  driveAccountsList: {
    googleDriveAccountsList: [],
    dropboxAccountsList: [],
    oneDriveAccountsList: []
  }
};

const localStorageUserObj = getUserObjFromLocalStorage();
if (localStorageUserObj && localStorageUserObj.data) {
  const { token = null, driveAccountsList = {} } = localStorageUserObj;
  initialUserState = {
    token,
    driveAccountsList
  };
  console.log(initialUserState);
  debugger;
}

export default function(state = initialUserState, action) {
  switch (action.type) {
    case FETCH_DRIVE_ACCOUNTS_LIST:
      return { ...state, ...action.payload };

    case REMOVE_USER:
      return initialUserState;

    case SAVE_USER:
      const { driveAccountsList = {}, token = null } = action.payload;
      console.log(token);

      return { ...state, token, driveAccountsList };

    case ADD_DRIVE:
      const { drive, email } = action.payload;
      console.log(drive, email);
      let newState = Object.assign(state);
      switch (drive) {
        case "GOOGLEDRIVE":
          if (email)
            newState.driveAccountsList.googleDriveAccountsList.push(email);
          break;
        case "DROPBOX":
          newState.driveAccountsList.dropboxAccountsList.push(email);
          break;
        case "ONEDRIVE":
          // newState.driveAccountsList.googleDriveAccountsList.push(email);
          break;
      }
      console.log(newState);

      return newState;
  }
  return state;
}
