import React, { Component } from "react";
import PropTypes from "prop-types";
import fetchFiles from "../../actions/files/fetchFiles";
import FileItem from "../../components/FileItem/FileItem";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class FilesList extends Component {
  componentDidMount() {
    this.props.fetchFiles();
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
    const emptyMessage = <p> Empty Dashboard </p>;
    const fileItems = this.sortFileItems(this.props.files);

    // seperate folders
    const mapFilesList = fileItems.map(file => {
      const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
      return <FileItem key={file.id} file={file} isFileActive={isFileActive} />;
    });

    return (
      <div className="files-list d-flex flex-row flex-wrap">
        {this.props.files.length === 0 ? emptyMessage : mapFilesList}
      </div>
    );
  }
}

FileList.propTypes = {
  files: PropTypes.array.isRequired
};
function mapStateToProps({ files, activeFileIds }) {
  return {
    files,
    activeFileIds
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchFiles }, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesList);
