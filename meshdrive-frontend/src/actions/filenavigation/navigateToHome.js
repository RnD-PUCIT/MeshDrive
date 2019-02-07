import { NAVIGATE_TO_HOME } from "./types";
import { shouldFetchFilesAllDrives } from "../files/fetchRootFilesAllDrives";
export function shouldNavigateToHome(state) {
  return {
    type: NAVIGATE_TO_HOME
  };
}

export default function navigateToHome() {
  return (dispatch, getState) => {
    const state = getState();
    const { historyStack } = state.fileNavigation;
    const rootFolder = historyStack[0];

    dispatch(shouldFetchFilesAllDrives(state, rootFolder));
    dispatch(shouldNavigateToHome(state));
  };
}
