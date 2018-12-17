// module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom module imports
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import FilesList from "../../FilesList/FilesList";
import requireAuth from "../../../hoc/requireAuth";

import FileNavigation from "../../FileNavigation/FileNavigation";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../../constants/strings";

class Dashboard extends Page {
  render() {
    // const activeFiles = this.props.files.filter(file => {
    //   return this.props.activeFileIds.indexOf(file.id) !== -1;
    // });
    // const lastActiveFile = activeFiles[activeFiles.length - 1];
    // const activeFileIds = activeFiles.map(file => file.id);
    return (
      <React.Fragment>
        <SideBar primary />
        <div
          id="Dashboard"
          className="flex-grow-1 d-flex flex-column pl-4 pr-4"
        >
          <h1>Home</h1>
          <FileNavigation />
          {/* <FilesList drive={ONEDRIVE} /> */}
          <FilesList drive={DROPBOX} />

          <hr />
          {/* <FilesList drive={GOOGLEDRIVE} /> */}
        </div>
        <SideBar secondary>
          {/* {activeFiles.length == 0
            ? "No file selected"
            : `Total Selected Files: ${activeFiles.length}`} */}
        </SideBar>
      </React.Fragment>
    );
  }
}

export default requireAuth(Dashboard);
