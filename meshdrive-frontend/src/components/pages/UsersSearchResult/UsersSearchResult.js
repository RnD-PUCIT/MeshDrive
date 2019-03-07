import Page from '../Page'
import React from 'react'
import Sidebar from '../../Layout/SideBar/SideBar'
import ProfileList from '../../Profiles/ProfileList'
import ProfileAbout from '../../Profiles/ProfileAbout'
import { connect } from "react-redux";
import ProfileCardList from '../../Profiles/ProfileCardList';
import ProfileHeader from '../../Profiles/ProfileHeader';
class UsersSearchResult extends Page{
   
    constructor(props) {
        super(props);
        this.state = {
         
        };
    }
   
    componentWillMount()
    {
       // this.props.searchUsers();
    }
    render(){

            return (
            <React.Fragment>
              <Sidebar primary></Sidebar> 
                                
            <div
                  style={{margin:"20px"}}  
                  id="UserSearchResult"
                  className="flex-grow-1 d-flex flex-column"
                >  
                <ProfileCardList profile={this.props.userList}></ProfileCardList>
             </div>

             
      </React.Fragment>
      
            );
    }
}


function mapStateToProps({ currentProfile,searchKeyword }) {
  return {
    currentProfile,
    keyword:searchKeyword.user_keyword,
    userList: searchKeyword.userList
  };
}

export default connect(
  mapStateToProps,
  null
)( UsersSearchResult);
