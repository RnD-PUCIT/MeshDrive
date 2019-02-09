import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileItem from "../../components/FileItem/FileItem";
import intruptApiRequest from "../../actions/api/intruptApiRequest";
import fetchRootFilesAllDrives from "../../actions/files/fetchRootFilesAllDrives";
import jsonCompare from "../../utils/jsonCompare";
import { resolve } from "path";
import { rejects } from "assert";
import Async from "react-promise";
const dateformat = require("dateformat");
var filterType = require("../Filtering/FilterTypes");

class FilesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: "",
      files: [],
      filteredFiles: [],
      componentDidUpdated: false
    };
  }

  componentDidMount() {
    this.props.fetchRootFilesAllDrives();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.files) {
      this.setState({
        parent: nextProps.files.parent,
        files: nextProps.files.files,
        filteredFiles: nextProps.files.files,
        componentDidUpdated: true
      });
    }
  }

  componentWillUnmount() {
    this.props.intruptApiRequest();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log("FILES LSIT component updated");
  //   const files = this.props.files.files;
  //   const parent = this.props.files.parent;

  //   // const drives = this.props.files;
  //   // if (drives[Symbol.iterator] !== undefined) {
  //   //   for (let driveItem of drives) {
  //   //     const { email, drive, files } = driveItem;
  //   //     allFiles = allFiles.concat(
  //   //       files.map(file => {
  //   //         // adding additional attributes to file
  //   //         file.drive = drive;
  //   //         file.account = email;
  //   //         // file.fileId = file.id;
  //   //         // file.id = `${drive}/${file.id}`;
  //   //         return file;
  //   //       })
  //   //     );
  //   //   }
  //   // }
  //   // this.setState({ componentDidUpdated: true });
  //   // debugger;
  // }

  applyTimeFilter(passedFiles) {

    if (this.props.filters.CreationTime[0][filterType.Today] == false &&
      this.props.filters.CreationTime[1][filterType.ThisWeek] == false &&
      this.props.filters.CreationTime[2][filterType.ThisMonth] == false &&
      this.props.filters.CreationTime[3][filterType.ThisYear] == false
    ) {
      return new Promise((resolve, reject) => { resolve(passedFiles) });
    }

    let filtered = passedFiles.filter(file => {
      if (this.props.filters.CreationTime[0][filterType.Today] == true) {
        var today = dateformat(new Date(), "yyyy-mm-dd");
        var fileDate = dateformat(file.createdTime, "yyyy-mm-dd");

        if (fileDate == today) {
          console.log(file.createdTime);
          console.log(today);
          console.log(fileDate);
          return file;


        }
      }
      else if (this.props.filters.CreationTime[1][filterType.ThisWeek] == true) {
        // flag=true;
        //   var today = dateformat(new Date(),'yyyy-mm-dd');
        //  var fileDate = dateformat(file.createdTime,'yyyy-mm-dd');
        //   if(fileDate==today)
        //   {
        //       return file;
        //   }
      }
      else if (this.props.filters.CreationTime[2][filterType.ThisMonth] == true) {

        var today = dateformat(new Date(), "yyyy-mm");
        var fileDate = dateformat(file.createdTime, "yyyy-mm");

        if (fileDate == today) {
          console.log(file.createdTime);
          console.log(today);
          console.log(fileDate);
          return file;
        }
      }
      else if (this.props.filters.CreationTime[3][filterType.ThisYear] == true) {

        var today = dateformat(new Date(), "yyyy");

        var fileDate = dateformat(file.createdTime, "yyyy");
        console.log(fileDate);
        if (fileDate == today) {
          console.log(file.createdTime);
          console.log(today);
          console.log(fileDate);
          return file;
        }
      }
    });
    return new Promise((resolve, reject) => { resolve(filtered) });
  }

  applyDriveFilter(passedFiles) {

    if (this.props.filters.Drive[0][filterType.GD] == false &&
      this.props.filters.Drive[1][filterType.OD] == false &&
      this.props.filters.Drive[2][filterType.DBX] == false) {
      return new Promise((resolve, reject) => { resolve(passedFiles) });
    }
    const filtered = passedFiles.filter(file => {
      if (this.props.filters.Drive[0][filterType.GD] == true) {

        if (file.drive == filterType.GD) {
          console.log(file.drive);
          return file;
        }
      }
      if (this.props.filters.Drive[1][filterType.OD] == true) {

        if (file.drive == filterType.OD) {
          console.log(file.drive);
          return file;
        }
      }
      if (this.props.filters.Drive[2][filterType.DBX] == true) {

        if (file.drive == filterType.DBX) {
          console.log(file.drive);
          return file;
        }
      }
    });
    return new Promise((resolve, reject) => { resolve(filtered) });
  }
  applyTypeFilter(passedFiles) {
    if (this.props.filters.Type[0][filterType.PDF] == false &&
      this.props.filters.Type[1][filterType.Word] == false &&
      this.props.filters.Type[2][filterType.Spreadsheets] == false &&
      this.props.filters.Type[3][filterType.Pictures] == false &&
      this.props.filters.Type[4][filterType.Videos] == false &&
      this.props.filters.Type[5][filterType.Audios] == false) {
      return new Promise((resolve, reject) => { resolve(passedFiles) });
    }
    let filtered = passedFiles.filter(file => {
      if (this.props.filters.Type[0][filterType.PDF] == true) {

        if (file.mimeType.includes("application/pdf")) {
          return file;
        }
      }
      if (this.props.filters.Type[1][filterType.Word] == true) {

        if (file.mimeType.includes("doc") || file.mimeType.includes("docx")) {
          return file;
        }
      }
      if (this.props.filters.Type[2][filterType.Spreadsheets] == true) {

        if (
          file.mimeType.includes("spreadsheet") ||
          file.mimeType.includes("xls")
        ) {
          return file;
        }
      }
      if (this.props.filters.Type[3][filterType.Pictures] == true) {

        if (file.mimeType.includes("image")) {
          return file;
        }
      }
      if (this.props.filters.Type[4][filterType.Videos] == true) {

        if (
          file.mimeType.includes("mp4") ||
          file.mimeType.includes("avi") ||
          file.mimeType.includes("mkv")
        ) {
          return file;
        }
      }
      if (this.props.filters.Type[5][filterType.Audios] == true) {

        if (file.mimeType.includes("mp3")) {
          return file;
        }
      }
    });
    return new Promise((resolve, reject) => { resolve(filtered) });
  }
  sortFileItems(fileItems) {
    let folders = fileItems.filter(fileItem => fileItem.mimeType === "folder");
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

    let files = fileItems.filter(fileItem => fileItem.mimeType !== "folder");
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
    console.log("rENDERINGGGGGG");
    var fileItems = this.sortFileItems(this.state.files);
    // console.log(this.state.files);
    //______________ SEARCHING _____________________
    console.log(this.props.searchKeyword.keywords);
    if (this.props.searchKeyword.keywords != "") {
      fileItems = fileItems.filter(file => {
        if (
          file.name
            .toUpperCase()
            .includes(this.props.searchKeyword.keywords.toUpperCase()) == true
        ) {
          return file;
        }
      });
    }
    //______________ FILTERING _____________________
    console.log(" START FILTERING ");

    // this.applyDriveFilter(fileItems).then((driveFiles)=>{
    //   console.log("Drive files: "+ driveFiles);
    //   this.applyTimeFilter(driveFiles).then((timeFiles)=>{
    //     console.log("Time files: "+ timeFiles);
    //     this.applyTypeFilter(timeFiles).then((typeFiles)=>{
    //       console.log("Type files: "+ typeFiles);


    //     });

    //   });

    // });

    // let timeFiltered = this.applyTimeFilter(driveFiltered);
    // console.log("Time files: "+ timeFiltered);
    // let typeFiltered = this.applyTypeFilter(typeFiltered);
    // console.log("Type files: "+ typeFiltered);



    
    // seperate folders

    // const mapFilesList = fileItems.map(file => {
    //   const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
    //   return <FileItem key={file.id} file={file} isFileActive={isFileActive} />;
    // });
    // let display;
    // if (!this.state.componentDidUpdated) {
    //   display = "Loading... Please wait";
    // } else if (this.state.files.length === 0) {
    //   display = "No file exist or no drive added";
    // } else if (fileItems.length === 0) {
    //   display = "No such file exists in your drives";
    // } else {
    //   display = mapFilesList;
    // }


    return (
      <Async promise={this.applyDriveFilter(fileItems)} then={(driveFiles) =>
        <Async promise={this.applyTimeFilter(driveFiles)} then={(timeFiles) =>
          <Async promise={this.applyTypeFilter(timeFiles)} then={(typeFiles) =>
            <React.Fragment>
              <div className="files-list d-flex flex-row flex-wrap">{
                !this.state.componentDidUpdated? "Loading.. Please Wait" : typeFiles.map(file => {
                  const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
                  return <FileItem key={file.id} file={file} isFileActive={isFileActive} />;
                })}</div>
            </React.Fragment>
          } />
        } />
      } />


    );



  }
}

function mapStateToProps({
  filters,
  fileNavigation,
  files,
  activeFileIds,
  searchKeyword
}) {
  return {
    fileNavigation,
    files,
    activeFileIds,
    searchKeyword,
    filters
  };
}
export default connect(
  mapStateToProps,
  { fetchRootFilesAllDrives, intruptApiRequest }
)(FilesList);
