import React, { Component } from "react";
import pathToClassName from "../../../utils/pathToClassName";
import "./style.css";
// import SideBar from "../../Layout/SideBar/SideBar";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

class Login extends Component {
  componentDidMount() {
    const bodyClassName = pathToClassName(this.props.match.path);
    if (bodyClassName) document.body.classList.add(bodyClassName);
  }
  render() {
    return (
      <React.Fragment>
        <div id="page" className="d-flex flex-row w-100 page-login">
          <div className="flex-grow-1 d-flex flex-column pl-4 pr-4 page-content">
            <h1>Login</h1>
            <div className="login-signup-forms-wrapper d-flex">
              <div className="login-form-wrapper">
                <Form>
                  <FormGroup>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                    />
                  </FormGroup>

                  <Button>Submit</Button>
                </Form>
              </div>
              <div className="login-signup-form-text">
                <h2>Have an account?</h2>
                <p>Login now using your email address and password</p>
                <a href="#" className="btn btn-primary">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
