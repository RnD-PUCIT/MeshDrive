import React from 'react';
import { Table } from 'reactstrap';
import ProfileListItem from './ProfileListItem'

class ProfileList extends React.Component{


    render(){
        var profile = {
            email : "shaheryartariq909@gmail.com",
            name: "shery"
        }
     
        return (
            <Table>
                  <thead>
                      <tr>
                        <td>No.</td>
                        <td>Name</td>
                        <td>Email</td>
                      </tr>
                      <tbody>
                          <ProfileListItem profile={profile}></ProfileListItem>
                      </tbody>
                    </thead>
            </Table>
        );
    }

}

export default ProfileList;