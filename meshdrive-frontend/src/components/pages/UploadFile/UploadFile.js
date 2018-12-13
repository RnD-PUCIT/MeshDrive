// module imports
import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  ButtonGroup,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from "reactstrap";
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
import FAIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
import requestUploadFile from "../../../actions/files/requestUploadFile";
import "./styles.css";

class UploadFile extends Page {
  state = {
    onDragEnter: false,
    files: [],
    drive: null,
    displayEmailAccounts: [],
    activeEmailAccount: "",
    isDriveValid: false,
    isActiveEmailAccountValid: false,
    isFileValid: false,
    valid: false
  };

  isValidState = () => {
    this.setState({
      valid:
        this.state.isDriveValid &&
        this.state.isActiveEmailAccountValid &&
        this.state.isFileValid
    });
  };

  // file drop
  //   onDrop= acceptedFiles => {
  //     const req = request.post('/upload');
  //     acceptedFiles.forEach(file => {
  //         req.attach(file.name, file);
  //     });
  //     req.end(callback);
  // }
  onDrop = acceptedFiles => {
    this.setState({ files: [...this.state.files, ...acceptedFiles] });
    acceptedFiles.forEach(file => {
      console.log(file);

      //   const reader = new FileReader();
      //   reader.onload = () => {
      //     const fileAsBinaryString = reader.result;
      //     // do whatever you want with the file content
      //   };
      //   reader.onabort = () => console.log("file reading was aborted");
      //   reader.onerror = () => console.log("file reading has failed");

      //   reader.readAsBinaryString(file);
    });
    this.setState({ isFileValid: true }, this.isValidState);
  };

  handleSubmit = event => {
    event.preventDefault();

    console.log(this.state.files);

    this.props.requestUploadFile(
      this.state.drive,
      this.state.files,
      this.state.activeEmailAccount
    );

    /*_________________________________________________________________________ */
    /* CODE BY MEMONA: */
    /*_________________________________________________________________________ */

    // console.log(event.target.value);

    // const fileWithInfo = {
    //   files: this.state.files,
    //   drive: this.state.drive
    // };
    // /*_________________________________________________________________________ */
    // var formData = new FormData();
    // this.state.files.forEach(file => {
    //   const r = request.post(
    //     "https://35ddc7fe.ngrok.io/file",
    //     (err, resp, body) => {
    //       if (resp) console.log("pipe response: ", resp);
    //       if (err) console.log("error : ", err);
    //       if (body) console.log("body: ", body);
    //     }
    //   );
    //   var stream = toStream(file);
    //   stream.pipe(r);

    //   stream.on("finish", function() {
    //     alert("File uploaded");
    //   });
    // });
    // /*_________________________________________________________________________ */
    // //console.log(fileWithInfo);
    // //this.props.uploadFile(fileWithInfo);
    // //this.setState({ file: "" });
    // //alert("File uploaded");
  };

  setActiveEmailAccount = email => {
    this.setState(
      {
        activeEmailAccount: email,
        isActiveEmailAccountValid: true
      },
      this.isValidState
    );
  };

  handleGoogleDriveClick = () => {
    const { driveAccountsList = null } = this.props.user;
    const { googleDriveAccountsList } = driveAccountsList;
    this.setState(
      {
        drive: GOOGLEDRIVE,
        displayEmailAccounts: googleDriveAccountsList,
        isDriveValid: true
      },
      this.isValidState
    );
  };
  handleDropboxClick = () => {
    const { driveAccountsList = null } = this.props.user;
    const { dropboxAccountsList } = driveAccountsList;
    this.setState(
      {
        drive: DROPBOX,
        displayEmailAccounts: dropboxAccountsList,
        isDriveValid: true
      },
      this.isValidState
    );
  };
  handleOneDriveClick = () => {
    const { driveAccountsList = null } = this.props.user;
    const { oneDriveAccountsList } = driveAccountsList;
    this.setState(
      {
        drive: ONEDRIVE,
        displayEmailAccounts: oneDriveAccountsList,
        isDriveValid: true
      },
      this.isValidState
    );
  };
  render() {
    const mapAccountsListToListGroupItem = this.state.displayEmailAccounts.map(
      email => (
        <ListGroupItem
          key={email}
          tag="button"
          action
          active={this.state.activeEmailAccount === email}
          onClick={() => {
            this.setActiveEmailAccount(email);
          }}
        >
          {email}
        </ListGroupItem>
      )
    );

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
          <Label>Select Drive</Label>
          <ButtonGroup className="mt-2 mb-4">
            <Button
              color="danger"
              outline
              onClick={this.handleGoogleDriveClick}
              active={this.state.drive === GOOGLEDRIVE}
            >
              <FAIcon icon="google" classes={["fab"]} /> Google Drive
            </Button>
            <Button
              color="primary"
              outline
              onClick={this.handleDropboxClick}
              active={this.state.drive === DROPBOX}
            >
              <FAIcon icon="dropbox" classes={["fab"]} /> Dropbox
            </Button>
            <Button
              color="dark"
              outline
              onClick={this.handleOneDriveClick}
              active={this.state.drive === ONEDRIVE}
            >
              <FAIcon icon="cloud" classes={["fa"]} /> OneDrive
            </Button>
          </ButtonGroup>

          {this.state.drive !== null && (
            <Card>
              <CardHeader>Select your email account</CardHeader>
              <CardBody>
                <ListGroup>
                  {mapAccountsListToListGroupItem.length
                    ? mapAccountsListToListGroupItem
                    : "No account exists"}
                </ListGroup>
              </CardBody>
            </Card>
          )}
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
