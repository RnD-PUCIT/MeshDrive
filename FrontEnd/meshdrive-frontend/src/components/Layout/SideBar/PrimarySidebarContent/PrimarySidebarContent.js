import React from "react";
import { ButtonGroup } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./styles.css";

export default class PrimarySideBarContent extends React.Component {
  render() {
    const defaultContent = (
      <ButtonGroup vertical className="d-flex mt-2">
        <NavLink exact to="/" className="btn btn-light light d-block">
          Home
        </NavLink>
        <NavLink to="/uploadfile" className="btn btn-light light">
          Upload File
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
