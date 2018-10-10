import { combineReducers } from "redux";
import filesReducer from "./filesReducer";
import activeFileIdsReducer from "./activeFileIdsReducer";

export default combineReducers({
  files: filesReducer,
  activeFileIds: activeFileIdsReducer
});
