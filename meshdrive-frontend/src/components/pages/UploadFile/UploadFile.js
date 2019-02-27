// module imports
import React, { Component } from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { Fade } from "react-reveal";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import toStream from "blob-to-stream";
import request from "request";
import _ from "lodash";
// custom module imports
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../../constants/strings";
import requireAuth from "../../../hoc/requireAuth";
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import uploadFile from "../../../actions/files/uploadFileOLD";
import requestUploadFile from "../../../actions/files/requestUploadFile";
import "./styles.css";
import DriveAccountSelect from "../../common/DriveAccountSelect";

class UploadFile extends Page {
  state = {
    onDragEnter: false,
    files: [],
    isFileValid: false,
    drive: null,
    uploadFileEmail: "",
    valid: false
  };

  isValidState = () => {
    this.setState({
      valid:
        this.state.drive && this.state.uploadFileEmail && this.state.isFileValid
    });
  };

  onDrop = acceptedFiles => {
    this.setState({ files: [...this.state.files, ...acceptedFiles] });
    acceptedFiles.forEach(file => {
      console.log(file);
    });
    this.setState({ isFileValid: true }, this.isValidState);
  };

  handleDriveSelect = drive => {
    this.setState({ drive }, this.isValidState);
  };
  handleDriveAccountSelect = email => {
    this.setState({ uploadFileEmail: email }, this.isValidState);
  };

  handleSubmit = event => {
    event.preventDefault();
    const { drive, files, uploadFileEmail } = this.state;
    console.log({ drive, files, uploadFileEmail });

    this.props.requestUploadFile(
      this.state.drive,
      this.state.files,
      this.state.uploadFileEmail,
      "root"
    );
  };
  render() {
    return (
      <React.Fragment>
        <SideBar primary />
        <div
          id="Upload File"
          className="flex-grow-1 d-flex flex-column pl-4 pr-4"
        >
          <h1>Upload File</h1>
          <Dropzone
            className={
              "filedropzone shadow p-5 mb-2 bg-light rounded border-primary" +
              (this.state.onDragEnter ? " onDragEnter" : "")
            }
            onDrop={this.onDrop}
          >
            Try dropping some files here, or click to select files to upload.
          </Dropzone>
          <ListGroup>
            {this.state.files.map(f => (
              <ListGroupItem key={f.name}>
                {f.name} - {f.size} bytes
              </ListGroupItem>
            ))}
          </ListGroup>
          <br />
          <DriveAccountSelect
            onSelectValidDrive={this.handleDriveSelect}
            onSelectValidDriveAccount={this.handleDriveAccountSelect}
          />
          <div>
            <br />
            <Button
              onClick={this.handleSubmit}
              disabled={!this.state.valid}
              className={!this.state.valid ? "disabled" : "btn-gradient"}
            >
              Upload
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(
  mapStateToProps,
  { requestUploadFile }
)(requireAuth(UploadFile));
