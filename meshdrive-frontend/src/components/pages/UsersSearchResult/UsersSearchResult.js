import Page from '../Page'
import React from 'react'
import Sidebar from '../../Layout/SideBar/SideBar'
import ProfileList from '../../Profiles/ProfileList'
import ProfileAbout from '../../Profiles/ProfileAbout'
import { connect } from "react-redux";
import ProfileCardList from '../../Profiles/ProfileCardList';
import { updateUserSearchKeywords, searchUsers } from '../../../actions/searching/updateSearchingKeywords'
import { Message,Loader } from 'semantic-ui-react';

class UsersSearchResult extends Page {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    const cardList =   <ProfileCardList profile={this.props.userList}></ProfileCardList>;

    const loading = <Loader active inline="centered"/>;
    const noResultMessage = <Message color="teal">No Such Users Found</Message>
    return (
      <React.Fragment>
      <Sidebar primary></Sidebar>

      <div
        style={{ margin: "20px" }}
        id="UserSearchResult"
        className="flex-grow-1 d-flex flex-column"
      >

      {this.props.userList===undefined?noResultMessage:(this.props.userList.length===0?loading:cardList)}
      </div>


    </React.Fragment>
            );
  }
}


function mapStateToProps({ currentProfile, searchKeyword }) {
  return {
    currentProfile,
    keyword: searchKeyword.user_keyword,
    userList: searchKeyword.userList
  };
}

export default connect(
  mapStateToProps,
  { searchUsers }
)(UsersSearchResult);
