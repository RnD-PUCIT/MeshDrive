import { NAVIGATE_TO } from "./types";

export function shouldNavigateTo(state, folder) {
  return {
    type: NAVIGATE_TO,
    payload: folder
  };
}

export default function navigateTo(folder) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldNavigateTo(state, folder));
  };
}
