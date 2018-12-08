import { FORCE_RELOAD } from "./types";

export function shouldNavigateTo(state, folder) {
  return {
    type: FORCE_RELOAD,
    payload: folder
  };
}

export default function navigateTo(folder) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldNavigateTo(state, folder));
  };
}
