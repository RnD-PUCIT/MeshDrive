import { SAVE_TOKEN, REMOVE_TOKEN } from "../actions/auth/types";

const initialAuthState = {};
export default function(state = initialAuthState, action) {
  switch (action.type) {
    case SAVE_TOKEN:
      return { ...state, token: action.payload };

    case REMOVE_TOKEN:
      return { ...state, token: null };
  }
  return state;
}
