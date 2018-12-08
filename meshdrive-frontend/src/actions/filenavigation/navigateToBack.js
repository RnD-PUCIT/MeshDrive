import { NAVIGATE_TO_BACK } from "./types";
import { shouldFetchFiles } from "../files/fetchRootFiles";

export function shouldNavigateToBack(state) {
  return {
    type: NAVIGATE_TO_BACK
  };
}

export default function navigateToBack() {
  return (dispatch, getState) => {
    const state = getState();
    const { currentIndex, historyStack } = state.fileNavigation;
    if (currentIndex - 1 <= -1) return;
    const currentFolder = historyStack[currentIndex - 1];
    dispatch(shouldNavigateToBack(state));
    dispatch(shouldFetchFiles(state, currentFolder.items));
  };
}
