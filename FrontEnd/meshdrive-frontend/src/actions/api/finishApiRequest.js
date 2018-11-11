import { FINISH_API_REQUEST } from "./types";

export default function finishApiRequest(
  apiResponse = null,
  showUi = false,
  responseUiComponent = null
) {
  return dispatch => {
    dispatch({
      type: FINISH_API_REQUEST,
      payload: { apiResponse, responseUiComponent, showUi, inProgress: false }
    });
  };
}
