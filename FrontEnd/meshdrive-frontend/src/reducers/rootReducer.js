import { combineReducers } from "redux";
import filesReducer from "./filesReducer";
import activeFileIdsReducer from "./activeFileIdsReducer";
import userReducer from "./userReducer";
export default combineReducers({
  files: filesReducer,
  activeFileIds: activeFileIdsReducer,
  user: userReducer
});
