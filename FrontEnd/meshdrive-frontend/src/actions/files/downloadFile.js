import { DOWNLOAD_FILE } from "./types";
import axios from "axios";
export const downloadFileSuccess = () => {
  return {
    type: DOWNLOAD_FILE,
    payload: "true"
  };
};

export default function downloadFile(id) {
  return dispatch => {
    axios({
      url: "https://mysterious-plains-65246.herokuapp.com/downloadFile/" + id,
      method: "GET",
      headers: { "Content-Type": "application/json" },
      responseType: "blob" // important
    }).then(response => {
      console.log(response);
        const blob = new Blob([response.data], {type: response.data.type});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'unknown';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length)
                fileName = fileNameMatch;
        }
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    
    });
  
  };
}
