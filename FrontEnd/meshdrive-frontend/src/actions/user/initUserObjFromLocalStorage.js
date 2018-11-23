import { SAVE_USER } from "./types";
import { LOCAL_STORAGE_USER_OBJECT_STRING } from "../../constants/strings";

function getUserObjFromLocalStorage() {
  const { localStorage } = window;
  const userObj = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_OBJECT_STRING)
  );
  return userObj;
}

export default function initToken() {
  return dispatch => {
    const userOjb = getUserObjFromLocalStorage();

    if (userOjb) {
      dispatch({
        type: SAVE_USER,
        payload: userOjb
      });
    }
  };
}
