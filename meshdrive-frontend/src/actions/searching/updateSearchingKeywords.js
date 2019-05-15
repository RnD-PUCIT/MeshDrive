import { UPDATE_FILE_SEARCH_KEYWORDS,
   UPDATE_USER_SEARCH_KEYWORDS ,
  SET_USER_SEARCH_RESULT_LIST} from "./types";

  import axios from "axios";
  import { apiRoutes } from "../../constants/apiConstants";
export default function updateFileSearchKeywords(searchKeywords) {
  return dispatch => {
    dispatch({
      type: UPDATE_FILE_SEARCH_KEYWORDS,
      payload: searchKeywords
    });
  };
}

export const updateUserSearchKeywords=(searchKeywords)=> {
  return dispatch => {
    dispatch({
      type: UPDATE_USER_SEARCH_KEYWORDS,
      payload: searchKeywords
    });
  };
}
export const setUserList=(userList)=> {
  return dispatch => {
    dispatch({
      type: SET_USER_SEARCH_RESULT_LIST,
      payload: userList
    });
  };
}


export const searchUsers=()=>
{
  return (dispatch,getState)=>{

    // empty the existing array 
    dispatch(setUserList([]));

    
    var state = getState();
    const {user} = state;
    const {token} = user;
    const {searchKeyword} = state;
  
    const keyword = searchKeyword.user_keywords;
    axios.post(apiRoutes.users.searchUser,{
      token,
      keyword
    }).then(response=>{

      if(response.data.success==true)
      {
        dispatch(setUserList(response.data.users))
           
      }

    }).catch(err=>{
        
    });
  }
}