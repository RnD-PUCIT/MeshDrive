import React from 'react';
import { Table, ListGroup } from 'reactstrap';
import ProfileListItem from './ProfileListItem'
import ProfileCardList from './ProfileCardList';


class ProfileList extends React.Component {


    render() {
      
        var followers=this.props.followers;
        return (
           
                 <ProfileListItem profile={followers}></ProfileListItem>
             
        );
    }

}

export default ProfileList;