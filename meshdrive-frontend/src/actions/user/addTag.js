import { ADD_TAG } from "./types";
import React from "react";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import { rootURL } from "../../constants/apiConstants";
import { getUserReducer } from "../../utils/getTokenFromStore";
import saveUserObj from "../user/saveUserObj";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import fetchTagsList from "./fetchTagsList";



function addTagAction(tagName,tagDescription,tagColor) {
    return {
      type: ADD_TAG,
      payload: { tagName,tagDescription,tagColor }
    };
  }

export default function addTag(tag) {
  return (dispatch,getState) => {
    const state = getState();
      const {user} = state;
      const {token , email} = user;
      let tagName = tag.tagName;
      let tagDescription = tag.tagDescription;
      let tagColor = tag.tagColor;
    dispatch(startApiRequest());
 
    axios
      .post(apiRoutes.users.createTag, {
        email,
        token,
        tagName,
        tagDescription,
        tagColor
      })
      .then(
        response => {
         
            let responseUiComponent = (
                <SweetAlertWrapper success title="Success">
                  {response.data.message}
                </SweetAlertWrapper>
              );            
            dispatch(finishApiRequest(null,true,responseUiComponent));
            dispatch(addTagAction(tagName,tagDescription,tagColor));
        },
        error => {
          dispatch(finishApiRequest());
          console.log(error);
        }
      );
  };
}
