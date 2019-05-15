import React from 'react'
import { ListGroupItem, Label } from "reactstrap";
import 'semantic-ui-css/semantic.min.css';
import { List, Image,Segment } from 'semantic-ui-react'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import UserProfile from '../pages/UserProfile/UserProfile'
class ProfileListItem extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }
  openProfile(email){
    console.log(email);
    // <Router>
    // <Switch>
    // <Route path ="/profile"   render = {(props)=><UserProfile {...props} email={email}/>}/>
       
    //   </Switch>
    // </Router>
  }
  
  

  render() {
    let profile = this.props.profile;
    const marginStyle = {
      padding: "15px"
    }
    const profilesList = profile.map(p => {
      var link = "/profile/"+p.followerEmail;
      return (       
      
       <NavLink to={link}>
       <List.Item  key={p.followerEmail}   style={marginStyle}  onClick={()=>this.openProfile(p.followerEmail)}>
          <Image avatar src='https://www.gstatic.com/webp/gallery/4.jpg' />
          <List.Content>
            <List.Header as='a'>  {p.followerEmail}</List.Header>
            <List.Description>
              {p.followerEmail}
            </List.Description>
          </List.Content>
        </List.Item>
        </NavLink>

      );
    })
    return (
     
      <React.Fragment>
        <Segment raised>
          <List animated divided size="big">
            {profilesList}
          </List>
        </Segment>
      </React.Fragment>

    )

  }

}

export default ProfileListItem;