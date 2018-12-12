import { DOWNLOAD_FILE } from "./types";
import axios from "axios";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";

export const downloadFileSuccess = () => {
  return {
    type: DOWNLOAD_FILE,
    payload: "true"
  };
};

export default function downloadFile(drive, downloadFileAccount, file) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log(drive);
    debugger;

    switch (drive) {
      case GOOGLEDRIVE:
        axios({
          url: apiRoutes.files.downloadFile(
            downloadFileAccount,
            file.id,
            token
          ),
          method: "GET",
          headers: { "Content-Type": "application/json" },
          responseType: "blob" // important
        }).then(response => {
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
        break;
      case ONEDRIVE:
        break;
      case DROPBOX:
        axios({
          url: apiRoutes.files.dropbox_downloadFile,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // important
          data: {
            downloadFileAccount,
            fileName: file.name,
            path: file.id,
            token
          }
        }).then(response => {
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
        break;
    }
  };
}
