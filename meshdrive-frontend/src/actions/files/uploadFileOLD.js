import { UPLOAD_FILE } from "./types";
import axios from "axios";
import getTokenFromStore from "../../utils/getTokenFromStore";

export const addFile = fileWithInfo => {
  return {
    type: UPLOAD_FILE,
    payload: {
      files: fileWithInfo.files,
      drive: fileWithInfo.drive
    }
  };
};
export default function uploadFile(fileWithInfo) {
  return dispatch => {
    {
      // getting stored data from redux
      const token = getTokenFromStore();
      if (!token) return;

      const formData = new FormData();
      formData.append("token", token);
      var allFIles = fileWithInfo.files;
      for (var singleFile in allFIles) {
        formData.append("files[]", singleFile, singleFile.name);
      }
      axios
        .post(
          "https://mysterious-plains-65246.herokuapp.com/uploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(dispatch(addFile(fileWithInfo)));
    }
  };
}
