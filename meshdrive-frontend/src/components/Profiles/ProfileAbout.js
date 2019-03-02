import React from 'react';
import {Label,Divider} from 'semantic-ui-react'

class ProfileAbout extends React.Component{

    
    render(){
        var profile = this.props.profile;
     //   var drivesCount = profile.driveAccountsList.googleDriveAccountsList.length;

        return (
     <div className="container">
         <Label>Drives Integrated :</Label> <b>15</b>
        <Divider></Divider>
        <Label>Email :</Label><b>Shaheryartariq909@gmail.com</b>
        <Divider></Divider>
        <Label>Shared Content :</Label><b>10 Files</b>
        <Divider></Divider> 
         <Label>User Type :</Label><b>Free</b>
         <Divider></Divider>
         <Label>Date Joined :</Label><b>15-jan-2019</b>
     </div>   
        )
    }
}
export default ProfileAbout