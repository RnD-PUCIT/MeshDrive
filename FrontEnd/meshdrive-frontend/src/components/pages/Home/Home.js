// module imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// custom module imports
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import FilesList from "../../FilesList/FilesList";

class Home extends Page {
  render() {
    const activeFiles = this.props.files.filter(file => {
      return this.props.activeFileIds.indexOf(file.id) !== -1;
    });
    const lastActiveFile = activeFiles[activeFiles.length - 1];
    const activeFileIds = activeFiles.map(file => file.id);
    return (
      <React.Fragment>
        <SideBar primary />
        <div
          id="Dashboard"
          className="flex-grow-1 d-flex flex-column pl-4 pr-4"
        >
          <h1>Home</h1>

          <FilesList />
        </div>
        <SideBar secondary>
          {activeFiles.length == 0
            ? "No file selected"
            : `Total Selected Files: ${activeFiles.length}`}
        </SideBar>
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
