import { SAVE_USER, REMOVE_USER } from "../actions/user/types";

const initialAuthState = {};
export default function(state = initialAuthState, action) {
  switch (action.type) {
    case SAVE_USER:
      console.log({ authReducer: action.payload });

      return { ...state, token: action.payload };

    case REMOVE_TOKEN:
      return { ...state, token: null };
  }
  return state;
}
