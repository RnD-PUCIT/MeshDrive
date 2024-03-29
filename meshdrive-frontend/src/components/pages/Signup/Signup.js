// custom module imports
import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Image
} from "reactstrap";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validator from "validator";
import Dropzone from "react-dropzone";

// custom module imports
import Page from "../Page";
import requestSignup from "../../../actions/user/requestSignup";
import "../Login/styles.css";
import "./styles.css";
class Signup extends Page {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
    isValidName: false,
    isValidEmail: false,
    isValidPassword: false,
    valid: false
  };

  onChangeField = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const isValidName = !validator.isEmpty(this.state.name);
      const isValidEmail = validator.isEmail(this.state.email);
      const isValidPassword = validator.isLength(this.state.password, {
        min: 8
      });
      const isValidConfirmPassword =
        this.state.password.length >= 8 &&
        this.state.password === this.state.confirmPassword;
      this.setState({
        isValidName,
        isValidEmail,
        isValidPassword,
        isValidConfirmPassword,
        valid:
          isValidName &&
          isValidEmail &&
          isValidPassword &&
          isValidConfirmPassword
      });
    });
  };

  onProfilePictureDrop = acceptedFiles => {
    this.setState({ profilePic: acceptedFiles[0] });
    console.log(acceptedFiles[0]);
  };
  onSubmitForm = e => {
    e.preventDefault();
    if (!this.state.valid) return;

    this.props.requestSignup(
      this.state.email,
      this.state.password,
      this.state.name,
      this.state.profilePic
    );
  };
  componentDidUpdate(prevProps) {
    if (this.props.inProgress) {
      this.setState({ valid: !this.state.valid });
    } else if (prevProps.api.inProgress != this.props.api.inProgress) {
      this.setState({ valid: !this.state.valid });
    }
  }
  render() {
    const isProfilePicPreview =
      this.state.profilePic && this.state.profilePic.preview;
    return (
      <React.Fragment>
        <div
          id="Signup"
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
              <h1 className="text-primary mb-4">Sign Up</h1>

              <Form className="d-flex flex-column" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <div className="d-flex flex-column justify-content-center">
                    <div
                      className="profile-picture preview"
                      style={{
                        display: isProfilePicPreview ? "block" : "none"
                      }}
                    >
                      {isProfilePicPreview && (
                        <img src={this.state.profilePic.preview} alt="" />
                      )}
                    </div>
                    {isProfilePicPreview && (
                      <Button
                        onClick={() => {
                          this.setState({ profilePic: null });
                        }}
                        outline
                        size="sm"
                        className="pl-3 pr-3 mt-2"
                        style={{ placeSelf: "center" }}
                      >
                        X
                      </Button>
                    )}
                    <Dropzone
                      style={{
                        display: isProfilePicPreview ? "none" : "flex"
                      }}
                      className={
                        "filedropzone shadow bg-light rounded border-primary profile-picture"
                      }
                      multiple={false}
                      onDropAccepted={this.onProfilePictureDrop}
                      accept={["image/jpeg", "image/png", "image/gif"]}
                    >
                      Upload your profile picture
                    </Dropzone>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.onChangeField}
                    className={
                      this.state.isValidName ? "border border-success" : null
                    }
                    required
                  />
                  <p className="text-right text-muted">
                    <small>Enter your full name</small>
                  </p>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChangeField}
                    className={
                      this.state.isValidEmail ? "border border-success" : null
                    }
                    required
                  />
                  <p className="text-right text-muted">
                    <small>Enter your email address</small>
                  </p>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    pattern=".{8,}"
                    value={this.state.password}
                    onChange={this.onChangeField}
                    className={
                      this.state.isValidPassword
                        ? "border border-success"
                        : null
                    }
                    required
                  />
                  <p className="text-right text-muted">
                    <small>
                      Please enter password minimum length of 8 characters
                    </small>
                  </p>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    pattern=".{8,}"
                    value={this.state.confirmPassword}
                    onChange={this.onChangeField}
                    className={
                      this.state.isValidConfirmPassword
                        ? "border border-success"
                        : null
                    }
                    required
                  />
                  <p className="text-right text-muted">
                    <small>Please enter password again to confirm</small>
                  </p>
                </FormGroup>

                {this.state.valid ? (
                  <Button className="ml-auto btn-gradient">Signup</Button>
                ) : (
                  <Button className="ml-auto disabled" disabled>
                    Signup
                  </Button>
                )}
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ api }) {
  return {
    api
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestSignup
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
