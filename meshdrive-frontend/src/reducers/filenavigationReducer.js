import {
  NAVIGATE_TO,
  NAVIGATE_TO_UP_ONE_LEVEL,
  NAVIGATE_TO_HOME,
  FORCE_RELOAD
} from "../actions/filenavigation/types";

const initialState = {
  historyStack: []
};
export default function(state = initialState, action) {
  let newHistoryStack;
  switch (action.type) {
    case NAVIGATE_TO_HOME:
      const { historyStack } = state;
      return {
        ...state,
        historyStack: [historyStack[0]]
      };
    case NAVIGATE_TO:
      return {
        ...state,
        historyStack: [...state.historyStack, action.payload]
      };
    case NAVIGATE_TO_UP_ONE_LEVEL:
      newHistoryStack = Object.assign(state.historyStack);
      newHistoryStack.pop();
      return {
        ...state,
        historyStack: newHistoryStack
      };

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
