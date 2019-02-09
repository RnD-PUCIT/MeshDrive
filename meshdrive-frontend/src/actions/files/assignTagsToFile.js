import { ASSIGN_TAGS_TO_FILE } from "./types";
import axios from "axios";
import React from "react";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import fetchTagsOfFile, { shouldFetchTagsOfFile } from "../files/fetchTagsOfFile";

export default function assignTagsToFile(obj) {
  return (dispatch,getState) => {
        let driveEmail = obj.driveEmail;
       let driveType = obj.driveType;
        let fileId = obj.fileId;
        let tagsIdList = obj.tagsIdList;
        const state = getState();
        const { user } = state;
        const { token } = user;    
        dispatch(startApiRequest()); 
      axios.post(apiRoutes.files.assignTagsToFile,{
        token,
        driveEmail,
        driveType,
        fileId,
        tagsIdList

      }).then(response => {
        const {success,data}=response.data;
        console.log("SSSSSSSSSS"+success);
        if(success==true)
        {
          dispatch(finishApiRequest(null, true, <SweetAlertWrapper success title="Tags Assigned">       
        </SweetAlertWrapper>));
         dispatch(shouldFetchTagsOfFile(tagsIdList,obj));
        }
        else{
          dispatch(finishApiRequest(null, true, <SweetAlertWrapper danger title="Fail">
          Duplicate Tags cant be assigned
        </SweetAlertWrapper>));
        }

     
      
      })
      .catch(error => {
        dispatch(finishApiRequest(null, true, <SweetAlertWrapper danger title="Fail">
        Something went wrong while assigning tags Try Again.
      </SweetAlertWrapper>));
      
      });
    }
  };

