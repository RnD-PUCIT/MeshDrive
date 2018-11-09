import { START_API_REQUEST, FINISH_API_REQUEST } from "../actions/api/types";

const initialApiState = {
  inProgress: false
};
export default function(state = initialApiState, action) {
  console.log(action.payload);
  switch (action.type) {
    case START_API_REQUEST:
      return action.payload;
    case FINISH_API_REQUEST:
      return action.payload;
  }
  return state;
}
