import React from 'react'

class ProfileListItem extends React.Component{

    constructor(props){
        super(props);
        console.log(props);
    }

    render(){
        var profile = this.props.profile;
      
        return (
                    <tr>
                         <td width="10%">
                              1  {/* <img width="75px" height="75px" src={profile.image_url} ></img> */}
                        </td>
                        <td width="40%" align="centre">
                                {profile.name}
                                
                        </td>
                        <td width="50%" align="centre">
                                {profile.email}
                         </td>
                    </tr>
               
        )

    }

}

export default ProfileListItem;