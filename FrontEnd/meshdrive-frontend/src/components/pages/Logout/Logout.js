// module imports
import React, { Component } from "react";
import removeUserObj from "../../../actions/user/removeUserObj";
import { connect } from "react-redux";
// custom module imports
import Page from "../Page";
import "../Login/styles.css";
import { Link } from "react-router-dom";

class Logout extends Page {
  navigateIfLoggedOut() {
    if (!this.props.user.token) {
      this.props.history.push("/");
      return true;
    }
  }
  componentDidMount() {
    super.componentDidMount();

    this.props.removeUserObj();
    this.navigateIfLoggedOut();
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="VerifySuccess"
          className="d-flex flex-row w-100 flex-fill page-login justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Logout Successful</h1>
              Go back to <Link to="/">Home</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps({ user }) {
  return { user };
}
export default connect(
  mapStateToProps,
  { removeUserObj }
)(Logout);
