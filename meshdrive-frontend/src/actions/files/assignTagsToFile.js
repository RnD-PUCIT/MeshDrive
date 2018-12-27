import { ASSIGN_TAGS_TO_FILE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import startApiRequest from "../api/startApiRequest";
// export const assignTagsToFileAction = (file_id,tagsList) => {
//   return {
//     type: ASSIGN_TAGS_TO_FILE,
//     payload: tagsList
//   };
// };

export default function assignTagsToFile(obj) {
  return (dispatch,getState) => {
        let driveEmail = obj.driveEmail;
       let driveType = obj.driveType;
        let fileId = obj.fileId;
        let tagsIdList = obj.tagsIdList;
        const state = getState();
        const { user } = state;
        const { token } = user;     
      axios.post(apiRoutes.files.assignTagsToFile,{
        token,
        driveEmail,
        driveType,
        fileId,
        tagsIdList

      }).then(response => {
      console.log("tagssssss response "+response.data);
      
      })
      .catch(error => {
        console.log("tagssssss response "+ error);
      
      });
    }
  };

