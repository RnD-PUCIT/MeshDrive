import { DELETE_TAG } from "./types";
import React from "react";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import { rootURL } from "../../constants/apiConstants";
import { getUserReducer } from "../../utils/getTokenFromStore";
import saveUserObj from "../user/saveUserObj";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";

function deleteTagAction(name) {

    return {
      type: DELETE_TAG,
      payload: name
    };
  }

export default function deleteTag(tagName) {
  return (dispatch,getState) => {
    const state = getState();
      const {user} = state;
      const {token , email} = user;
    dispatch(startApiRequest());
 
    axios
      .post(apiRoutes.users.deleteTag, {
        email,
        token,
        tagName
         })
      .then(
        response => {
            let responseUiComponent;
            if(response.status==200)
            {
            dispatch(deleteTagAction(tagName));         
               responseUiComponent = (
                <SweetAlertWrapper success title="Success">
                  {response.data.message}
                </SweetAlertWrapper>
              ); 
            } 
            else if(response.status==500)
            {
                 responseUiComponent = (
                    <SweetAlertWrapper danger title="Fail">
                      {response.data.message}
                    </SweetAlertWrapper>
                  );  
            } 
           
            dispatch(finishApiRequest(response.data.success,true,responseUiComponent));
            
        },
        error => {
         
          dispatch(finishApiRequest(null,true,  <SweetAlertWrapper danger  title="Fail">
          {error.message}
        </SweetAlertWrapper>));
          console.log(error);
        }
      );
  };
}
