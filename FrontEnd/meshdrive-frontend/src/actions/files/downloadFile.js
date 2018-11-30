import { DOWNLOAD_FILE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import getTokenFromStore from "../../utils/getTokenFromStore";

export const downloadFileSuccess = () => {
  return {
    type: DOWNLOAD_FILE,
    payload: "true"
  };
};

export default function downloadFile(downloadFileAccount, fileId) {
  return dispatch => {
    axios({
      url: apiRoutes.files.downloadFile(
        downloadFileAccount,
        fileId,
        getTokenFromStore()
      ),
      method: "GET",
      headers: { "Content-Type": "application/json" },
      responseType: "blob" // important
    }).then(response => {
      console.log(response);
      debugger;

      // let [contentType, fileName] = response.headers["content-type"].split(";");

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = response.headers["file-name"];
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  };
}
