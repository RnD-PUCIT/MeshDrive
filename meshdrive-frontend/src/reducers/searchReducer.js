import { UPDATE_FILE_SEARCH_KEYWORDS,
   UPDATE_USER_SEARCH_KEYWORDS,
  SET_USER_SEARCH_RESULT_LIST } from "../actions/searching/types.js";

const initialActiveFileIdsState = { file_keywords: '',user_keywords:'',userList:[]};
export default function (state = initialActiveFileIdsState, action) {
  switch (action.type) {
    case UPDATE_FILE_SEARCH_KEYWORDS:
      {
        state.file_keywords = action.payload;
        return {...state};
      }

    case UPDATE_USER_SEARCH_KEYWORDS:
      {
        state.user_keywords = action.payload;
        return {...state };
      }

    case SET_USER_SEARCH_RESULT_LIST:
    {
      state.userList = action.payload;
      return {...state};
    }

    default:
      return state;
  }

}
