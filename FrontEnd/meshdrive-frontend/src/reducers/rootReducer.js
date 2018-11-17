import { combineReducers } from "redux";
import filesReducer from "./filesReducer";
import activeFileIdsReducer from "./activeFileIdsReducer";
import userReducer from "./userReducer";
import apiReducer from "./apiReducer";
import authReducer from "./authReducer";
export default combineReducers({
  files: filesReducer,
  activeFileIds: activeFileIdsReducer,
  user: userReducer,
  api: apiReducer,
  auth: authReducer
});
