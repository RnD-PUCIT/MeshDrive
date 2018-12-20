import { CREATE_NEW_FOLDER } from "../files/types";
import axios from "axios";
import React from "react";
import startApiRequest from "../api/startApiRequest";
import finishApiRequest from "../api/finishApiRequest";
import SweetAlertWrapper from "../../components/SweetAlertWrapper/SweetAlertWrapper";
import { apiRoutes } from "../../constants/apiConstants";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";
import fetchRootFiles from "../files/fetchRootFiles";
import fetchFilesById from "../files/fetchFilesById";

export default function requestCreateFolder(
  drive,
  folderName,
  currentFolder,
  createFolderEmail
) {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state;
    const { token } = user;

    console.log("Starting API call from requestCreateFolder");
    dispatch(startApiRequest());
    debugger;
    let postURL, postData;
    switch (drive) {
      case GOOGLEDRIVE:
        break;
      case ONEDRIVE:
        postURL = apiRoutes.files.onedrive_createFolder;
        postData = {
          folderName,
          parentId: currentFolder.parent,
          createFolderEmail: createFolderEmail,
          token
        };
        break;

      case DROPBOX:
        postURL = apiRoutes.files.dropbox_CreateFolder;
        postData = {
          name: folderName,
          path: currentFolder.path ? currentFolder.path : "",
          dropboxAccountEmail: createFolderEmail,
          token
        };
        break;
    }
    debugger;
    axios
      .post(postURL, postData)
      .then(response => {
        const { data, status } = response;
        console.log(data);
        let responseUiComponent;

        switch (status) {
          case 200:
            responseUiComponent = (
              <SweetAlertWrapper success title="Success">
                {response.data.message}
              </SweetAlertWrapper>
            );
            break;
          case 201:
            responseUiComponent = (
              <SweetAlertWrapper warning title="Warning">
                {response.data.error}
              </SweetAlertWrapper>
            );
            break;
          case 400:
            responseUiComponent = (
              <SweetAlertWrapper danger title="Fail">
                {response.data.error}
              </SweetAlertWrapper>
            );
            break;
        }
        dispatch(finishApiRequest(response, true, responseUiComponent));

        if (currentFolder.parent === "root") {
          dispatch(fetchRootFiles(currentFolder.drive, true));
        } else {
          dispatch(
            fetchFilesById(
              currentFolder.drive,
              currentFolder.listFilesAccount,
              currentFolder.parent,
              true
            )
          );
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(
          finishApiRequest(
            null,
            true,
            <SweetAlertWrapper danger title="Fail">
              Something went wrong while fetching files.
            </SweetAlertWrapper>
          )
        );
      });
  };
}
