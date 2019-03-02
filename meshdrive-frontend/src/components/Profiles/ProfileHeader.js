import React from 'react'
import { Navbar, Nav, Form, FormControl, Button ,NavItem} from 'react-bootstrap'
import { Image } from "semantic-ui-react";

import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";

class ProfileHeader extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {

        return (
            <React.Fragment>
                <Navbar bg="btn btn-gradient" variant="dark" style={{marginBottom:"5px"}}>
                    <Image style={{ marginRight: "10px" }} src={require('../../images/logo.png')} alt="" />
                    <Navbar.Brand href="#dashboard" >
                        <h2>  Mesh Drive </h2>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                        <Form inline>
                            <FormControl style={{ width: "300px" }} type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-light"><FAIcon icon="search" classes={["fa"]} /></Button>
                        </Form>

                    </Nav>
                    <NavItem className="ml-auto"  style={{marginRight:"0px"}}>
                        <span>                    
                          <Image style={{margin:"auto"}} src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' size="mini" circular >
                             </Image>           
                        </span>
                        <b style={{color:"white"}}>Shaheryar</b>
  
                     
                    </NavItem>

                </Navbar>
            </React.Fragment>

        );

    }

}

export default ProfileHeader;