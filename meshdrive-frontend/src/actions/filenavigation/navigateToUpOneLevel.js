import { NAVIGATE_TO_UP_ONE_LEVEL } from "./types";

export function shouldNavigateToUpOneLevel(state) {
  return {
    type: NAVIGATE_TO
  };
}

export default function navigateToUpOneLevel() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(shouldNavigateToUpOneLevel(state));
  };
}
