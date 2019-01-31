import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
  Button,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FAIcon from "../../../FontAwesomeIcon/FontAwesomeIcon";
import "./styles.css";
import Logo from "../Logo/Logo";
class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Navbar id="NavBar" color="white" light expand="md" className="p-0">
        <Logo />
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto pt-2 mr-2" navbar>
            <NavItem>
              {/* <Form inline className="search">
                <InputGroup>
                  <Input />
                  <InputGroupAddon addonType="append">
                    <Button className="btn-gradient">Search</Button>
                  </InputGroupAddon>
                </InputGroup>
              </Form> */}
            </NavItem>

            {this.props.user.token ? (
              <React.Fragment>
                <NavItem>
                  <NavLink href="#">
                    <FAIcon icon="bell" classes={["fa"]} />
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <FAIcon icon="user" classes={["fa"]} />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Option 1</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem divider />
                    <Link to="/logout" className="dropdown-item">
                      Logout
                    </Link>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link to="/login" className="btn btn-outline-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-primary">
                  Signup
                </Link>
              </React.Fragment>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
function mapStateToProps({ user }) {
  return { user };
}
export default connect(mapStateToProps)(NavBar);
