import { combineReducers } from "redux";
import filesReducer from "./filesReducer";
import activeFileIdsReducer from "./activeFileIdsReducer";
import userReducer from "./userReducer";
import apiReducer from "./apiReducer";
import fileNavigationReducer from "./filenavigationReducer";
import searchReducer from "./searchReducer";
import filterReducer from "./filterReducer";
import currentProfile from './currentProfileReducer';
// import authReducer from "./authReducer";
export default combineReducers({
  files: filesReducer,
  
  activeFileIds: activeFileIdsReducer,
  user: userReducer,
  api: apiReducer,
  fileNavigation: fileNavigationReducer,
  searchKeyword: searchReducer,
  filters:filterReducer,
  currentProfile:currentProfile
});
