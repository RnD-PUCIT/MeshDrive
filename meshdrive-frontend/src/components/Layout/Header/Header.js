import React, { Component } from "react";
import NavBar from "./NavBar/NavBar";
import ResponseStatus from "../../ResponseStatus/ResponseStatus";
class Header extends Component {
  render() {
    return (
      <div id="Header">
        <ResponseStatus />
        <NavBar />
      </div>
    );
  }
}

export default Header;
