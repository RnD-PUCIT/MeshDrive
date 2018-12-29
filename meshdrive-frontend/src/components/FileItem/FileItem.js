import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
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
import ReactLoading from 'react-loading';
import shouldFetchTagsOfFile from "../../actions/files/fetchTagsOfFile";
import {
  Table,
  Button, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { getMimeTypeIcon } from "../../constants/mimeTypes";
import "./styles.css";
import { Tag, Close } from "@zendeskgarden/react-tags";
import '@zendeskgarden/react-tags/dist/styles.css';
import SideBar from "../Layout/SideBar/SideBar";
import filesReducer from "../../reducers/filesReducer";


class FileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.isFileActive,
      modal: false,
      activeFile: null,
      file: this.props.file,
      // selectedTagsList: file.tagsList,
      activeIndex: -1
    };

    this.isFolder =
      this.props.file.mimeType === "folder";
    this.toggle = this.toggle.bind(this);
    this.AddTagToList = this.AddTagToList.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.fetchAssignedTags = this.fetchAssignedTags.bind(this);
  }
  componentDidUpdate() {
    console.log("COMP DID UPDATE");
  }
  toggle() {
    const { file } = this.props;
    if(file.tagsList.findIndex(t=>t.name==="null")!=-1 && !this.state.modal===false)
      {
        this.removeTag(file.tagsList.findIndex(t=>t.name==="null"));
        let fileInfo = {};
        fileInfo.driveEmail = file.account;
        fileInfo.driveType = file.drive;
        fileInfo.fileId = file.id;
        this.props.shouldFetchTagsOfFile(file.tagsList,fileInfo);
       }
    this.setState({
      modal: !this.state.modal
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
      this.props.fetchFilesById(this.props.drive, file.account, file.id);
    }
    else {

    }
  };
  handleContextMenuClick = menu => {
    const { file } = this.props;
    let fileInfo = {};
    fileInfo.driveEmail = file.account;
    fileInfo.driveType = file.drive;
    fileInfo.fileId = file.id;
    switch (menu) {
      case "download":
        return this.props.downloadFile(this.props.drive, file.account, file);
      case "tag":
        {
          this.props.fetchTagsOfFile(fileInfo);
          this.toggle();
          setTimeout(
            () => { this.setState(this.state); }
            , 5000);
          return;
        }

      case "details":

        return;
    }
  };

  handleAssignTagsToFile = (file) => {
    let fileInfo = {};
    fileInfo.driveEmail = file.account;
    fileInfo.driveType = file.drive;
    fileInfo.fileId = file.id;
    fileInfo.tagsIdList = file.tagsList;
    this.props.assignTagsToFile(fileInfo);
    this.props.fetchTagsOfFile(fileInfo);
    // this.state.selectedTagsList = file.tagsList;
    this.setState({
      // selectedTagsList:this.state.selectedTagsList
    })
    this.toggle();
  }

  fetchAssignedTags = (file) => {
    let fileInfo = {};
    fileInfo.driveEmail = file.account;
    fileInfo.driveType = file.drive;
    fileInfo.fileId = file.id;
    this.props.fetchTagsOfFile(fileInfo);
  }

  AddTagToList = (tag, index) => {
    const { file } = this.props;
    if(file.tagsList.findIndex(t=>t.name==="null")!=-1)
      {
        this.removeTag(file.tagsList.findIndex(t=>t.name==="null"));
        let fileInfo = {};
        fileInfo.driveEmail = file.account;
        fileInfo.driveType = file.drive;
        fileInfo.fileId = file.id;
        this.props.shouldFetchTagsOfFile(file.tagsList,fileInfo);
       }
    if (file.tagsList.findIndex(t => t.name === tag.name) === -1)
      file.tagsList.push(tag);
    this.setState({
      activeIndex: index
      // selectedTagsList: this.state.selectedTagsList
    });
  }
  removeTag = (i) => {
    const { file } = this.props;
    file.tagsList.splice(i, 1);
    this.setState({
      activeIndex: -1
    });
  }
  UpdateState = () => {
    this.setState(
      this.state
    );
  }
  render() {
    const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;
    const { file } = this.props;


    let driveIcon = null;
    switch (file.drive) {
      case "googledrive":
        driveIcon = <FAIcon icon="google" classes={["fab"]} />;
        break;
      case "dropbox":
        driveIcon = <FAIcon icon="dropbox" classes={["fab"]} />;
        break;
      case "onedrive":
        driveIcon = <FAIcon icon="cloud" classes={["fa"]} />;
        break;
    }

    const fileItemIcon = getMimeTypeIcon(file.mimeType);
    let nullTag = {
      id:"null",
      name:"null",
      description:"null",
      color:"null"
    };
    let displayTags;
    if(file.tagsList.length===0)
     { displayTags= (<center> 
      <ReactLoading type='balls' color='1e90ff' height={'5%'} width={'10%'}/>
      </center>);
     }
    else if(file.tagsList.findIndex(t=>t.name==="null")!=-1 && file.tagsList.length===1)
    displayTags = <div> No Tags Assigned Yet</div>;
    else 
  {  
    displayTags = <div className="assignedTags">
    {        
      file.tagsList.map(tag =>
        (                 
          <Tag
            className="Tag"
            style={{ backgroundColor: tag.color }}
            size="large"
          >{tag.name}
            <Close onClick={() => { this.removeTag(file.tagsList.indexOf(tag)) }} /></Tag>
        ))
    }
  </div>;
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
        <Modal width='900px' isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>Assign Tags to {file.name}</ModalHeader>
          <ModalBody>      
           {displayTags}
            <Table hover >
              <tbody>
                {
                  this.props.user.tagsList.map((tag, index) => {

                    //const selectedTagIndicator = file.tagsList.indexOf(tag) >= 0? <FAIcon icon="check" classes={["fa"]} /> : ' ';
                    return (
                      <tr className="tagRow" onClick={() => { this.AddTagToList(tag, index) }}>
                        <td key={tag._id} style={{ height: '60px' }}
                        >
                          <Tag className="tagColorBox" style={{ backgroundColor: tag.color }}></Tag>
                          <span
                            className="tagNameHeading"
                          >
                            {tag.name}
                          </span>
                          <div className="tagDesc">{tag.description}</div>
                        </td>
                        <td>
                          {file.tagsList.findIndex(t => t.name === tag.name) !== -1 ? <FAIcon icon="check" classes={["fa"]} /> : ' '}
                        </td>
                      </tr>
                    );
                  }
                  )
                }
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => { this.handleAssignTagsToFile(file) }}>Save Tags</Button>
            <Button color="secondary" onClick={() => {
              this.props.file.tagsList =[];
              this.toggle();
            }}>Cancel</Button>
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
              data-tip={`Drive Account: ${file.account}`}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);
