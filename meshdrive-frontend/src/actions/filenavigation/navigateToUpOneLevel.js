import { NAVIGATE_TO_UP_ONE_LEVEL } from "./types";
import { shouldFetchFilesAllDrives } from "../files/fetchRootFilesAllDrives";

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
    dispatch(shouldFetchFilesAllDrives(state, upOneLevelFolder));
    dispatch(shouldNavigateToUpOneLevel(state));
  };
}
