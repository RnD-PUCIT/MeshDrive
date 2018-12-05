import store from "../store";

export const getUserReducer = () => {
  const globalState = store.getState();
  const { user } = globalState;
  return user;
};
export default () => {
  const globalState = store.getState();
  const { user } = globalState;
  const { token } = user;
  console.log(globalState);
  return token;
};
