import { LOCAL_STORAGE_USER_OBJECT_STRING } from "../constants/strings";
export default function removeUserObjFromLocalStorage() {
  const { localStorage } = window;
  console.log("Removing user");
  localStorage.setItem(LOCAL_STORAGE_USER_OBJECT_STRING, null);
  localStorage.removeItem(LOCAL_STORAGE_USER_OBJECT_STRING);
  localStorage.clear();
}
