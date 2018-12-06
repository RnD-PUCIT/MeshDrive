import { NAVIGATE_TO_BACK } from "./types";

export function shouldNavigateToBack(state) {
  return {
    type: NAVIGATE_TO_BACK
  };
}

export default function navigateToBack() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldNavigateToBack(state));
  };
}
