import axios from "axios";
import { toast } from "react-toastify";

import { apiRoutes } from "../../../constants/apiConstants";
export default (googleDriveEmail, file, user, onDownloadProgress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { token } = user;

      const response = await axios({
        url: apiRoutes.files.google_downloadFileMetadata(
          googleDriveEmail,
          token
        ),
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const googleDriveResponse = await axios({
        url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.data.token}`
        },
        responseType: "blob",
        onDownloadProgress
      });

      const blob = new Blob([googleDriveResponse.data], {
        type: googleDriveResponse.data.type
      });

      resolve(blob);
    } catch (err) {
      reject(err);
    }
  });
};
