import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { GOOGLEDRIVE, ONEDRIVE, DROPBOX } from "../../constants/strings";
// import toggleFileActive from "../../actions/files/toggleFileActive";
import FAIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import setActiveFile from "../../actions/activeFilesIds/setActiveFile";
import unsetActiveFile from "../../actions/activeFilesIds/unsetActiveFile";
import downloadFile from "../../actions/files/downloadFile";
import fetchTagsList from "../../actions/user/fetchTagsList";
import fetchFilesById from "../../actions/files/fetchFilesById";
import fetchTagsOfFile from "../../actions/files/fetchTagsOfFile";
import assignTagsToFile from "../../actions/files/assignTagsToFile";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactLoading from "react-loading";
import shouldFetchTagsOfFile from "../../actions/files/fetchTagsOfFile";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { getMimeTypeIcon } from "../../constants/mimeTypes";
import "./styles.css";
import { Tag, Close } from "@zendeskgarden/react-tags";
import "@zendeskgarden/react-tags/dist/styles.css";
import SideBar from "../Layout/SideBar/SideBar";
import filesReducer from "../../reducers/filesReducer";

import jsonCompare from "../../utils/jsonCompare";

class FileItem extends Component {
  constructor(props) {
    super(props);
    const tl = this.props.file.tagsList;
    this.state = {
      active: this.props.isFileActive,
      modal: false,
      file: {},
      activeFile: null,
      selectedTagsList: tl,
      activeIndex: -1
    };
    this.isFolder = this.props.file.mimeType === "folder";
    this.toggle = this.toggle.bind(this);
    this.AddTagToList = this.AddTagToList.bind(this);
    this.removeTag = this.removeTag.bind(this);
    // this.fetchAssignedTags = this.fetchAssignedTags.bind(this);
  }
  // shouldComponentUpdate(nextProps) {
  //   return !jsonCompare(nextProps.file, this.props.file) || !jsonCompare(nextProps.user, this.props.user);
  // }
  componentDidUpdate() {
    console.log("COMP DID UPDATE");
    // this.setState({
    //   selectedTagsList: this.props.file.tagsList,
    //   file: this.props.file
    // });
  }
  toggle() {
    const { file } = this.props;
    console.log("I AM CLICKKED");
    let tl = JSON.parse(JSON.stringify(file.tagsList));
    console.log(tl);
    this.setState({
      modal: !this.state.modal,
      selectedTagsList: tl
    });
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
        file.drive,
        file.driveEmail,
        file.id,
        false,
        file.path
      );
    } else {
    }
  };
  handleContextMenuClick = menu => {
    const { file } = this.props;
    let fileInfo = {};
    fileInfo.driveEmail = file.driveEmail;
    fileInfo.driveType = file.drive;
    fileInfo.fileId = file.id;
    switch (menu) {
      case "download":
        return this.props.downloadFile(this.props.drive, file.driveEmail, file);
      case "tag": {
        console.log("I AM CLICKED");
        this.toggle();
        return;
      }

      case "details":
        return;
    }
  };

  handleAssignTagsToFile = file => {
    let fileInfo = {};
    fileInfo.driveEmail = file.driveEmail;
    fileInfo.driveType = file.drive;
    fileInfo.fileId = file.id;
    fileInfo.tagsIdList = this.state.selectedTagsList;
    this.props.assignTagsToFile(fileInfo);
    //  // this.state.selectedTagsList = file.tagsList;
    //   this.setState({
    //     selectedTagsList: this.state.selectedTagsList
    //   })
    this.toggle();
  };
  AddTagToList = (tag, index) => {
    const { file } = this.props;

    if (this.state.selectedTagsList.findIndex(t => t.name === tag.name) === -1)
      this.state.selectedTagsList.push(tag);
    this.setState({
      activeIndex: index,
      selectedTagsList: this.state.selectedTagsList
    });
  };
  removeTag = i => {
    this.state.selectedTagsList.splice(i, 1);
    this.setState({
      activeIndex: -1,
      selectedTagsList: this.state.selectedTagsList
    });
  };
  UpdateState = () => {
    this.setState(this.state);
  };
  render() {
    const closeBtn = (
      <button className="close" onClick={this.toggle}>
        &times;
      </button>
    );
    const { file } = this.props;

    let driveIcon = null;
    switch (file.drive.toUpperCase()) {
      case GOOGLEDRIVE:
        driveIcon = <FAIcon icon="google" classes={["fab"]} />;
        break;
      case DROPBOX:
        driveIcon = <FAIcon icon="dropbox" classes={["fab"]} />;
        break;
      case ONEDRIVE:
        driveIcon = <FAIcon icon="cloud" classes={["fa"]} />;
        break;
    }

    const fileItemIcon = getMimeTypeIcon(file.mimeType);
    let displayTags;
    // if(file.tagsList.length===0)
    //  { displayTags= (<center>
    //   <ReactLoading type='balls' color='1e90ff' height={'5%'} width={'10%'}/>
    //   </center>);
    //  }
    // else
    if (this.state.selectedTagsList.length === 0)
      displayTags = <div> No Tags Assigned Yet <hr></hr></div>;
    else {
      displayTags = (
        <div className="assignedTags">
          {this.state.selectedTagsList.map(tag => (
            <Tag
              className="Tag"
              style={{ backgroundColor: tag.color }}
              size="large"
            >
              {tag.name}
              <Close
                onClick={() => {
                  this.removeTag(this.state.selectedTagsList.indexOf(tag));
                }}
              />
            </Tag>
          ))}
        </div>
      );
    }
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
        <Modal width="900px" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>
            Assign Tags to {file.name}
          </ModalHeader>
          <ModalBody>
            {displayTags}
            <Table hover>
              <tbody>
                {this.props.user.tagsList.map((tag, index) => {
                  //const selectedTagIndicator = file.tagsList.indexOf(tag) >= 0? <FAIcon icon="check" classes={["fa"]} /> : ' ';
                  return (
                    <tr
                      className="tagRow"
                      onClick={() => {
                        this.AddTagToList(tag, index);
                      }}
                    >
                      <td key={tag._id} style={{ height: "60px" }}>
                        <Tag
                          className="tagColorBox"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="tagNameHeading">{tag.name}</span>
                        <div className="tagDesc">{tag.description}</div>
                      </td>
                      <td>
                        {this.state.selectedTagsList.findIndex(
                          t => t.name === tag.name
                        ) !== -1 ? (
                          <FAIcon icon="check" classes={["fa"]} />
                        ) : (
                          " "
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAssignTagsToFile(file);
              }}
            >
              Save Tags
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                this.toggle();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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
              data-tip={`Drive Account: ${file.driveEmail}`}
              data-for={file.id}
            >
              {driveIcon}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={file.id}>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => this.handleContextMenuClick("tag")}
          >
            Assign Tags
          </MenuItem>
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
function mapStateToProps({ user }) {
  return {
    user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveFile,
      unsetActiveFile,
      downloadFile,
      fetchFilesById,
      fetchTagsList,
      assignTagsToFile,
      fetchTagsOfFile,
      shouldFetchTagsOfFile
    },
    dispatch
  );
}

FileItem.propTypes = {
  file: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);
