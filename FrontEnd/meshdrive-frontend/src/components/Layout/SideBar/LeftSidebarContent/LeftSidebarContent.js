import React from "react";
import { ButtonGroup } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./styles.css";

export default class LeftSideBarContent extends React.Component {
  render() {
    return (
      <div className="sidebar-left bg-light flex-fill p-2">
        <ButtonGroup vertical className="d-flex mt-2">
          <NavLink exact to="/" className="btn btn-light light d-block">
            Home
          </NavLink>
          <NavLink to="/uploadfile" className="btn btn-light light">
            Upload File
          </NavLink>
        </ButtonGroup>
      </div>
    );
  }
}
