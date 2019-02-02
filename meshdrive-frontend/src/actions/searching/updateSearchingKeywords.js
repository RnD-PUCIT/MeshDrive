import { UPDATE_SEARCH_KEYWORDS } from "./types";

export default function updateSearchKeywords(searchKeywords) {
  return dispatch => {
    dispatch({
      type: UPDATE_SEARCH_KEYWORDS,
      payload: searchKeywords
    });
  };
}
