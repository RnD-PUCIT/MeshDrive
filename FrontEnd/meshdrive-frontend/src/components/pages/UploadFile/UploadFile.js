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
import requireAuth from "../../../hoc/requireAuth";
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import uploadFile from "../../../actions/files/uploadFile";
import FAIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
import "./styles.css";

class UploadFile extends Page {
  state = {
    onDragEnter: false,
    files: [],
    drive: null,
    displayEmailAccounts: [],
    activeEmailAccount: ""
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
    this.setState({ files: acceptedFiles });
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
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(event.target.value);

    const fileWithInfo = {
      files: this.state.files,
      drive: this.state.drive
    };
    /*_________________________________________________________________________ */
    var formData = new FormData();
    this.state.files.forEach(file => {
      const r = request.post(
        "https://35ddc7fe.ngrok.io/file",
        (err, resp, body) => {
          if (resp) console.log("pipe response: ", resp);
          if (err) console.log("error : ", err);
          if (body) console.log("body: ", body);
        }
      );
      var stream = toStream(file);
      stream.pipe(r);

      stream.on("finish", function() {
        alert("File uploaded");
      });
    });
    /*_________________________________________________________________________ */
    //console.log(fileWithInfo);
    //this.props.uploadFile(fileWithInfo);
    //this.setState({ file: "" });
    //alert("File uploaded");
  };

  setActiveEmailAccount = email => {
    this.setState({ activeEmailAccount: email });
  };

  handleGoogleDriveClick = () => {
    const { driveAccountsList = null } = this.props.user;
    const { googleDriveAccountsList } = driveAccountsList;
    this.setState({
      drive: "GOOGLEDRIVE",
      displayEmailAccounts: googleDriveAccountsList
    });
  };
  handleDropboxClick = () => {
    // const { driveAccountsList = null } = this.props.user;
    // const { googleDriveAccountsList } = driveAccountsList;
    this.setState({
      drive: "DROPBOX",
      displayEmailAccounts: []
    });
  };
  handleOneDriveClick = () => {
    // const { driveAccountsList = null } = this.props.user;
    // const { googleDriveAccountsList } = driveAccountsList;
    this.setState({
      drive: "ONEDRIVE",
      displayEmailAccounts: []
    });
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
          <ul>
            {this.state.files.map(f => (
              <li key={f.name}>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
          <Label>Select Drive</Label>
          <ButtonGroup className="mt-2 mb-4">
            <Button
              color="danger"
              outline
              onClick={this.handleGoogleDriveClick}
              active={this.state.drive === "GOOGLEDRIVE"}
            >
              <FAIcon icon="google" classes={["fab"]} /> Google Drive
            </Button>
            <Button
              color="primary"
              outline
              onClick={this.handleDropboxClick}
              active={this.state.drive === "DROPBOX"}
            >
              <FAIcon icon="dropbox" classes={["fab"]} /> Dropbox
            </Button>
            <Button
              color="dark"
              outline
              onClick={this.handleOneDriveClick}
              active={this.state.drive === "ONEDRIVE"}
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
            <Button onClick={this.handleSubmit}>Submit</Button>
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
  { uploadFile }
)(requireAuth(UploadFile));
