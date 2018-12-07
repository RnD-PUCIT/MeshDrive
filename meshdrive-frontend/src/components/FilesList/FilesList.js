import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileItem from "../../components/FileItem/FileItem";

import intruptApiRequest from "../../actions/api/intruptApiRequest";
import fetchRootFiles from "../../actions/files/fetchRootFiles";

class FilesList extends Component {
  state = {
    fileItems: [],
    currentDirectory: "root",
    componentDidUpdated: false
  };

  componentDidMount() {
    this.props.fetchRootFiles(this.props.drive);
  }

  componentWillUnmount() {
    this.props.intruptApiRequest();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.files !== this.props.files) {
      let allFiles = [];
      const drives = this.props.files;
      if (drives[Symbol.iterator] !== undefined) {
        for (let driveItem of drives) {
          const { email, drive, files } = driveItem;
          allFiles = allFiles.concat(
            files.map(file => {
              // adding additional attributes to file
              file.drive = drive;
              file.account = email;
              file.fileId = file.id;
              file.id = `${drive}/${file.id}`;
              return file;
            })
          );
        }
      }
      this.setState({ fileItems: allFiles, componentDidUpdated: true });
    }
  }

  sortFileItems(fileItems) {
    let folders = fileItems.filter(
      fileItem => fileItem.mimeType === "application/vnd.google-apps.folder"
    );
    folders.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    let files = fileItems.filter(
      fileItem => fileItem.mimeType !== "application/vnd.google-apps.folder"
    );
    files.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return folders.concat(files);
  }

  render() {
    const fileItems = this.sortFileItems(this.state.fileItems);
    console.log(fileItems);
    // seperate folders
    const mapFilesList = fileItems.map(file => {
      const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
      return (
        <FileItem
          key={file.id}
          file={file}
          isFileActive={isFileActive}
          drive={this.props.drive}
        />
      );
    });

    let display;
    if (this.state.componentDidUpdated === false) {
      display = "Loading...";
    } else if (this.state.fileItems.length === 0) {
      display = "No file exist or no drive added";
    } else {
      display = mapFilesList;
    }

    return (
      <React.Fragment>
        {this.state.fileItems.length > 0 && (
          <h5>Directory: {this.state.currentDirectory}</h5>
        )}
        <div className="files-list d-flex flex-row flex-wrap">{display}</div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ files, activeFileIds }) {
  return {
    files,
    activeFileIds
  };
}
export default connect(
  mapStateToProps,
  { fetchRootFiles, intruptApiRequest }
)(FilesList);
