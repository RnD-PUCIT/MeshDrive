import React from "react";
import FAIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";

export const googleMimeTypes = [
  {
    str: "application/vnd.google-apps.audio",
    icon: <FAIcon icon="file-audio" classes={["far"]} />
  },
  {
    str: "application/vnd.google-apps.document",
    icon: <FAIcon icon="file-alt" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.drawing",
    icon: <FAIcon icon="file-signature" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.file",
    icon: <FAIcon icon="file" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.folder",
    icon: <img src={require("../images/folder-icon.png")} alt="" />
  },
  {
    str: "application/vnd.google-apps.form",
    icon: "FORM_ICON"
  },
  {
    str: "application/vnd.google-apps.fusiontable",
    icon: "FUSIONTABLE_ICON"
  },
  {
    str: "application/vnd.google-apps.map",
    icon: <FAIcon icon="map" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.photo",
    icon: <FAIcon icon="image" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.presentation",
    icon: "PRESENTATION_ICON"
  },
  {
    str: "application/vnd.google-apps.script",
    icon: ""
  },
  {
    str: "application/vnd.google-apps.site",
    icon: <FAIcon icon="folder" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.spreadsheet",
    icon: "SPREADSHEET_ICON"
  },
  {
    str: "application/vnd.google-apps.unknown",
    icon: <FAIcon icon="question-circle" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.video",
    icon: <FAIcon icon="file-video" classes={["fas"]} />
  },
  {
    str: "application/vnd.google-apps.drive-sdk",
    icon: "DRIVE_ICON"
  }
];
