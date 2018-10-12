import { FETCH_FILES } from "./types";
import uuid from "uuid";
import axios from "axios";
export const setFiles = files => {
  console.log(files);
  const drives = ["googledrive", "onedrive", "dropbox"];
  files.forEach((file, i) => {
    file.drive = drives[i % 3];
    file.active = false;
  });

  return {
    type: FETCH_FILES,
    payload: files
  };
};

export default function fetchFiles() {
  // let dummyFiles = [];
  // for (let i = 0; i < 100; i++) {
  //   const file = {
  //     id: uuid,
  //     name: `File ${i}`
  //   };
  //   dummyFiles = [...dummyFiles, file];
  // }

  return dispatch => {
    fetch("https://mysterious-plains-65246.herokuapp.com/ListDriveFiles")
      .then(res => res.json())
      .then(files => {
        // sort files
        dispatch(setFiles(files));
      })
      .catch(error => console.log(error));

    // return dispatch(setFiles(dummyFiles));
  };
}
