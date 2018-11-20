import { localStorageUserObjString } from "../constants/strings";

export default function saveUserObjToLocalStorage(userObj) {
  const { localStorage } = window;
  localStorage.setItem(localStorageUserObjString, JSON.stringify(userObj));
}
