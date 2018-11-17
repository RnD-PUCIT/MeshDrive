import { SAVE_TOKEN } from "./types";
import { localStorageTokenString } from "../../constants/strings";
function saveTokenToLocalStorage(token) {
  const { localStorage } = window;
  localStorage.setItem(localStorageTokenString, token);
}

export default function saveToken(token) {
  return dispatch => {
    saveTokenToLocalStorage(token);
    dispatch({
      type: SAVE_TOKEN,
      payload: { token }
    });
  };
}
