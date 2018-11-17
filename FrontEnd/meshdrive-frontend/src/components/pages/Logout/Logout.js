// module imports
import React, { Component } from "react";
import removeToken from "../../../actions/auth/removeToken";
import { connect } from "react-redux";
// custom module imports
import Page from "../Page";
import "../Login/styles.css";
import { Link } from "react-router-dom";

class Logout extends Page {
  navigateIfLoggedOut() {
    if (!this.props.auth.token) {
      console.log("Logout.js", this.props.auth);
      this.props.history.push("/");
      return true;
    }
  }
  componentDidMount() {
    super.componentDidMount();

    this.props.removeToken();
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
function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(
  mapStateToProps,
  { removeToken }
)(Logout);
