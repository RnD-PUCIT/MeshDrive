import { SET_TYPE_FILTER,SET_TIME_FILTER } from "./types";

export function setTypeFilter(index, value){
    let obj = new Object();
    obj.index=index;
    obj.value=value;
  return dispatch => {
    dispatch({
      type: SET_TYPE_FILTER,
      payload: obj
    });
  };
}

export const setTimeFilter = (index,value)=>{
    let obj = new Object();
    obj.index=index;
    obj.value=value;
    return dispatch => {
      dispatch({
        type: SET_TIME_FILTER,
        payload: obj
      });
    };
  }
