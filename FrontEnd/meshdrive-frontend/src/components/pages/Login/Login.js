// module imports
import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import validator from "validator";

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

  componentDidUpdate(prevProps) {
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

function mapStateToProps({ api }) {
  return {
    api
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
