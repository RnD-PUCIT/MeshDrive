import React, { Component } from "react";
import SideBar from "../../Layout/SideBar/SideBar";

class Login extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="page" className="d-flex flex-row w-100">
          <div className="flex-grow-1 d-flex flex-column pl-4 pr-4">
            <h1>Login</h1>
            This is login page
          </div>

          <SideBar right>Login</SideBar>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
