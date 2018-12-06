import { NAVIGATE_TO_FORWARD } from "./types";

export function shouldNavigateToForward(state) {
  return {
    type: NAVIGATE_TO_BACK
  };
}

export default function navigateToForward() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldNavigateToForward(state));
  };
}
