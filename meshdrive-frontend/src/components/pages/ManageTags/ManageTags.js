import React, { Component } from "react";
import {
  Button,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,Form,FormGroup
} from "reactstrap";
import { Fade } from "react-reveal";
import { connect } from "react-redux";
import requireAuth from "../../../hoc/requireAuth";
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import FAIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
import fetchTagsList from "../../../actions/user/fetchTagsList";
import addTag from "../../../actions/user/addTag";

class ManageTags extends Page{
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tagName:"",
      tagDescription:""
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeField = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleNewTagClick = e=>{
    e.preventDefault();
    this.toggle();
   
  }

  handleCreateTagRequest = e=>{
    e.preventDefault();
    let tag = {
      tagName:this.state.tagName,
      tagDescription:this.state.tagDescription
    }
    this.setState(
      {
        modal: false,
        tagName:"",
        tagDescription:""
      }
    );
    this.props.addTag(tag);
    this.props.fetchTagsList();  
  }
componentDidMount()
{
  this.props.fetchTagsList();
}

    render() {
      const { tagsList  = [] } = this.props.user;
  
      let i = 1;
      const displayTags = tagsList
        .map(tag => (
          <tr key={tag._id}>
            <th scope="row">{i++}</th>
            <td>{tag.name}</td>
            <td>{tag.description}</td>
  
              </tr>
        ));
        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;

    return (
        <React.Fragment>
          <SideBar primary />
          <div
            id="Tags Management"
            className="flex-grow-1 d-flex flex-column pl-4 pr-4"
          >
            <h1>Tags Management</h1>

            <div>
              <Button
                color="dark"
                outline
                size="sm"
                onClick={this.handleNewTagClick}
                >
                <FAIcon icon="plus" classes={["fa"]} /> New Tag
              </Button>
            </div>
            <br></br>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>Create New tag</ModalHeader>
          <ModalBody>
         
                <FormGroup>
            <Label>Name</Label>
            <Input
                    type="text"
                    name="tagName"
                    id="tagName"
                    placeholder="Tag name"
                    value={this.state.tagName}
                    onChange={this.onChangeField}
                    required
                  />
                  </FormGroup>
                  <FormGroup> 
            <Label>Description</Label>
            <Input
                    type="text"
                    name="tagDescription"
                    id="tagDescription"
                    placeholder="Tag Description"
                    value={this.state.tagDescription}
                    onChange={this.onChangeField}
                    required
                  />
                  
           </FormGroup>
           <FormGroup> 
            <Label>Color</Label>
           </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button className="ml-auto btn-gradient" onClick={this.handleCreateTagRequest}>Create Tag</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>

 <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tag</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
       {displayTags}
          </tbody>
          </Table>
          
          </div>
        </React.Fragment>
      );
                    }
}
function mapStateToProps({ tagsList}) {
  return {
    tagsList
  };
}
export default connect(
  mapStateToProps,
  {
    addTag,
    fetchTagsList
  }
)(requireAuth(ManageTags));