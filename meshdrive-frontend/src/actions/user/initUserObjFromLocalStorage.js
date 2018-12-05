import { SAVE_USER } from "./types";
import getUserObjFromLocalStorage from '../../utils/getUserObjFromLocalStorage'

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
