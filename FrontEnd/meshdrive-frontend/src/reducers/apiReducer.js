import { START_API_REQUEST, FINISH_API_REQUEST } from "../actions/api/types";

const initialApiState = {
  showUi: false,
  responseUiComponent: null,
  started: false,
  inProgress: false,
  apiResponse: null
};
export default function(state = initialApiState, action) {
  switch (action.type) {
    case START_API_REQUEST:
      if (action.type)
        console.log(action.type, { ...state, ...action.payload });

      return { ...state, ...action.payload };
    case FINISH_API_REQUEST:
      if (action.type)
        console.log(action.type, { ...state, ...action.payload });

      return { ...state, ...action.payload };
  }
  return state;
}
