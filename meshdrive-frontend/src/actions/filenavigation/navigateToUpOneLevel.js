import { NAVIGATE_TO_UP_ONE_LEVEL } from "./types";
import { shouldFetchFiles } from "../files/fetchRootFiles";

export function shouldNavigateToUpOneLevel(state) {
  return {
    type: NAVIGATE_TO_UP_ONE_LEVEL
  };
}

export default function navigateToUpOneLevel() {
  return (dispatch, getState) => {
    const state = getState();
    const { historyStack } = state.fileNavigation;
    const upOneLevelFolder = historyStack[historyStack.length - 2];
    dispatch(shouldFetchFiles(state, upOneLevelFolder.items));
    dispatch(shouldNavigateToUpOneLevel(state));
  };
}
