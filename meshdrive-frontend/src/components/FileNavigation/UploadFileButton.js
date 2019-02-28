import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import requestUploadFile from "../../actions/files/requestUploadFile";

class CreateUploadModal extends Component {
  state = {
    showModal: false,
    files: [],
    isFileValid: false,
    drive: null,
    uploadFileEmail: "",
    valid: false,
    redirect: false
  };



  handleFolderModalCancel = e => {
    e.preventDefault();
    this.setState(
      {
        showModal: false,
        drive: null,
        uploadFileEmail: "",
        valid: false,
        files: []
      }
    );
  };
  handleFolderSubmit = e => {
    e.preventDefault();
    const historyStack = this.props.fileNavigation.historyStack;

    this.setState(
      {
        showModal: false,
        drive: historyStack[historyStack.length - 1].drive,
        uploadFileEmail: historyStack[historyStack.length - 1].driveEmail
      }

    );
    const drive = historyStack[historyStack.length - 1].drive;
    const driveEmail = historyStack[historyStack.length - 1].driveEmail;
    const parent = historyStack[historyStack.length - 1].parent;
    this.props.requestUploadFile(drive, this.state.files, driveEmail, parent);
    this.setState({
      files: []
    })

  };

  onDrop = acceptedFiles => {
    this.setState({ files: [...this.state.files, ...acceptedFiles] });
    acceptedFiles.forEach(file => {
      console.log(file);
    });
    this.setState({ isFileValid: true }, this.isValidState);
  };

  decide = e => {

    if (this.props.fileNavigation.historyStack.length <= 1) {
      window.location = '/#/uploadfile';
    }
    else
      this.setState({ showModal: true });
  }
  render() {
    const historyStack = this.props.fileNavigation.historyStack;
    return (
      <React.Fragment>
        <Button
          className="btn btn-gradient"
          onClick={this.decide}
        >
          <FAIcon icon="plus" classes={["fa"]} /> Upload Here
        </Button>
        <Modal
          centered
          isOpen={this.state.showModal}
          onAbort={this.handleFolderModalCancel}
        >
          <Form onSubmit={this.handleFolderSubmit}>
            <ModalHeader>Upload Files in {historyStack.length != 0 ? historyStack[historyStack.length - 1].folderName : ""} </ModalHeader>
            <ModalBody>
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
                    {f.name}  ~  {f.size / 1024 / 1024} MB
                <FAIcon icon="cancel" classes={["fa"]} />
                  </ListGroupItem>

                ))}
              </ListGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={!this.state.isFileValid} onClick={this.handleFolderSubmit}>
                Upload
              </Button>
              <Button color="secondary" onClick={this.handleFolderModalCancel}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
function mapStateToProps({ fileNavigation }) {
  return {
    fileNavigation
  };
}
export default connect(
  mapStateToProps,
  { requestUploadFile }
)(CreateUploadModal);
