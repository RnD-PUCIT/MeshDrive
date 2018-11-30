export default ({ dispatch, getState }) => next => action => {
  next(action);
  console.log({ action: action.type, state: getState() });
};
