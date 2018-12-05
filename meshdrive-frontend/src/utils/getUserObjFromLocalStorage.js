import { LOCAL_STORAGE_USER_OBJECT_STRING } from "../constants/strings";

export default function getUserObjFromLocalStorage() {
  const { localStorage } = window;
  const userObj = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_OBJECT_STRING)
  );
  return userObj;
}
