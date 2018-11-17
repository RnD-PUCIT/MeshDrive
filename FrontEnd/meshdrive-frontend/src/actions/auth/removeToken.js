import { REMOVE_TOKE } from "./types";

export default function removeToken() {
  return dispatch => {
    dispatch({
      type: REMOVE_TOKE
    });
  };
}
