import {
  FETCH_FILES,
  UPLOAD_FILE,
  DELETE_FILE
  // TOGGLE_FILE_ACTIVE,
} from "../actions/files/types";

const initialFilesState = [];

export default function(state = initialFilesState, action) {
  switch (action.type) {
    case FETCH_FILES:
      return [...action.payload];

    case UPLOAD_FILE:
      console.log(action);
      return [action.payload];

    case DELETE_FILE: {
      const newState = Object.assign([], state);
      const indexOfFileToDelete = state.findIndex(files => {
        return files.id == action.payload;
      });
      newState.splice(indexOfFileToDelete, 1);
      return newState;
    }

    default:
      return state;
  }
}
