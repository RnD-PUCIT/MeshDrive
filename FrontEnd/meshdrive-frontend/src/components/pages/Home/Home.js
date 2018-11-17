// module imports
import React, { Component } from "react";
import SideBar from "../../Layout/SideBar/SideBar";

// custom module imports
import Page from "../Page";
import { Link } from "react-router-dom";

class Home extends Page {
  render() {
    return (
      <React.Fragment>
        <div id="Home" className="flex-grow-1 d-flex flex-column pl-4 pr-4">
          <h1>Home</h1>
          This is homepage
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
