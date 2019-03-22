import React, { Component } from "react";
import NavBar from "./NavBar/NavBar";
import ResponseStatus from "../../ResponseStatus/ResponseStatus";
import ProfileHeader from "../../Profiles/ProfileHeader";
class Header extends Component {
  render() {
    console.log({history: this.props.history})
    return (
      <div id="Header">
        <ResponseStatus />
        
        <ProfileHeader/>
      </div>
    );
  }
}

export default Header;
