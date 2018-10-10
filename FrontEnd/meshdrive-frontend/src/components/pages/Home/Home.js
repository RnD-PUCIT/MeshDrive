import React, { Component } from "react";
import SideBar from "../../Layout/SideBar/SideBar";
import { connect } from "react-redux";
// import fetchFiles from "../../../actions/files/fetchFiles";
import PropTypes from "prop-types";
import FilesList from "../../FilesList/FilesList";

class Home extends Component {
  render() {
    const activeFiles = this.props.files.filter(file => {
      return this.props.activeFileIds.indexOf(file.id) !== -1;
    });
    const lastActiveFile = activeFiles[activeFiles.length - 1];
    const activeFileIds = activeFiles.map(file => file.id);
    return (
      <React.Fragment>
        <div id="page" className="d-flex flex-row w-100">
          <div className="flex-grow-1 d-flex flex-column pl-4 pr-4">
            <h1>Home</h1>

            <FilesList />
          </div>

          <SideBar right>
            {activeFiles.length == 0
              ? "No file selected"
              : activeFiles.length == 1
                ? `Single file selected: ${lastActiveFile.id}`
                : `Multiple files selected: ${activeFileIds}`}
          </SideBar>
        </div>
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
export default connect(mapStateToProps)(Home);
