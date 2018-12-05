// module imports
import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback
} from "reactstrap";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validator from "validator";
import FAIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
import { Fade } from "react-reveal";

import toStream from "blob-to-stream";
import request from "request";

// custom module imports
import Page from "../Page";
import requestLogin from "../../../actions/user/requestLogin";
import "./styles.css";

class Login extends Page {
  state = {
    email: "",
    password: "",
    isValidEmail: false,
    isValidPassword: false,
    valid: false
  };

  onChangeField = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const isValidEmail = validator.isEmail(this.state.email);
      const isValidPassword = validator.isLength(this.state.password, {
        min: 8
      });
      this.setState({
        isValidEmail,
        isValidPassword,
        valid: isValidEmail && isValidPassword
      });
    });
  };

  onSubmitForm = e => {
    e.preventDefault();
    if (!this.state.valid) return;

    this.props.requestLogin(this.state.email, this.state.password);
  };

  navigateIfLoggedIn() {
    if (this.props.user.token) {
      this.props.history.push("/dashboard");
      return true;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.navigateIfLoggedIn()) return;
  }

  componentDidUpdate(prevProps) {
    if (this.navigateIfLoggedIn()) return;

    if (this.props.inProgress) {
      this.setState({ valid: !this.state.valid });
    } else if (prevProps.api.inProgress != this.props.api.inProgress) {
      this.setState({ valid: !this.state.valid });
    }
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="Login"
          className="d-flex flex-row w-100 flex-fill page-login justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Log in</h1>

              <Form className="d-flex flex-column" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onChangeField}
                    required
                    valid={this.state.isValidEmail}
                  />
                  <FormFeedback valid={this.state.isValidEmail}>
                    <FAIcon icon="check" classes={["fa"]} /> Valid
                  </FormFeedback>
                  <FormText>Enter your email address</FormText>
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
                    required
                    valid={this.state.isValidPassword}
                  />
                  <FormFeedback valid={this.state.isValidPassword}>
                    <FAIcon icon="check" classes={["fa"]} /> Valid
                  </FormFeedback>
                  <FormText>
                    Enter password with minimum length of 8 characters
                  </FormText>
                </FormGroup>

                <div className="d-flex align-items-center">
                  <span className="text-muted mr-auto">
                    Forgot Password? <Link to="/forgotpassword">Reset</Link>
                  </span>
                  {this.state.valid ? (
                    <Button className="ml-auto btn-gradient">Login</Button>
                  ) : (
                    <Button className="ml-auto disabled" disabled>
                      Login
                    </Button>
                  )}
                </div>
              </Form>
            </div>
            <div className="login-signup-form-text p-5">
              <h2>Don't Have an account?</h2>
              <p>Signup now </p>
              <Link to="/signup" className="btn btn-outline-light">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ api, user }) {
  return {
    api,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestLogin
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
