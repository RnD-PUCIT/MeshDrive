import { SET_ACTIVE_FILE } from "../actions/activeFilesIds/types";
import { UNSET_ACTIVE_FILE } from "../actions/activeFilesIds/types";

const initialActiveFileIdsState = [];
export default function(state = initialActiveFileIdsState, action) {
  switch (action.type) {
    case SET_ACTIVE_FILE:
      return [...state, action.payload];

    case UNSET_ACTIVE_FILE:
      const newState = Object.assign([], state);
      const indexOfFilesToDelete = state.findIndex(fileId => {
        return fileId === action.payload;
      });
      newState.splice(indexOfFilesToDelete, 1);
      return newState;
  }
  return state;
}
