import { FETCH_FILE_TAG } from "./types";
import axios from "axios";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import { apiRoutes } from "../../constants/apiConstants";
export const shouldFetchTagsOfFile = (data,file) => {
  return {
    type: FETCH_FILE_TAG,
    payload: data, // list of tags
    file: file
  };
};

export default  function fetchTagsOfFiles(obj) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;
    let driveEmail = obj.driveEmail;
    let driveType = obj.driveType;
     let fileId = obj.fileId;
   axios
      .post(apiRoutes.files.fetchTagsOfFile, {
        token,
        driveEmail,
        driveType,
        fileId
      })
      .then(response => {
        const {success,data} = response.data;
        if(success===true)
        {
          console.log("SUCCESS");
          dispatch(shouldFetchTagsOfFile(data,obj));
        }
        else if(success===false)
        {
          console.log("NOT SUCCESS");
          dispatch(startApiRequest());
          dispatch(finishApiRequest(null,true));
          
           dispatch(shouldFetchTagsOfFile(data,obj));
        }    
      })
      .catch(error => {
        console.log("ERRRRRRRRRRO");
        dispatch(
          finishApiRequest(
            null,
            true,
            null
          )
        );
      });
  };
}
