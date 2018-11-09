import { START_API_REQUEST } from "./types";

export default function startApiRequest() {
  return dispatch => {
    dispatch({
      type: START_API_REQUEST,
      payload: { inProgress: true }
    });
  };
}
