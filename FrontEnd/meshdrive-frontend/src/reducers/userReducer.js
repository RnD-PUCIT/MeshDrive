import { ADD_DRIVE, SAVE_USER, REMOVE_USER } from "../actions/user/types";

const initialUserState = {
  token: null,
  driveAccountsList: {
    googleDriveAccountsList: [],
    dropBoxAccountsList: [],
    oneDriveAccountsList: []
  }
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case REMOVE_USER:
      return initialUserState;

    case SAVE_USER:
      const { driveAccountsList = {}, token } = action.payload.data;
      return { ...state, token, driveAccountsList };

    case ADD_DRIVE:
      const { drive, email } = action.payload;
      console.log({ drive, email });
      let newState = Object.assign(state);
      switch (drive) {
        case "GOOGLEDRIVE":
          newState.driveAccountsList.googleDriveAccountsList.push(email);
          console.log(newState);
          break;
        case "DROPBOX":
          // newState.driveAccountsList.googleDriveAccountsList.push(email);
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
