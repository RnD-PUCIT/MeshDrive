import { SAVE_TOKEN } from "./types";
import { localStorageTokenString } from "../../constants/strings";

function getTokenFromLocalStorageToken() {
  const { localStorage } = window;
  const token = localStorage.getItem(localStorageTokenString);
  return token;
}

export default function initToken() {
  const token = getTokenFromLocalStorageToken();
  return dispatch => {
    if (token) {
      dispatch({
        type: SAVE_TOKEN,
        payload: { token }
      });
    }
  };
}
