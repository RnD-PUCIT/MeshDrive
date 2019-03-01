import React from 'react';
import { Table, ListGroup } from 'reactstrap';
import ProfileListItem from './ProfileListItem'
import ProfileCardList from './ProfileCardList';


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
            },
            {
                email: "bilalyasin1616@gmail.com",
                name: "Bilal Yasin"
            },
            {
                email: "mohsinAli@gmail.com",
                name: "Mohsin Ali"
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
           
                // <ProfileListItem profile={profile}></ProfileListItem>
               <ProfileCardList profile={profile}></ProfileCardList>
          


        );
    }

}

export default ProfileList;