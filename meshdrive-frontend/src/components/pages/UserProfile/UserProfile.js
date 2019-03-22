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
import {getSelfProfile,getProfileByEmail} from '../../../actions/currentUserProfile/getCurrentProfile'
class UserProfile extends Page{
   
    constructor(props) {
        super(props);
        this.state = {
         activeTab:"About"
        };
      }
    componentDidMount(){
      console.log("Props are ",this.props);
     var email=this.props.email;
    //  console.log(this.params);
        if(email==null)
        {
          this.props.getSelfProfile();
        }
        else{
          this.props.getProfileByEmail(email);
        }
          super.componentDidMount();
    }

      

      toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
        console.log("Profile data is : ")
        console.log(this.props.currentProfile);
      }

      getActiveTabContent(tab){
        var currentProfile = this.props.currentProfile;
        var followers=currentProfile.followers;
        var following = currentProfile.following;
        if(tab == "Followers")
        {
          return   <ProfileList ></ProfileList>
        }else if (tab == "About")
        {
          return <div><ProfileAbout currentProfile={currentProfile}></ProfileAbout></div>
        }
      }
    
   
    render(){
        var currentProfile=this.props.currentProfile;
        var gradientClass="btn btn-gradient";
        var lightClass="";
       
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
                  <img className="profile_pic"  src={currentProfile.profile_pic} width="350px"  height="350px"></img>
                  {/* <Button className={gradientClass+" float-bottom"} >Follow </Button> */}
                    </div>

                    </td>
                    <td valign="bottom">

                  <div className="name-container" >
                    <h4>{currentProfile.name}</h4>
                    <h6>Free User</h6>
                      <Button className={gradientClass} outline  >{isFollowing?"Following":"Follow"}  
                        <Badge color="secondary"></Badge><i  style={{marginLeft:"5px"}}   class= {isFollowing?"fas fa-check":"fas fa-plus"}></i>
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
                className={this.state.activeTab=="Followers"?gradientClass:lightClass}  id="Followers">Followers
                  <Badge color="secondary"  style={{marginLeft:'5px'}}>{currentProfile.followers.length}</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#"
                onClick={() => { this.toggle('Following'); }}
                id='Following' className={this.state.activeTab=="Following"?gradientClass:lightClass}>
                Following
                <Badge color="secondary"  style={{marginLeft:'5px'}}>{currentProfile.following.length}</Badge>
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
      getProfileByEmail,
     getSelfProfile
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
