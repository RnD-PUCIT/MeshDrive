import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import "../Login/styles.css";
import validator from "validator";
// import SideBar from "../../Layout/SideBar/SideBar";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link } from "react-router-dom";

class VerifySuccess extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;

    console.log(this.match);
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="VerifySuccess"
          className="d-flex flex-row w-100 flex-fill page-login justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="login-signup-form-text p-5">
              <h2>Have an account?</h2>
              <p>Login now </p>
              <Link to="/login" className="btn btn-outline-light">
                Login
              </Link>
            </div>
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Verification Successful</h1>
              <p>You can login now</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default VerifySuccess;
