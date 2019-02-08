import { SET_TYPE_FILTER,
  SET_TIME_FILTER,
  SET_DRIVE_FILTER,
   RESET_FILTERS,
   SET_SIZE_FILTER,
   SET_TAG_FILTER } from "./types";

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

export function setTagFilter(value){
return dispatch => {
  console.log(value);
  dispatch({
    type: SET_TAG_FILTER,
    payload: value
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


  export const setDriveFilter = (index,value)=>{
    let obj = new Object();
    obj.index=index;
    obj.value=value;
    return dispatch => {
      dispatch({
        type: SET_DRIVE_FILTER,
        payload: obj
      });
    };
  }

  export const setSizeFilter = (size,mode)=>{
    let obj = new Object();
    obj.size=size;
    obj.mode=mode;
    return dispatch => {
      dispatch({
        type: SET_SIZE_FILTER,
        payload: obj
      });
    };
  }

  export const resetFilters = ()=>{
    return dispatch => {
      dispatch({
        type: RESET_FILTERS    
      });
    };
  }