import { DELETE_FILE } from "./types";
import axios from 'axios';

export const delFile = file_id => {
  return {
    type: DELETE_FILE,
    payload: file_id
  };
};

export default function deleteFile(id) {
  return dispatch => {
  {
    axios.post('/api/deleteFileByID',{
        'file_id': id
    }
  ).then(function (response) {
    console.log(response);
  })
  .then(id=>dispatch(delFile(id)))
  .catch(function (error) {
    console.log(error);
  });

}
  };
}
