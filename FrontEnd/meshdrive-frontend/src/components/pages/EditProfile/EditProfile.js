import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { connect } from "react-redux";
import "./styles.css";
class UploadFile extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;
  }

  render() {
    return (
      <React.Fragment>
        <div id="page" className="d-flex flex-row w-100">
          <div className="flex-grow-1 d-flex flex-column pl-4 pr-4">
            <h1>Edit Profile</h1>
          </div>

          {/* <SideBar right>Right UploadFile sidebar</SideBar> */}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  null
)(UploadFile);
