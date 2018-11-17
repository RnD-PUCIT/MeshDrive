import { REMOVE_TOKEN } from "./types";
import { localStorageTokenString } from "../../constants/strings";
function removeTokenFromLocalStorage() {
  const { localStorage } = window;
  localStorage.setItem(localStorageTokenString, null);
  localStorage.removeItem(localStorageTokenString);
  localStorage.clear();
}
export default function removeToken() {
  return dispatch => {
    removeTokenFromLocalStorage();
    dispatch({
      type: REMOVE_TOKEN
    });
  };
}
