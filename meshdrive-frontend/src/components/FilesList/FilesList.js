import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileItem from "../../components/FileItem/FileItem";
import intruptApiRequest from "../../actions/api/intruptApiRequest";
import fetchRootFilesAllDrives from "../../actions/files/fetchRootFilesAllDrives";
import jsonCompare from "../../utils/jsonCompare";
const dateformat = require("dateformat");
var filterType = require("../Filtering/FilterTypes");
class FilesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: "",
      files: [],
      componentDidUpdated: false
    };
  }

  componentDidMount() {
    debugger;
    this.props.fetchRootFilesAllDrives();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.files) {
      this.setState({
        parent: nextProps.files.parent,
        files: nextProps.files.files,
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
    console.log(this.state.files);
    debugger;

    var toBeFiltered = fileItems;
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

    let flag = false;
    const filtered = fileItems.filter(file => {
      if (this.props.filters.Type[0][filterType.PDF] == true) {
        flag = true;
        if (file.mimeType.includes("application/pdf")) {
          return file;
        }
      }
      if (this.props.filters.Type[1][filterType.Word] == true) {
        flag = true;
        if (file.mimeType.includes("doc") || file.mimeType.includes("docx")) {
          return file;
        }
      }
      if (this.props.filters.Type[2][filterType.Spreadsheets] == true) {
        flag = true;
        if (
          file.mimeType.includes("spreadsheet") ||
          file.mimeType.includes("xls")
        ) {
          return file;
        }
      }
      if (this.props.filters.Type[3][filterType.Pictures] == true) {
        flag = true;
        if (file.mimeType.includes("image")) {
          return file;
        }
      }
      if (this.props.filters.Type[4][filterType.Videos] == true) {
        flag = true;
        if (
          file.mimeType.includes("mp4") ||
          file.mimeType.includes("avi") ||
          file.mimeType.includes("mkv")
        ) {
          return file;
        }
      }
      if (this.props.filters.Type[5][filterType.Audios] == true) {
        flag = true;
        if (file.mimeType.includes("mp3")) {
          return file;
        }
      }
      if (this.props.filters.CreationTime[0][filterType.Today] == true) {
        flag = true;
        var today = dateformat(new Date(), "yyyy-mm-dd");
        var fileDate = dateformat(file.createdTime, "yyyy-mm-dd");
        if (fileDate == today) {
          return file;
        }
      }
      if (this.props.filters.CreationTime[1][filterType.ThisWeek] == true) {
        // flag=true;
        //   var today = dateformat(new Date(),'yyyy-mm-dd');
        //  var fileDate = dateformat(file.createdTime,'yyyy-mm-dd');
        //   if(fileDate==today)
        //   {
        //       return file;
        //   }
      }
      if (this.props.filters.CreationTime[2][filterType.ThisMonth] == true) {
        flag = true;
        var today = dateformat(new Date(), "yyyy-mm");
        var fileDate = dateformat(file.createdTime, "yyyy-mm");
        console.log(today);
        console.log(fileDate);
        if (fileDate == today) {
          return file;
        }
      }
      if (this.props.filters.CreationTime[3][filterType.ThisYear] == true) {
        flag = true;
        var today = dateformat(new Date(), "yyyy");
        var fileDate = dateformat(file.createdTime, "yyyy");
        console.log(fileDate);
        if (fileDate == today) {
          return file;
        }
      }
    });
    if (filtered.length != 0) fileItems = filtered;
    if (flag == true) fileItems = filtered;

    //______________ FILTERING _____________________
    console.log(fileItems);
    // seperate folders
    const mapFilesList = fileItems.map(file => {
      const isFileActive = this.props.activeFileIds.indexOf(file.id) !== -1;
      return <FileItem key={file.id} file={file} isFileActive={isFileActive} />;
    });

    let display;
    if (!this.state.componentDidUpdated) {
      display = "Loading... Please wait";
    } else if (this.state.files.length === 0) {
      display = "No file exist or no drive added";
    } else if (fileItems.length === 0) {
      display = "No such file exists in your drives";
    } else {
      display = mapFilesList;
    }

    return (
      <React.Fragment>
        <div className="files-list d-flex flex-row flex-wrap">{display}</div>
      </React.Fragment>
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
