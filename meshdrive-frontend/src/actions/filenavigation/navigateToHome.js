import { NAVIGATE_TO_HOME } from "./types";
import { shouldFetchFiles } from "../files/fetchRootFiles";
export function shouldNavigateToHome(state) {
  return {
    type: NAVIGATE_TO_HOME
  };
}

export default function navigateToHome() {
  return (dispatch, getState) => {
    const state = getState();
    const { historyStack } = state.fileNavigation;
    const [root] = historyStack;
    dispatch(shouldNavigateToHome(state));
    dispatch(shouldFetchFiles(state, root.items));
  };
}
