import React, { Component } from "react";
import FAIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
// import toggleFileActive from "../../actions/files/toggleFileActive";
import setActiveFile from "../../actions/activeFilesIds/setActiveFile";
import unsetActiveFile from "../../actions/activeFilesIds/unsetActiveFile";
import downloadFile from "../../actions/files/downloadFile";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { getMimeTypeIcon } from "../../constants/mimeTypes";

import "./styles.css";
class FileItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: this.props.isFileActive
    };
    this.file = this.props.file;
  }
  toggleActive = e => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "a") {
      this.downloadFile();
      return;
    }
    this.setState(
      prevState => {
        return {
          active: !prevState.active
        };
      },
      () => {
        if (this.state.active) {
          this.props.setActiveFile(this.file.id);
        } else {
          console.log(this.state.active);

          this.props.unsetActiveFile(this.file.id);
        }
      }
    );
  };

  handleContextMenuClick = e => {
    e.preventDefault();
  };

  downloadFile = () => {
    console.log("Download clicked");
    this.props.downloadFile(this.file.id);
    console.log(this.file.id);
  };
  render() {
    console.log(this.file);

    let driveIcon = null;
    switch (this.file.drive) {
      case "googledrive":
        driveIcon = <FAIcon icon="google" classes={["fab"]} />;
        break;
      case "dropbox":
        driveIcon = <FAIcon icon="dropbox" classes={["fab"]} />;
        break;
      case "onedrive":
        driveIcon = <FAIcon icon="cloud" classes={["fa"]} />;
        break;
    }

    const fileItemIcon = getMimeTypeIcon(this.file.mimeType);
    return (
      <React.Fragment>
        <div
          className={
            "file-item m-2" +
            (this.state.active
              ? " active bg-gray border-primary text-primary"
              : "")
          }
          onClick={this.toggleActive}
        >
          <ContextMenuTrigger id={this.file.id}>
            <div className="d-flex flex-nowrap flex-wrap align-items-center">
              <div className="file-item--icon  p-2">
                {fileItemIcon && fileItemIcon}
              </div>
              <div className="d-flex flex-column p-1 file-item--info">
                <div className="file-item--title">{this.file.name}</div>
                <div className="file-item--download">{this.props.size}</div>
              </div>
              <div className="file-item--drive-icon align-self-start ml-auto mt-1 mr-2 m-1">
                {driveIcon}
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenu id={this.file.id}>
            <MenuItem
              data={{
                foo: "bar"
              }}
              onClick={this.handleContextMenuClick}
            >
              Download
            </MenuItem>
            <MenuItem
              data={{ foo: "bar" }}
              onClick={this.handleContextMenuClick}
            >
              Delete
            </MenuItem>
            <MenuItem divider />
            <MenuItem
              data={{ foo: "bar" }}
              onClick={this.handleContextMenuClick}
            >
              Details
            </MenuItem>
          </ContextMenu>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveFile,
      unsetActiveFile,
      downloadFile
    },
    dispatch
  );
}
export default connect(
  null,
  mapDispatchToProps
)(FileItem);
