import { INTRUPT_API_REQUEST } from "./types";

export default function intruptApiRequest() {
  return dispatch => {
    dispatch({
      type: INTRUPT_API_REQUEST
    });
  };
}
