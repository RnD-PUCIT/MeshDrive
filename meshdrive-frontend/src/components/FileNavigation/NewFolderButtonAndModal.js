import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import requestCreateFolder from "../../actions/filenavigation/requestCreateFolder";

import { connect } from "react-redux";

import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";

import { ONEDRIVE } from "../../constants/strings";
import DriveAccountSelect from "../common/DriveAccountSelect";

class CreateFolderModal extends Component {
  state = {
    showModal: false,
    folderName: "",
    isFolderNameValid: false,

    // for root
    drive: null,
    createFolderEmail: null,
    isValidCreateEmail: false,
    isRoot: false,
    valid: false
  };

  isStateValid = () => {
    let valid = false;
    if (this.state.isRoot) {
      valid = this.state.isValidCreateEmail && this.state.isFolderNameValid;
    } else {
      valid = this.state.isFolderNameValid;
    }
    this.setState({
      valid
    });
  };
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.fileNavigation) !==
        JSON.stringify(this.props.fileNavigation) ||
      JSON.stringify(prevProps.files) !== JSON.stringify(this.props.files)
    ) {
      const { historyStack } = this.props.fileNavigation;
      if (historyStack.length > 0) {
        const currentFolder = historyStack[historyStack.length - 1];
        const isRoot = currentFolder.parent === "";
        let driveEmail = "";
        let drive = "";
        let isValidCreateEmail = false;

        if (!isRoot && currentFolder.files.length > 0) {
          driveEmail = currentFolder.files[0].driveEmail;
          drive = currentFolder.files[0].drive;
          isValidCreateEmail = true;

          console.log({
            isRoot,
            createFolderEmail: driveEmail,
            isValidCreateEmail,
            drive: drive
          });
          debugger;
        }
        this.setState(
          {
            isRoot,
            createFolderEmail: driveEmail,
            isValidCreateEmail,
            drive: drive
          },
          this.isStateValid
        );
      }
      //debugger;
    }
  }

  // for root
  handleDriveSelect = drive => {
    this.setState({ drive });
    //debugger;
  };

  // for root
  handleDriveAccountSelect = email => {
    this.setState(
      { createFolderEmail: email, isValidCreateEmail: true },
      this.isStateValid
    );
    //debugger;
  };

  handleFolderNameChange = e => {
    const folderName = e.target.value;
    this.setState(
      {
        folderName: folderName,
        isFolderNameValid: folderName.length > 0
      },
      this.isStateValid
    );
  };
  handleFolderModalCancel = e => {
    e.preventDefault();
    this.setState(
      {
        showModal: false,
        folderName: "",
        isFolderNameValid: false,
        createFolderEmail: null,
        isValidCreateEmail: false
      },
      this.isStateValid
    );
  };
  handleFolderSubmit = e => {
    e.preventDefault();

    if (this.state.valid) {
      const { folderName, createFolderEmail } = this.state;

      const { historyStack } = this.props.fileNavigation;
      const currentFolder = historyStack[historyStack.length - 1];

      this.props.requestCreateFolder(
        this.state.drive,
        folderName,
        currentFolder.parent,
        createFolderEmail
      );
      this.setState(
        {
          showModal: false,
          folderName: "",
          isFolderNameValid: false,
          createFolderEmail: null,
          isValidCreateEmail: false
        },
        this.isStateValid
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <Button
          disabled={!this.props.enabled}
          onClick={() => this.setState({ showModal: true })}
        >
          <FAIcon icon="plus" classes={["fa"]} /> New Folder
        </Button>
        <Modal
          centered
          isOpen={this.state.showModal}
          onAbort={this.handleFolderModalCancel}
        >
          <Form onSubmit={this.handleFolderSubmit}>
            <ModalHeader>Create a New Folder</ModalHeader>
            <ModalBody>
              {this.state.isRoot && (
                <FormGroup>
                  <DriveAccountSelect
                    onSelectValidDrive={this.handleDriveSelect}
                    onSelectValidDriveAccount={this.handleDriveAccountSelect}
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Label for="folderName">Folder Name</Label>
                <Input
                  valid={this.state.isFolderNameValid}
                  onChange={this.handleFolderNameChange}
                  type="text"
                  name="folderName"
                  id="folderName"
                  placeholder="Enter folder name"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={!this.state.valid}>
                Create
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
function mapStateToProps({ files, fileNavigation }) {
  return {
    files,
    fileNavigation
  };
}
export default connect(
  mapStateToProps,
  { requestCreateFolder }
)(CreateFolderModal);
