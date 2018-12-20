import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
// import toggleFileActive from "../../actions/files/toggleFileActive";
import FAIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import setActiveFile from "../../actions/activeFilesIds/setActiveFile";
import unsetActiveFile from "../../actions/activeFilesIds/unsetActiveFile";
import downloadFile from "../../actions/files/downloadFile";
import fetchFilesById from "../../actions/files/fetchFilesById";
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

    this.isFolder = this.props.file.mimeType === "folder";
  }
  // toggleActive = e => {
  //   e.preventDefault();
  //   if (e.target.tagName.toLowerCase() === "nav") {
  //     return;
  //   }
  //   this.setState(
  //     prevState => {
  //       return {
  //         active: !prevState.active
  //       };
  //     },
  //     () => {
  //       if (this.state.active) {
  //         this.props.setActiveFile(this.file.id);
  //       } else {
  //         console.log(this.state.active);

  //         this.props.unsetActiveFile(this.file.id);
  //       }
  //     }
  //   );
  // };
  handleClick = e => {
    e.preventDefault();
    const { file } = this.props;
    if (this.isFolder) {
      this.props.fetchFilesById(
        this.props.drive,
        file.account,
        file.id,
        false,
        file.path
      );
    }
    console.log(file);
    debugger;
  };
  handleContextMenuClick = menu => {
    const { file } = this.props;

    switch (menu) {
      case "download":
        return this.props.downloadFile(this.props.drive, file.account, file);
    }
  };

  render() {
    const { file } = this.props;
    let driveIcon = null;
    switch (file.drive) {
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

    const fileItemIcon = getMimeTypeIcon(file.mimeType);
    return (
      <div
        className={
          "file-item m-2" +
          (this.state.active
            ? " active bg-gray border-primary text-primary"
            : "")
        }
        onClick={this.handleClick}
      >
        <ContextMenuTrigger id={file.id}>
          <div className="d-flex flex-nowrap align-items-center">
            <div className="file-item--icon  p-2">
              {fileItemIcon && fileItemIcon}
            </div>
            <div className="d-flex flex-column p-1 file-item--info">
              <div className="file-item--title">{file.name}</div>
            </div>
            <div
              className="file-item--drive-icon align-self-start ml-auto mt-1 mr-2 m-1"
              data-tip={`Drive Account: ${file.account}`}
              data-for={file.id}
            >
              {driveIcon}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenu id={file.id}>
          <MenuItem
            data={{
              foo: "bar"
            }}
            onClick={() => this.handleContextMenuClick("download")}
          >
            Download
          </MenuItem>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => this.handleContextMenuClick("delete")}
          >
            Delete
          </MenuItem>
          <MenuItem divider />
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => this.handleContextMenuClick("details")}
          >
            Details
          </MenuItem>
        </ContextMenu>
        <ReactTooltip id={file.id} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveFile,
      unsetActiveFile,
      downloadFile,
      fetchFilesById
    },
    dispatch
  );
}
export default connect(
  null,
  mapDispatchToProps
)(FileItem);
