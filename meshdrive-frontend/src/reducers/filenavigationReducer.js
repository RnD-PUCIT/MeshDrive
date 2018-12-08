import {
  NAVIGATE_TO,
  NAVIGATE_TO_UP_ONE_LEVEL,
  NAVIGATE_TO_HOME,
  NAVIGATE_TO_BACK,
  NAVIGATE_TO_FORWARD,
  FORCE_RELOAD
} from "../actions/filenavigation/types";

const initialState = {
  currentIndex: -1,
  historyStack: [],
  softBackHistoryStack: [] // contains indexes only
};
export default function(state = initialState, action) {
  let newHistoryStack;
  switch (action.type) {
    case NAVIGATE_TO_HOME:
      const { historyStack } = state;
      const [root] = historyStack;
      return {
        ...state,
        historyStack: [...state.historyStack, root],
        currentIndex: 0
      };
    case NAVIGATE_TO:
      return {
        ...state,
        historyStack: [...state.historyStack, action.payload],
        currentIndex: state.currentIndex + 1
      };
    case NAVIGATE_TO_UP_ONE_LEVEL:
      return state;
    case NAVIGATE_TO_BACK:
      return {
        ...state,
        currentIndex: state.currentIndex - 1
      };
    case NAVIGATE_TO_FORWARD:
      return state;

    case FORCE_RELOAD:
      newHistoryStack = Object.assign(state.historyStack);
      newHistoryStack.map(item => {
        if (action.payload.parent === item.parent) {
          return action.payload;
        } else {
          return item;
        }
      });

      return { ...state, historyStack: [...newHistoryStack] };
  }
  return state;
}
