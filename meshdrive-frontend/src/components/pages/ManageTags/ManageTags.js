import React, { Component } from "react";
import {
  Button,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label,
  Input,FormGroup,ButtonGroup
} from "reactstrap";
import { Fade } from "react-reveal";
import { connect } from "react-redux";
import requireAuth from "../../../hoc/requireAuth";
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import FAIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
import fetchTagsList from "../../../actions/user/fetchTagsList";
import addTag from "../../../actions/user/addTag";
import editTag from "../../../actions/user/editTag";
import deleteTag from "../../../actions/user/deleteTag";
import { CirclePicker} from 'react-color'
import "./styles.css";
class ManageTags extends Page{
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tagID:"",
      tagName:"",
      tagDescription:"",
      tagColor:'#0000', //defaul
      activeTagName:""
    
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
    this.setState({
      tagID:"",
      tagName:"",
      tagDescription:"",
      tagColor:'#0000'
     
    
    });
    this.toggle();
  }

  handleEditTag=(tag)=>{
  
    this.setState(
      {      
        tagID:tag._id,
        tagName:tag.name,
        tagDescription:tag.description,
        tagColor:tag.color 
      }
    );
  //  console.log("CHECKING+++>"+tag._id);
    this.toggle();

  }
  handleChangeColor = (color)=>{
  
    //console.log("COLORRRRRR==>"+color.hex);
    this.setState({"tagColor":color.hex});
  }
  handleDeleteTag =name=>{
  
    this.props.deleteTag(name);
  }

  handleEditTagRequest = e=>{
    e.preventDefault();
    let tag = {
      tagID:this.state.tagID,
      tagName:this.state.tagName,
      tagDescription:this.state.tagDescription,
      tagColor:this.state.tagColor
    };
    this.setState(
      {      
        modal: false,
        tagID:"",
        tagName:"",
        tagDescription:"",
        tagColor:'#0000'  // default 
      });

      this.props.editTag(tag);
      this.props.fetchTagsList();  

  }
  handleCreateTagRequest = e=>{
    e.preventDefault();
    let tag = {
      tagName:this.state.tagName,
      tagDescription:this.state.tagDescription,
      tagColor:this.state.tagColor
    }
    this.setState(
      {      
        modal: false,
        tagID:"",
        tagName:"",
        tagDescription:"",
        tagColor:'#f44336'  // default 
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
     // const {tagsList=[]} = this.props.user;
    let button;
     if(this.state.tagName!=="" && this.state.tagID=="") {
  
      button = <Button className="ml-auto btn-gradient" onClick={this.handleCreateTagRequest}>Create Tag</Button>
     }
    else if (this.state.tagName!=="" && this.state.tagID!=""){
      button = <Button className="ml-auto btn-gradient" onClick={this.handleEditTagRequest}>Save Changes</Button>
    }else
    {
      button =  null;
    }
      
   
   
      let colorArray =['#6495ed', '#8470ff', '#1e90ff','#87ceeb',
      '#87cefa', '#add8e6', '#00ced1','#00ffff',
      "#f44336", "#e91e63", "#9c27b0",

      "#673ab7","#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
      "#009688", "#4caf50", "#8bc34a", "#cddc39",
      "#ffeb3b", "#ffc107",

      "#ff9800", "#ff5722","#8fbc8f", "#98fb98", "#bdb76b",
      "#adff2f", "#f08080", "#ffc0cb", "#d8bfd8",
      "#dda0dd", "#f0fff0",
    ];
      let i = 1;
      const displayTags = this.props.user.tagsList
        .map(tag => (
          <tr key={tag._id}>        
            <th scope="row">{i++}</th>
            <td style={{backgroundColor:tag.color}}>{tag.name}</td>
            <td>{tag.description}</td>
            <td>
             
              <Button 
              className="editButton"
              outline
              color="secondary"
              onClick={()=>this.handleEditTag(tag)}
              >
              <FAIcon icon="edit" classes={["fa"]} /></Button>
              <Button 
              outline
              color="danger"
              onClick={()=>this.handleDeleteTag(tag.name)}
              >
             <FAIcon icon="trash" classes={["fa"]} /></Button>
              
             </td>
          
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
                  
                  />
                  
           </FormGroup>
           <FormGroup> 
            <Label>Tag Color</Label>
            <CirclePicker 
              colors={colorArray}
              width='500px'
              className="ColorPicker" 
              onChangeComplete={ this.handleChangeColor }/>
           </FormGroup>
          </ModalBody>
          <ModalFooter>
          {
            button
          }
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>

 <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tag</th>
            <th>Description</th>
            <th></th>
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
function mapStateToProps({tagsList}) {
  return {
    tagsList
  };
}
export default connect(
  mapStateToProps,
  {
    addTag,
    editTag,
    fetchTagsList,
    deleteTag
  }
)(requireAuth(ManageTags));