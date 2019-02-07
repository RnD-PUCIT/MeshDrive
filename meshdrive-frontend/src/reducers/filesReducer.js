import {
  FETCH_FILES,
  UPLOAD_FILE,
  DELETE_FILE,
  DOWNLOAD_FILE,
  FETCH_FILE_TAG
  // TOGGLE_FILE_ACTIVE,
} from "../actions/files/types";

const initialFilesState = {
  parent: "",
  files: []
};

export default function(state = initialFilesState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FILES: {
      return payload;
    }

    case UPLOAD_FILE:
      return { ...state, files: [...state.files, payload.files] };

    case DELETE_FILE: {
      const newState = Object.assign([], state);
      const indexOfFileToDelete = state.files.findIndex(file => {
        return file.id == payload;
      });
      newState.files.splice(indexOfFileToDelete, 1);
      return newState;
    }

    case DOWNLOAD_FILE: {
      return state;
    }

    case FETCH_FILE_TAG: {
      let fileInfo = action.file;
      let tagsList = action.payload;

      state.files.forEach(file => {
        if (file.id === fileInfo.fileId) {
          file.tagsList = tagsList;
        }
      });

      return state;
    }

    default:
      return state;
  }
}
