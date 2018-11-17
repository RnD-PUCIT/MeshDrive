import { REMOVE_TOKEN } from "./types";

export default function removeToken() {
  return dispatch => {
    dispatch({
      type: REMOVE_TOKEN
    });
  };
}
