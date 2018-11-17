import { SAVE_TOKEN } from "./types";

export default function saveToken(token) {
  return dispatch => {
    dispatch({
      type: SAVE_TOKEN,
      payload: { token }
    });
  };
}
