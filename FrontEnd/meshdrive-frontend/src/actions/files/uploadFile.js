import { UPLOAD_FILE } from "./types";
import axios from 'axios';
export const addFile = fileWithInfo => {
  return {
    type: UPLOAD_FILE,
    payload: {
      'files':fileWithInfo.files,
      'drive':fileWithInfo.drive
    }
  };
};
export default function uploadFile(fileWithInfo) {
  return dispatch => {
  {
    const formData = new FormData()
    for (var f in fileWithInfo.files)
    {
      formData.append('files[]', f, f.name);
    }  
    axios.post('https://mysterious-plains-65246.herokuapp.com/uploadFile',formData,{     
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  }).then(dispatch(addFile(fileWithInfo)));

}
  };
}
