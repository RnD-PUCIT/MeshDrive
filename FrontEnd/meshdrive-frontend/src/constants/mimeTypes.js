import React from "react";
import FAIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";

export const googleMimeTypes = [
  "INDEX_NOT_USED",
  "application/vnd.google-apps.audio",
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.drawing",
  "application/vnd.google-apps.file",
  "application/vnd.google-apps.folder",
  "application/vnd.google-apps.form",
  "application/vnd.google-apps.fusiontable",
  "application/vnd.google-apps.map",
  "application/vnd.google-apps.photo",
  "application/vnd.google-apps.presentation",
  "application/vnd.google-apps.script",
  "application/vnd.google-apps.site",
  "application/vnd.google-apps.spreadsheet",
  "application/vnd.google-apps.unknown",
  "application/vnd.google-apps.video",
  "application/vnd.google-apps.drive-sdk"
];

export function getMimeTypeIcon(mimeType) {
  /*
    MimeType From Google
    */
  switch (googleMimeTypes.indexOf(mimeType)) {
    case 1:
      return fileItemIcons.audio;
    case 2:
      return fileItemIcons.document;
    case 3:
      return fileItemIcons.drawing;
    case 4:
      return fileItemIcons.file;
    case 5:
      return fileItemIcons.folder;

    // case 6,7,8
    case 9:
      return fileItemIcons.photo;
    case 10:
      return fileItemIcons.presentation;
    case 11:
      return fileItemIcons.script;

    // case 12:
    case 13:
      return fileItemIcons.spreadsheet;
    case 14:
      return fileItemIcons.unknown;
    case 15:
      return fileItemIcons.video;
    // drive-sdk
  }

  return fileItemIcons.unknown;
}

export const fileItemIcons = {
  audio: <img src={require("../images/colored_icons/mp3-icon.png")} alt="" />,
  document: (
    <img src={require("../images/colored_icons/doc-icon.png")} alt="" />
  ),
  drawing: <img src={require("../images/colored_icons/png-icon.png")} alt="" />,
  file: <img src={require("../images/colored_icons/file-icon.png")} alt="" />,
  folder: <img src={require("../images/icon-folder.png")} alt="" />,
  /*
  form: <img src={require("../images/colored_icons/form-icon.png")} alt="" />,
  fusiontable: <img src={require("../images/colored_icons/fusiontable-icon.png")} alt="" />,
  map: <img src={require("../images/colored_icons/map-icon.png")} alt="" />,*/

  photo: <img src={require("../images/colored_icons/jpg-icon.png")} alt="" />,
  presentation: (
    <img src={require("../images/colored_icons/ppt-icon.png")} alt="" />
  ),
  script: <img src={require("../images/colored_icons/js-icon.png")} alt="" />,

  //site: <img src={require("../images/colored_icons/site-icon.png")} alt="" />,

  spreadsheet: (
    <img src={require("../images/colored_icons/excel-icon.png")} alt="" />
  ),
  video: <img src={require("../images/colored_icons/mp4-icon.png")} alt="" />,

  // drive-sdk: <img src={require("../images/colored_icons/drive-sdk-icon.png")} alt="" />,

  unknown: <FAIcon icon="question-circle" classes={["fas"]} />
};
