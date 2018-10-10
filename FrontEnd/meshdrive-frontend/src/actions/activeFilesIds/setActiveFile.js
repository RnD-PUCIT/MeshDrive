import { SET_ACTIVE_FILE } from "./types";

export default function setActiveFile(fileId) {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_FILE,
      payload: fileId
    });
  };
}
