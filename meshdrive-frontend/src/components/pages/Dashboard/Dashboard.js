// module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// custom module imports
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import FilesList from "../../FilesList/FilesList";
import requireAuth from "../../../hoc/requireAuth";
import { connect } from "react-redux";
import fetchTagsList from "../../../actions/user/fetchTagsList";
import FileNavigation from "../../FileNavigation/FileNavigation";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../../constants/strings";
import Filtering from "../../Filtering/Filtering";
import SpeechSearchBar from "../../SpeechSearching/SpeechSearchBar";

class Dashboard extends Page {
  componentDidMount()
  {
    if(this.props.user.tagsList.length==0)
      this.props.fetchTagsList();
  }
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
          <div style={{marginTop:'10px'}}>
          <SpeechSearchBar/>
          <Filtering/></div>
          <hr />
           {/* {<FilesList drive={ONEDRIVE} />} */}
          { <FilesList drive={DROPBOX} /> }
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
function mapStateToProps({tagsList})
{
  return {
    tagsList
  };
}

export default  connect(
  mapStateToProps,
  {
    fetchTagsList
  })(requireAuth(Dashboard));
