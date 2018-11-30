import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
import stateValidator from "../middlewares/stateValidator";
// store configuration
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, stateValidator))
);

export const getState = store.getState();

export default store;
