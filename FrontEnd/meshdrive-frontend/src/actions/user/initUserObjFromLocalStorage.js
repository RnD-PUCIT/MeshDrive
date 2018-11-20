import { SAVE_USER } from "./types";
import { localStorageUserObjString } from "../../constants/strings";

function getUserObjFromLocalStorage() {
  const { localStorage } = window;
  const userObj = JSON.parse(localStorage.getItem(localStorageUserObjString));
  return userObj;
}

export default function initToken() {
  const userOjb = getUserObjFromLocalStorage();
  return dispatch => {
    if (userOjb) {
      dispatch({
        type: SAVE_USER,
        payload: userOjb
      });
    }
  };
}
