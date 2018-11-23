import { LOCAL_STORAGE_USER_OBJECT_STRING } from "../constants/strings";

export default function saveUserObjToLocalStorage(userObj) {
  const { localStorage } = window;
  localStorage.setItem(
    LOCAL_STORAGE_USER_OBJECT_STRING,
    JSON.stringify(userObj)
  );
}
