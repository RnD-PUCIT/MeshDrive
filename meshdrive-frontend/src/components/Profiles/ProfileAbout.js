import React from 'react';
import {Label,Divider, Segment} from 'semantic-ui-react'
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
     <Segment stacked>
     <Label as='a' color='teal' ribbon>
     Drives Integrated
        </Label>
         <b>{drivesCount}</b>
        <Divider></Divider>
        <Label as='a' color='teal' ribbon>
    Email
        </Label>
        <b>{profile.email}</b>
        <Divider></Divider>
        <Label as='a' color='teal' ribbon>
        Public Files
        </Label><b>{profile.shared_content.length} Files</b>
        <Divider></Divider> 
        <Label as='a' color='teal' ribbon>
     User Type
        </Label><b>Free</b>
         <Divider></Divider>
         <Label as='a' color='teal' ribbon>
           Joined MeshDrive on
        </Label><b>{profile.date_created}</b>
     </Segment>   
        )
    }
}
export default ProfileAbout