// module imports
import React, { Component } from "react";
import removeToken from "../../../actions/auth/removeToken";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// custom module imports
import Page from "../Page";
import "../Login/styles.css";

class Home extends Page {
  navigateIfLoggedin() {
    if (this.props.auth.token) {
      this.props.history.push("/dashboard");
      return true;
    }
  }
  componentDidMount() {
    if (this.navigateIfLoggedin()) return;
    super.componentDidMount();
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="Home"
          className="d-flex flex-row w-100 flex-fill page-login justify-content-center align-items-center"
        >
          <div className="login-signup-forms-wrapper d-flex align-items-center">
            <div className="form-wrapper p-5">
              <h1 className="text-primary mb-4">Welcome to MeshDrive</h1>
              <p>
                Please <Link to="/login">Login</Link> to continue
              </p>
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
)(Home);
