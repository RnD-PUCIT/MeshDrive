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
                        <td  width="10%">No.</td>
                        <td  width="40%">Name</td>
                        <td  width="50%">Email</td>
                      </tr>
                      </thead>
                      <tbody>
                          {/* <ProfileListItem profile={profile}></ProfileListItem> */}
                          <tr>
                         <td width="10%">
                              1  {/* <img width="75px" height="75px" src={profile.image_url} ></img> */}
                        </td>
                        <td width="40%" >
                                {profile.name}
                                
                        </td>
                        <td width="50%" >
                                {profile.email}
                         </td>
                    </tr>
                      </tbody>
                  
            </Table>
        );
    }

}

export default ProfileList;