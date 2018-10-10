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
  render() {
    const emptyMessage = <p> Empty Dashboard </p>;
    console.log(this.props.activeFileIds);
    const mapFilesList = this.props.files.map(file => {
      const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
      return <FileItem file={file} isFileActive={isFileActive} />;
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
