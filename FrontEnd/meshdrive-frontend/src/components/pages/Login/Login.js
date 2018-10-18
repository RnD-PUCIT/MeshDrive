import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import "./styles.css";
// import SideBar from "../../Layout/SideBar/SideBar";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

class Login extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="page"
          className="d-flex flex-row w-100 flex-fill page-login justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Log in</h1>

              <Form className="d-flex flex-column">
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

                <Button className="ml-auto btn-gradient">Login</Button>
              </Form>
            </div>
            <div className="login-signup-form-text p-5">
              <h2>Have an account?</h2>
              <p>Login now using your email address and password</p>
              <a href="#" className="btn btn-outline-light">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
