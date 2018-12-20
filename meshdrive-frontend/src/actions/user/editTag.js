import { EDIT_TAG } from "./types";
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



function editTagAction(etagID,etagName,etagDescription,etagColor) {
    return {
      type: EDIT_TAG,
      payload: { etagID,etagName,etagDescription,etagColor }
    };
  }

export default function editTag(tag) {
  return (dispatch,getState) => {
    const state = getState();
      const {user} = state;
      const {token , email} = user;
      let tagName = tag.tagName;
      let tagDescription = tag.tagDescription;
      let tagColor = tag.tagColor;
      let tagID = tag.tagID;
    dispatch(startApiRequest());
 
    axios
      .post(apiRoutes.users.editTag, {
        email,
        token,
        tagName,
        tagDescription,
        tagColor,
        tagID
      })
      .then(
        response => {
                  
            dispatch(finishApiRequest(null,true,null));
            dispatch(editTagAction(tagID,tagName,tagDescription,tagColor));
        },
        error => {
          dispatch(finishApiRequest());
          console.log(error);
        }
      );
  };
}
