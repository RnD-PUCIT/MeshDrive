import {
  NAVIGATE_TO,
  NAVIGATE_TO_UP_ONE_LEVEL,
  NAVIGATE_TO_BACK,
  NAVIGATE_TO_FORWARD
} from "../actions/filenavigation/types";

const initialState = {
  historyStake: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case NAVIGATE_TO:
      return {
        ...state,
        historyStake: [...historyStake, action.payload]
      };
    case NAVIGATE_TO_UP_ONE_LEVEL:
      return state;
    case NAVIGATE_TO_BACK:
      return state;
    case NAVIGATE_TO_FORWARD:
      return state;
  }
  return state;
}
