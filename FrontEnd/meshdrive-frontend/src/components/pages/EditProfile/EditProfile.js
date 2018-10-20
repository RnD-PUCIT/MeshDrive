import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { connect } from "react-redux";
import validator from "validator";

import "./styles.css";
class UploadFile extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;
  }

  state = {
    email: "",
    isValidEmail: false,
    valid: false
  };
  onChangeField = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const isValidEmail = validator.isEmail(this.state.email);
      this.setState({
        isValidEmail,
        valid: isValidEmail
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <div id="page" className="d-flex flex-row w-100">
          <div className="flex-grow-1 d-flex flex-column pl-4 pr-4">
            <h1>Edit Profile</h1>

            <Form
              className="d-flex flex-column w-50"
              onSubmit={this.onSubmitForm}
            >
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
                    this.state.isValidPassword ? "border border-success" : null
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
