import React from 'react'
import { Navbar, Nav, Form, FormControl, Button, NavItem } from 'react-bootstrap'
import { Image } from "semantic-ui-react";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Axios from 'axios';
import { connect } from 'react-redux';
import { rootURL } from "../../constants/apiConstants";
import { Redirect } from 'react-router';
import { updateUserSearchKeywords, searchUsers } from '../../actions/searching/updateSearchingKeywords'
import UsersSearchResult from '../pages/UsersSearchResult/UsersSearchResult';
import Layout from "../Layout/Layout";
class ProfileHeader extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            searchText: "",
            toUserResultPage: false
        }
    }


    handleSearchText = e => {
        this.setState({ searchText: e.target.value });
        this.props.updateUserSearchKeywords(e.target.value);

    }


    handleSubmit = e => {
        e.preventDefault();

        if (this.state.searchText.length != 0) {
            this.props.searchUsers();
            this.setState({ toUserResultPage: true });
            console.log("form submitted");
        }
    }

    componentDidUpdate() {
        if (this.state.toUserResultPage === true) {
            this.setState({ toUserResultPage: false })
        }
    }

    
    render() {

        if (this.state.toUserResultPage == true) {
            console.log("redirection...");
            return <Redirect to="/userresult" />
        }

        return (
            <React.Fragment>
                <Navbar bg="btn btn-gradient" variant="dark" style={{ marginBottom: "5px" }}>
                    <Image style={{ marginRight: "10px" }} src={require('../../images/logo.png')} alt="" />
                    <Navbar.Brand href="#dashboard" >
                        <h2>  Mesh Drive </h2>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                        <Form id="userSearchForm" inline onSubmit={this.handleSubmit.bind(this)}>
                            <FormControl style={{ width: "300px" }}
                                type="text"
                                placeholder="Search Users here..."
                                className="mr-sm-2"
                                value={this.state.searchText}
                                onChange={this.handleSearchText} />
                            <Button variant="outline-light" onClick={this.handleSubmit}><FAIcon icon="search" classes={["fa"]} /></Button>
                        </Form>

                    </Nav>
                    {/* <NavItem className="ml-auto"  style={{marginRight:"0px"}}>
                        <span>                    
                          <Image style={{margin:"auto"}} src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' size="mini" circular >
                             </Image>           
                        </span>
                        <b style={{color:"white"}}>Shaheryar</b>
  
                     
                    </NavItem> */}

                </Navbar>
            </React.Fragment>

        );

    }

}

function mapStateToProps(state) {
    return {
        searchKeywords: state.searchKeywords
    }
}
export default (connect(mapStateToProps, { updateUserSearchKeywords, searchUsers })(ProfileHeader));;