import React from "react";
import { ButtonGroup, Card, Button, CardTitle, CardText } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "../../Header/Logo/Logo";
import FAIcon from "../../../FontAwesomeIcon/FontAwesomeIcon";

import "./styles.css";

const PrimarySideBarContent = props => {
  var email = props.user.email;
  var profileRoute = "/profile/"+email;
  var defaultContent = (
    <ButtonGroup vertical className="d-flex mt-2">
      <NavLink to={profileRoute} className="btn btn-light light">
        Profile
      </NavLink>  
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
      {/* <Logo /> */}
      <Card body className="text-center">
        <CardTitle>
          <FAIcon icon="user" classes={["fa"]} />
        </CardTitle>
        <CardText>{props.user.email}</CardText>
        <NavLink
          exact
          to="/logout"
          className="btn btn-outline-secondary btn-block btn-sm "
        >
          Logout
        </NavLink>
      </Card>
      {/* <ButtonGroup vertical className="d-flex">
        <a href="#" className="btn btn-block btn-sm btn-light">
          {props.user.email}
        </a>
        <NavLink
          exact
          to="/logout"
          className="btn btn-outline-secondary btn-block btn-sm "
        >
          Logout
        </NavLink>
      </ButtonGroup> */}
      {props.children ? props.children : defaultContent}
    </div>
  );
};
function mapStateToProps({ user }) {
  return {
    user
  };
}
export default connect(mapStateToProps)(PrimarySideBarContent);
