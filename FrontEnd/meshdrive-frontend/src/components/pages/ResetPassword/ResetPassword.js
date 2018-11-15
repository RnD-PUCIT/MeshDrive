// module imports
import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// custom module imports
import Page from "../Page";
import requestApplyResetPassword from "../../../actions/user/requestApplyResetPassword";
import "../Login/styles.css";

class ResetPassword extends Page {
  componentDidMount() {
    super.componentDidMount();
    this.params = this.props.match.params;
  }

  state = {
    password: "",
    confirmPassword: "",
    isValidPassword: false,
    isValidConfirmPassword: false,
    valid: false
  };

  onChangeField = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const isValidPassword = this.state.password.length >= 8;
      const isValidConfirmPassword =
        this.state.confirmPassword === this.state.password;
      this.setState({
        isValidPassword,
        isValidConfirmPassword,
        valid: isValidPassword && isValidConfirmPassword
      });
    });
  };

  onSubmitForm = e => {
    e.preventDefault();
    if (!this.state.valid) return;

    this.props.requestApplyResetPassword(this.params.id, this.state.password);
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
          id="page"
          className="d-flex flex-row w-100 flex-fill justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Reset Password</h1>

              <Form className="d-flex flex-column" onSubmit={this.onSubmitForm}>
                <FormGroup>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
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
                    <small>Enter your new password</small>
                  </p>
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Password"
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
                    <small>Confirm your new password</small>
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
      requestApplyResetPassword
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);
