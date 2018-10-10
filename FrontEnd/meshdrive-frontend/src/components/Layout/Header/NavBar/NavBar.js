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
      <Navbar color="white" light expand="md" className="p-0">
        <Logo />
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto pt-2 mr-2" navbar>
            <NavItem>
              <Form inline className="search">
                <InputGroup>
                  <Input />
                  <InputGroupAddon addonType="append">
                    <Button>Search</Button>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <FAIcon icon="bell" />
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <FAIcon icon="user" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
export default NavBar;
