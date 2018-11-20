import { localStorageUserObjString } from "../constants/strings";
export default function removeUserObjFromLocalStorage() {
  const { localStorage } = window;
  console.log("Removing user");
  localStorage.setItem(localStorageUserObjString, null);
  localStorage.removeItem(localStorageUserObjString);
  localStorage.clear();
}
