import React from "react";
import FAIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";

export const googleMimeTypes = [
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
    case 4:
      return fileItemIcons.folder;
  }

  return fileItemIcons.unknown;
}

export const fileItemIcons = {
  folder: <img src={require("../images/folder-icon.png")} alt="" />,
  unknown: <FAIcon icon="question-circle" classes={["fas"]} />
};
