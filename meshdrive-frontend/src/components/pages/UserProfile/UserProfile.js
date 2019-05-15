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
import { HashRouter as Router, Switch, Route } from "react-router-dom";

class UserProfile extends Page{
   
    constructor(props) {
        super(props);
        this.state = {
         activeTab:"About",
         currentEmail:null
        };
      }

      componentDidMount(){
        var email=this.props.match.params.email;
      
        console.log("Getting profile By email :" ,email);
        this.props.getProfileByEmail(email);
        // this.setState({currentEmail:email});
// 
      }

      componentWillReceiveProps(props) {
        var email=props.match.params.email;
        console.log("Getting profile By email :" ,email);

        this.props.getProfileByEmail(email);
          // this.setState({currentEmail:email});
      }


    shouldComponentUpdate(nextProps,newState) {
      var email=this.props.match.params.email;
      console.log("Old email :",email);
      console.log("Next email :",nextProps.match.params.email)
      if(email==nextProps.match.params.email && newState.activeTab==this.state.activeTab){
        return false;
      }else{
        return true;
      }
      // var nextEmail=nextProps.match.params.email;

      // if(nextEmail == this.state.currentEmail && newState.activeTab==this.state.activeTab) {
      //   return false;
      // }else {return true;}
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
        console.log(followers);
        var following = currentProfile.following;
        if(tab == "Followers")
        {
          return   <ProfileList  followers={followers} ></ProfileList>
        }else if (tab == "About")
        {
          return <div>
                  <ProfileAbout  currentProfile={currentProfile}></ProfileAbout>
            </div>
        }
      }
    
   
    render(){
      console.log("rendering") 
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

  <Router>
            <Switch>
              <Route path="/profile/:email" render={(e) =>{console.log(e); return <div>TEST</div>}} / >
              </Switch>
            </Router>

              <table width="50%">
                <tbody>            
                  <tr>
                    <td >
                    <div className="image-container"  > 
                  <img className="profile_pic"  src={currentProfile.profile_pic} width="250px"  height="250px"></img>
                  {/* <Button className={gradientClass+" float-bottom"} >Follow </Button> */}
                    </div>

                    </td>
                    <td valign="bottom">

                  <div className="name-container" >
                    <h4>{currentProfile.name}</h4>
                    <h6>Free User</h6>
                      <Button  className={gradientClass} outline  >{isFollowing?"Following":"Follow"}  
                        <Badge color="secondary"></Badge><i  style={{marginLeft:"5px"}}   className= {isFollowing?"fas fa-check":"fas fa-plus"}></i>
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
                id='Following'  className={this.state.activeTab=="Following"?gradientClass:lightClass}>
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


function mapStateToProps({ user,currentProfile }) {
  return {
    user,
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
