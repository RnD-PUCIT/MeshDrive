import React, { Component } from "react";
import pathToCssId from "../../../utils/pathToCssId";
import "../Login/styles.css";
import validator from "validator";
// import SideBar from "../../Layout/SideBar/SideBar";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link } from "react-router-dom";
class ForgotPassword extends Component {
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
              <h1 className="text-primary mb-4">Forgot Password</h1>

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

                {this.state.valid ? (
                  <Button className="ml-auto btn-gradient">
                    Reset Password
                  </Button>
                ) : (
                  <Button className="ml-auto disabled" disabled>
                    Reset Password
                  </Button>
                )}
              </Form>
            </div>
            <div className="login-signup-form-text p-5">
              <h2>Don't Have an account?</h2>
              <p>Signup now </p>
              <Link to="/login" className="btn btn-outline-light">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ForgotPassword;
