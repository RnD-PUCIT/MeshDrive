import { SAVE_USER } from "../user/types";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";

export default function saveUserObj(userObj) {
  return dispatch => {
    saveUserObjToLocalStorage(userObj);
    dispatch({
      type: SAVE_USER,
      payload: userObj
    });
  };
}
