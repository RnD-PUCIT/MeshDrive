import React from 'react';
import { Table, ListGroup } from 'reactstrap';
import ProfileListItem from './ProfileListItem'
import 'semantic-ui-css/semantic.min.css';
import { Segment } from 'semantic-ui-react'


class ProfileList extends React.Component {


    render() {
        var profile = [
            {
                email: "shaheryartariq909@gmail.com",
                name: "Shaheryar Tariq"
            },
            {
                email: "memonasultan54@gmail.com",
                name: "Memona Sultan"
            }
        ]

        return (
            // <Table>
            //       <thead>
            //           <tr>
            //             <td>No.</td>
            //             <td>Name</td>
            //             <td>Email</td>
            //           </tr>
            //           <tbody>
            //               <ProfileListItem profile={profile}></ProfileListItem>
            //           </tbody>
            //         </thead>
            // </Table>
            <Segment raised>
                <ProfileListItem profile={profile}></ProfileListItem>
            </Segment>


        );
    }

}

export default ProfileList;