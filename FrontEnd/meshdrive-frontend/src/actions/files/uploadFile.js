import { UPLOAD_FILE } from "./types";
import axios from 'axios';
export const addFile = fileWithInfo => {
  return {
    type: UPLOAD_FILE,
    payload: {
      'name':fileWithInfo.file.name,
      'drive':fileWithInfo.drive
    }
  };
};
export default function uploadFile(fileWithInfo) {
  return dispatch => {

  {
    const formData = new FormData()
    formData.append('file', fileWithInfo.file);
    formData.append('drive',fileWithInfo.drive);
    axios.post('/api/uploadfile', formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  }).then(dispatch(addFile(fileWithInfo)));

}
  };
}
