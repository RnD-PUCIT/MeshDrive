import {
  NAVIGATE_TO,
  NAVIGATE_TO_UP_ONE_LEVEL,
  NAVIGATE_TO_BACK,
  NAVIGATE_TO_FORWARD,
  FORCE_RELOAD
} from "../actions/filenavigation/types";

const initialState = {
  historyStack: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case NAVIGATE_TO:
      return {
        ...state,
        historyStack: [...state.historyStack, action.payload]
      };
    case NAVIGATE_TO_UP_ONE_LEVEL:
      return state;
    case NAVIGATE_TO_BACK:
      return state;
    case NAVIGATE_TO_FORWARD:
      return state;

    case FORCE_RELOAD:
      let newHistoryStack = Object.assign(state.historyStack);
      newHistoryStack.filter(item => {
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
