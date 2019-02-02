import { UPDATE_SEARCH_KEYWORDS } from "../actions/searching/types.js";

const initialActiveFileIdsState = {keywords:''};
export default function(state = initialActiveFileIdsState, action) {
  switch (action.type) {
    case UPDATE_SEARCH_KEYWORDS:
    const keywords = action.payload;   
    return {keywords};    
  
  }
  return state;
}
