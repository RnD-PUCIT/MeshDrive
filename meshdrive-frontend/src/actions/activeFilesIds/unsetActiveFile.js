import { UNSET_ACTIVE_FILE } from "./types";

export default function setActiveFile(fileId) {
  return dispatch => {
    dispatch({
      type: UNSET_ACTIVE_FILE,
      payload: fileId
    });
  };
}
