import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";

export const getProfile = (data) => {
    return {
      type: "GET_SELF_PROFILE",
      payload: data
    };
};

export function getProfileByEmail(email){

    return (dispatch, getState) => {
        var state= getState();
    const { user } = state;
    const { token } = user;
  
    var options = {
            url :apiRoutes.users.fetchProfile,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data:{
                token:token,
                email:email
            }
        }
        var p=axios(options);
        p.then((data)=>{
                console.log("promise resolved");
        }).catch((error)=>{
            console.log("promise rejected");
        })
        return dispatch({
            type: "GET_SELECTED_PROFILE",
            payload: p
        });
    }

}

export  function getSelfProfile(){

    return (dispatch, getState) => {
        const state = getState();
        const { user } = state;
        const {email }= user;
        const { token } = user;
        var options = {
            url :apiRoutes.users.fetchProfile,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data:{
                token:token,
                email:email
            }
        }
        axios(options).then((response)=>{
            console.log(response.data.userProfile);
            var userProfile = response.data.userProfile;
           dispatch(getProfile(userProfile));
        }).catch((error)=>{
            console.log("error");
        
        })
    }
}