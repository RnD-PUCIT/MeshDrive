import { FETCH_TAGS_LIST } from "./types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import saveUserObjToLocalStorage from "../../utils/saveUserObjToLocalStorage";

export const shouldFetchTagsList = (tagsList) => {
  return {
    type: FETCH_TAGS_LIST,
    payload: tagsList
  };
};

export default function fetchTagsList() {
  return (dispatch, getState) => {
    const state = getState();
  
    const { user } = state;
    const { token,email} = user;


    //dispatch(startApiRequest());

    axios
      .post(apiRoutes.users.listTags,{
         email,token
      })
      .then(response => {
        const tagsList = response.data;

        dispatch(shouldFetchTagsList( tagsList));

        dispatch(finishApiRequest(null, true));
      })
      .catch(error => {
        console.error(error);
        dispatch(
          finishApiRequest(
            null,
            true,
      
            <SweetAlertWrapper danger title="Fail">
              {error.message}
            </SweetAlertWrapper>
          )
        );
      });
  };
}
