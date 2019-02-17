import { CREATE_NEW_FOLDER } from "../files/types";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import LoadingMessage from "../../utils/LoadingMessage";
// import startApiRequest from "../api/startApiRequest";
// import finishApiRequest from "../api/finishApiRequest";
// import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import fetchRootFiles from "../files/fetchRootFiles";
import fetchFilesById from "../files/fetchFilesById";

export default function requestCreateFolder(
  drive,
  folderName,
  parent,
  createFolderEmail
) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log("Starting API call from requestCreateFolder");

    const toastInfoId = toast.info(
      <LoadingMessage loaderArgs={{ color: "white" }}>
        Creating Folder
      </LoadingMessage>,
      {
        autoClose: false
      }
    );
    // dispatch(startApiRequest());
    // debugger;
    let postURL, postData;
    switch (drive.toUpperCase()) {
      case GOOGLEDRIVE:
        postURL = apiRoutes.files.googledrive_createFolder;
        postData = {
          folderName,
          parentId: parent,
          googleDriveEmail: createFolderEmail,
          token
        };
        break;
      case ONEDRIVE:
        postURL = apiRoutes.files.onedrive_createFolder;
        postData = {
          folderName,
          parentId: parent,
          oneDriveEmail: createFolderEmail,
          token
        };
        break;

      case DROPBOX:
        postURL = apiRoutes.files.dropbox_CreateFolder;
        postData = {
          name: folderName,
          path: parent,
          dropboxAccountEmail: createFolderEmail,
          token
        };
        break;
    }
    console.log(postURL);
    debugger;
    axios
      .post(postURL, postData)
      .then(response => {
        const { data, status } = response;
        console.log(data);
        let responseUiComponent;

        switch (status) {
          case 200:
            toast.update(toastInfoId, {
              render: response.data.message,
              type: toast.TYPE.SUCCESS,
              autoClose: 5000
            });
            // responseUiComponent = (
            //   // <SweetAlertWrapper success title="Success">
            //   //   {response.data.message}
            //   // </SweetAlertWrapper>
            // );
            break;
          case 201:
            toast.update(toastInfoId, {
              render: response.data.error,
              type: toast.TYPE.WARNING,
              autoClose: 5000
            });
            // responseUiComponent = (
            //   <SweetAlertWrapper warning title="Warning">
            //     {response.data.error}
            //   </SweetAlertWrapper>
            // );
            break;
          case 400:
            toast.update(toastInfoId, {
              render: response.data.error,
              type: toast.TYPE.ERROR,
              autoClose: 5000
            });
            // responseUiComponent = (
            //   <SweetAlertWrapper danger title="Fail">
            //     {response.data.error}
            //   </SweetAlertWrapper>
            // );
            break;
        }
        // dispatch(finishApiRequest(response, true, responseUiComponent));

        if (parent === "") {
          dispatch(fetchRootFiles(drive, true));
        } else {
          dispatch(fetchFilesById(drive, createFolderEmail, parent, true));
        }
      })
      .catch(error => {
        console.log(error);

        toast.update(toastInfoId, {
          render: "Something went wrong, please try again",
          type: toast.TYPE.ERROR,
          autoClose: 5000
        });
        // dispatch(
        //   finishApiRequest(
        //     null,
        //     true,
        //     <SweetAlertWrapper danger title="Fail">
        //       Something went wrong while fetching files.
        //     </SweetAlertWrapper>
        //   )
        // );
      });
  };
}
