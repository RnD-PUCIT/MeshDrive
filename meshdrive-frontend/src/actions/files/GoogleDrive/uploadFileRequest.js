import axios from "axios";
import toStream from "blob-to-stream";
import { apiRoutes } from "../../../constants/apiConstants";
export default (googleDriveEmail, files, user, onUploadProgress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { token } = user;

      // const response = await axios({
      //   url: apiRoutes.files.google_downloadFileMetadata(
      //     googleDriveEmail,
      //     token
      //   ),
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" }
      // });
      const response = {
        data: {
          token:
            "ya29.Gl22BliwTfdy-nETyOXFpWkKXVtjJ-lY5BpyiSKc8dIhskIZHrBMhLXA9ZAdjqMhr6n6DXQcrK3_xu7Tzfk6z10R0jt62rEVIowOxO6BgrZzIru13lCb0ZXicKFAdPU"
        }
      };
      const [file1] = files;
      console.log(file1);

      const chunkSize = 256; //bytes

      let noOfChunks = file1.size / (chunkSize * 1024);
      console.log(noOfChunks);
      const totalChunks = Array({ length: Math.round(noOfChunks) }).map(() => {
        const size = noOfChunks >= 1 ? chunkSize : noOfChunks * chunkSize;
        noOfChunks--;
        return size;
      });

      const initUploadGoogleDriveResponse = await axios({
        url: `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Upload-Content-Type": file1.type,
          "X-Upload-Content-Length": file1.size,
          Authorization: `Bearer ${response.data.token}`
        },
        body: {
          name: file1.name
        },
        // responseType: "blob",
        onUploadProgress
      });

      const uploadHeaders = initUploadGoogleDriveResponse.headers;
      const uploadLocation = uploadHeaders.location;

      console.log(uploadLocation);

      let bytesUploaded = 0;

      for (let chunk of totalChunks) {
        console.log({ chunk });
        const uploadGoogleDriveResponse = await axios({
          url: uploadLocation,
          method: "PUT",
          headers: {
            "Content-Length": chunk,
            "Content-Type": file1.type,
            "Content-Range": `bytes ${bytesUploaded}-${chunk}/${file1.size}`
            // Authorization: `Bearer ${response.data.token}`
          },
          responseType: "stream",
          onUploadProgress
        });
        console.log({ bytesUploaded, uploadGoogleDriveResponse });
        uploadGoogleDriveResponse.data.pipe(toStream(file1));
        bytesUploaded += chunk;
      }
    } catch (err) {
      reject(err);
    }
  });
};
