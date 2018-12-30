import {
  FETCH_FILES,
  UPLOAD_FILE,
  DELETE_FILE,
  DOWNLOAD_FILE,
  FETCH_FILE_TAG
  // TOGGLE_FILE_ACTIVE,
} from "../actions/files/types";

const initialFilesState = [];

export default function(state = initialFilesState, action) {
  switch (action.type) {
    case FETCH_FILES:
    {
      state = action.payload;
      const newState = Object.assign(state);
      newState.forEach(account=>{
        const {files} = account;     
           files.forEach(file=>{
                  file.tagsList = [];              
           });       
      }); 
      return [...newState];
    }
    

    case UPLOAD_FILE:
      console.log(action);
      return [action.payload.files, ...state];

    case DELETE_FILE: {
      const newState = Object.assign([], state);
      const indexOfFileToDelete = state.findIndex(files => {
        return files.id == action.payload;
      });
      newState.splice(indexOfFileToDelete, 1);
      return newState;
    }

    case DOWNLOAD_FILE: {
      return state;
    }

    case FETCH_FILE_TAG:{
      let fileInfo = action.file;
      let tagsList = action.payload;   
      state.forEach(account=>{
        const {email,drive,files} = account;
        if(email===fileInfo.driveEmail && drive===fileInfo.driveType)
        {
    
           files.forEach(file=>{
              if(file.id===fileInfo.fileId)
                {
                  file.tagsList = tagsList;                     
                }
           });
        }  
      }); 
      return [...state];  
    
  }

    default:
      return state;
  }
}
