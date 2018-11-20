import { REMOVE_USER } from "./types";
import removeUserObjFromLocalStorage from "../../utils/removeUserObjFromLocalStorage";
export default function removeUserObj() {
  return dispatch => {
    removeUserObjFromLocalStorage();
    dispatch({
      type: REMOVE_USER
    });
  };
}
