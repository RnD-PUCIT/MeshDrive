import { FINISH_API_REQUEST } from "./types";

export default function finishApiRequest(response) {
  return dispatch => {
    dispatch({
      type: FINISH_API_REQUEST,
      payload: { ...response, inProgress: false }
    });
  };
}
