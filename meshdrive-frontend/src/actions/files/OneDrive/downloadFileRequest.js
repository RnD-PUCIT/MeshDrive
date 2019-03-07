import axios from "axios";

import { apiRoutes } from "../../../constants/apiConstants";
export default (oneDriveEmail, file, user, onDownloadProgress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { token } = user;
      const response = await axios({
        url: apiRoutes.files.onedrive_downloadFileMetadata(
          oneDriveEmail,
          token
        ),
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
      const oneDriveResponse = await axios({
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${
          file.id
        }/content`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.data.token}`
        },
        responseType: "blob",
        onDownloadProgress
      });

      const blob = new Blob([oneDriveResponse.data], {
        type: oneDriveResponse.data.type
      });

      resolve(blob);
    } catch (err) {
      reject(err);
    }
  });
};
