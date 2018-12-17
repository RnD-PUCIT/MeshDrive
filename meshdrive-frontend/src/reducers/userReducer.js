import {
  ADD_DRIVE,
  SAVE_USER,
  REMOVE_USER,
  FETCH_DRIVE_ACCOUNTS_LIST,
  FETCH_TAGS_LIST,
  ADD_TAG,
  DELETE_TAG,
  EDIT_TAG
} from "../actions/user/types";
import getUserObjFromLocalStorage from "../utils/getUserObjFromLocalStorage";
import { fileURLToPath } from "url";
import { stat } from "fs";

let initialUserState = {
  token: null,
  email:null,
  driveAccountsList: {
    googleDriveAccountsList: [],
    dropboxAccountsList: [],
    oneDriveAccountsList: []
  },
  tagsList:[]
};

const localStorageUserObj = getUserObjFromLocalStorage();
if (localStorageUserObj && localStorageUserObj.data) {
  const { token = null, email=null,driveAccountsList = {},tagsList=[] } = localStorageUserObj;
  initialUserState = {
    token,
    email,
    driveAccountsList,
    tagsList
  };
  console.log(initialUserState);
  debugger;
}

export default function(state = initialUserState, action) {
  switch (action.type) {
    case FETCH_TAGS_LIST:
    return { ...state, ...action.payload };

    case FETCH_DRIVE_ACCOUNTS_LIST:
      return { ...state, ...action.payload };

    case REMOVE_USER:
      return initialUserState;

    case SAVE_USER:
      const { driveAccountsList = {}, token = null, email=null } = action.payload;
      console.log(token);  
      return { ...state, token, driveAccountsList,email };


    case ADD_TAG:
    let  { tagName, tagDescription ,tagColor} = action.payload;
    console.log(tagName,tagDescription,tagColor);
    return state; // because we need key so i immediately fetch the tags from server 
   


    case DELETE_TAG:  
    const name = action.payload;
    let newState = Object.assign(state);
    let newTagsList = newState.tagsList;
    for(var i=0;i<newTagsList.length;i++)
    {
      console.log("ele  "+name);
      if(newTagsList[i].name===name)
      {      
        newTagsList.splice(i,1); 
      }
    }
    return {...newState,newTagsList};
    
 
    case EDIT_TAG:
    const { etagID,etagName, etagDescription ,etagColor} = action.payload;
    let newEditedState = Object.assign(state);
    let newEditedTagsList = newEditedState.tagsList;
    for(var i=0;i<newEditedTagsList.length;i++)
    {
      if(newEditedTagsList[i]._id===etagID)
      {      
        newEditedTagsList[i].name = etagName;
        newEditedTagsList[i].description = etagDescription;
        newEditedTagsList[i].color = etagColor;
        return {...newEditedState,newEditedTagsList};

      }
    }
    return {...newEditedState,newEditedTagsList};

   
  }
  return state;
}
