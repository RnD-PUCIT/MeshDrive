import { FORCE_RELOAD } from "./types";

export function shouldForceReload(state, folder) {
  return {
    type: FORCE_RELOAD,
    payload: folder
  };
}

export default function forceReload(folder) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldForceReload(state, folder));
  };
}
