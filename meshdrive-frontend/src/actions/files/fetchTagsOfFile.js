import { FETCH_FILE_TAG } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import navigateTo from "../../actions/filenavigation/navigateTo";
import navigateToHome from "../../actions/filenavigation/navigateToHome";
import forceReload from "../../actions/filenavigation/forceReload";
export const shouldFetchTagsOfFile = (data,file) => {
  return {
    type: FETCH_FILE_TAG,
    payload: data, // list of tags
    file: file
  };
};

export default function fetchTagsOfFiles(obj) {
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
          dispatch(finishApiRequest(null,true,
            <SweetAlertWrapper danger title="Fail">
            Try Again
          </SweetAlertWrapper>));
          
        }    
      })
      .catch(error => {
        console.log(error);
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
