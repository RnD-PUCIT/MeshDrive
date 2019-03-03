import React from 'react';
import {Label,Divider} from 'semantic-ui-react'
import date from 'date-and-time';

class ProfileAbout extends React.Component{

    
    render(){
        var profile = this.props.currentProfile;
        if(profile==null)
        {
            return <div></div>
        }


        var drivesCount = profile.driveAccountsList.googleDriveAccountsList.length+
        profile.driveAccountsList.oneDriveAccountsList.length+
        profile.driveAccountsList.dropboxAccountsList.length;

      
        return (
     <div className="container">
         <Label>Drives Integrated :</Label> <b>{drivesCount}</b>
        <Divider></Divider>
        <Label>Email :</Label><b>{profile.email}</b>
        <Divider></Divider>
        <Label>Shared Content :</Label><b>{profile.shared_content.length} Files</b>
        <Divider></Divider> 
         <Label>User Type :</Label><b>Free</b>
         <Divider></Divider>
         <Label>Date Joined :</Label><b>{profile.date_created}</b>
     </div>   
        )
    }
}
export default ProfileAbout