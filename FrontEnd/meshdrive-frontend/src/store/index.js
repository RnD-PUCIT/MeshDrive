import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
// store configuration
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const getState = store.getState();

export default store;
