import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import "../Login/styles.css";
import validator from "validator";
// import SideBar from "../../Layout/SideBar/SideBar";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link } from "react-router-dom";
class Signup extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;
  }

  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  onSubmitForm = e => {
    e.preventDefault();
    if (!this.state.valid) return;

    console.log({ state: this.state });
  };

  render() {
    return (
      <React.Fragment>
        <div
          id="page"
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

export default Signup;