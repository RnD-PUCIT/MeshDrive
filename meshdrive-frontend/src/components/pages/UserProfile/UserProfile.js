import Page from '../Page'
import React from 'react'
import Sidebar from '../../Layout/SideBar/SideBar'
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink } from 'reactstrap';
import { Badge, Button ,Alert} from 'reactstrap';
import ProfileList from '../../Profiles/ProfileList'
import ProfileAbout from '../../Profiles/ProfileAbout'
import { Divider } from 'semantic-ui-react'
import './style.css'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ProfileHeader from '../../Profiles/ProfileHeader';
import getSelfProfile from '../../../actions/userProfile/getProfile'
class UserProfile extends Page{
   
    constructor(props) {
        super(props);
        this.state = {
         activeTab:"Followers"
        };
      }
      componentDidMount(){

        this.props.getSelfProfile();
        super.componentDidMount();
      }

      

      toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }

        console.log(this.props.currentProfile);
      }

      getActiveTabContent(tab){
        if(tab == "Followers")
        {
          return   <ProfileList ></ProfileList>
        }else if (tab == "About")
        {
          return <div><ProfileAbout></ProfileAbout></div>
        }
      }
    
   
    render(){
      var profile = this.props.currentProfile;
        var gradientClass="btn btn-gradient";
        var lightClass="";
        var url = "https://www.gstatic.com/webp/gallery/4.jpg";
        var isFollowing=true;
            return (
            <React.Fragment>

              
              <Sidebar primary></Sidebar> 
                      
             
            <div
                  style={{marginTop:"1px"}}  
                  id="UserProfile"
                  className="flex-grow-1 d-flex flex-column container"
                >  
              <table>
                <tbody>            
                  <tr>
                    <td width="1%">
                    <div className="image-container"  > 
                  <img className="profile_pic"  src={url} width="350px"  height="350px"></img>
                  {/* <Button className={gradientClass+" float-bottom"} >Follow </Button> */}
                    </div>

                    </td>
                    <td valign="bottom">

                  <div className="name-container" >
                    <h4>Shaheryar Tariq</h4>
                    <h6>Free User</h6>
                      <Button className={gradientClass} outline  >{isFollowing?"Following":"Follow"}  
                        <Badge color="secondary"></Badge><i  style={{marginLeft:"10px"}}   class= {isFollowing?"fas fa-check":"fas fa-plus"}></i>
                      </Button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>

                            
            <Nav pills   style={{marginTop:"20px"}}    >
              <NavItem>
                <NavLink href="#" id='About'   onClick={() => { this.toggle('About'); }}  className={this.state.activeTab=="About"?gradientClass:lightClass} >About</NavLink>
              </NavItem>
        
              <NavItem>
                <NavLink href="#"
                onClick={() => { this.toggle('Followers'); }}
                className={this.state.activeTab=="Followers"?gradientClass:lightClass}  id="Followers">Followers</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                onClick={() => { this.toggle('Following'); }}
                id='Following' className={this.state.activeTab=="Following"?gradientClass:lightClass}>
                Following
                <Badge color="secondary"  style={{marginLeft:'10px'}}>4</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                onClick={() => { this.toggle('Shared'); }}
                href="#" id='Shared' className={this.state.activeTab=="Shared"?gradientClass:lightClass} >Shared Content</NavLink>
              </NavItem>
            </Nav>
         
            <hr></hr>

            <Divider></Divider>
            
            {this.getActiveTabContent(this.state.activeTab)};
            


      </div>

      </React.Fragment>
      
            );
    }
}


function mapStateToProps({ currentProfile }) {
  return {
    currentProfile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
     getSelfProfile
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
