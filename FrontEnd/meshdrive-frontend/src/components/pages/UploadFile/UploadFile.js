// module imports
import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import toStream from "blob-to-stream";
import request from "request";

// custom module imports
import requireAuth from "../../../hoc/requireAuth";
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import uploadFile from "../../../actions/files/uploadFile";
import "./styles.css";

class UploadFile extends Page {
  state = {
    onDragEnter: false,
    files: [],
    drive: ""
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

  handleDriveChange = event => {
    this.setState({ drive: event.target.value });
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
          <ul>
            {this.state.files.map(f => (
              <li key={f.name}>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
          <FormGroup tag="fieldset">
            <Label for="drive">Select Drive</Label>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="drive"
                  value="googledrive"
                  onChange={this.handleDriveChange}
                />{" "}
                Google Drive
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="drive"
                  value="onedrive"
                  onChange={this.handleDriveChange}
                />{" "}
                OneDrive
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="drive"
                  value="dropbox"
                  onChange={this.handleDriveChange}
                />{" "}
                Dropbox
              </Label>
            </FormGroup>
          </FormGroup>
          <Button onClick={this.handleSubmit}>Submit</Button>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { uploadFile }
)(requireAuth(UploadFile));
