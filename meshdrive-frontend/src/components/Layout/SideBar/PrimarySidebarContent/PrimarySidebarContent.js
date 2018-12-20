import React from "react";
import { ButtonGroup } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./styles.css";

export default class PrimarySideBarContent extends React.Component {
  render() {
    const defaultContent = (
      <ButtonGroup vertical className="d-flex mt-2">
        <NavLink exact to="/dashboard" className="btn btn-light light d-block">
          Dashboard
        </NavLink>
        <NavLink to="/managedrives" className="btn btn-light light">
          Manage Drives
        </NavLink>
        <NavLink to="/uploadfile" className="btn btn-light light">
          Upload File
        </NavLink>
        <NavLink to="/managetags" className="btn btn-light light">
          My Tags
        </NavLink>
      </ButtonGroup>
    );

    return (
      <div className="sidebar-primary bg-light flex-fill p-2">
        {this.props.children ? this.props.children : defaultContent}
      </div>
    );
  }
}
