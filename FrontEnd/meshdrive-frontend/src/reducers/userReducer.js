import { REQUEST_FORGOT_PASSWORD } from "../actions/user/types";

const initialUserState = null;
export default function(state = initialUserState, action) {
  switch (action.type) {
    case REQUEST_FORGOT_PASSWORD:
      console.log(action);
      return state;
  }
  return state;
}
