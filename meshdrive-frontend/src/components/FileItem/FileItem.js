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
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getMimeTypeIcon } from "../../constants/mimeTypes";
import "./styles.css";
import { Tag } from "@zendeskgarden/react-tags";
import '@zendeskgarden/react-tags/dist/styles.css';


class FileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.isFileActive,
      modal: false,
      activeFile: null,
      selectedTagsList: []
    };

    this.isFolder =
      this.props.file.mimeType === "folder";
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
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
    console.log(file);
  };
  handleContextMenuClick = menu => {
    const { file } = this.props;


    switch (menu) {
      case "download":
        return this.props.downloadFile(this.props.drive, file.account, file);
      case "tag":
        this.setState({
          activeFile: file.id
        });
        this.toggle();
        return;
    }
  };

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

    const displayTags = this.props.user.tagsList.map(tag =>
      (
        <tr style={{ height: '5px' }} key={tag._id}>
          <td style={{ backgroundColor: tag.color }}>{tag.name}</td>
          <td>{tag.description}</td>

        </tr>
      )
    );
    const fileItemIcon = getMimeTypeIcon(file.mimeType);
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
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>Assign Tags</ModalHeader>
          <ModalBody>
            <div className="assignedTags">

            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>
            <Tag pill>Memona</Tag>

            </div>


            <Table hover >
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayTags}
              </tbody>
            </Table>


          </ModalBody>
          <ModalFooter>
            {

            }
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
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
      fetchTagsList
    },
    dispatch

  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileItem);
