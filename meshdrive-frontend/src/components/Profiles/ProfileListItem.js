import React from 'react'
import { ListGroupItem, Label } from "reactstrap";
import 'semantic-ui-css/semantic.min.css';
import { List, Image,Segment } from 'semantic-ui-react'

class ProfileListItem extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    let profile = this.props.profile;
    const marginStyle = {
      padding: "15px"
    }
    const profilesList = profile.map(p => {
      return (
        <List.Item style={marginStyle} onClick={()=>{console.log(p.name)}}>
          <Image avatar src='https://www.gstatic.com/webp/gallery/4.jpg' />
          <List.Content>
            <List.Header as='a'>{p.name}</List.Header>
            <List.Description>
              {p.email}
            </List.Description>
          </List.Content>
        </List.Item>
      );
    })
    return (
      // <tr>
      //      <td width="10%">
      //           1  {/* <img width="75px" height="75px" src={profile.image_url} ></img> */}
      //     </td>
      //     <td width="40%" align="centre">
      //             {profile.name}

      //     </td>
      //     <td width="50%" align="centre">
      //             {profile.email}
      //      </td>
      // </tr>
      <React.Fragment>
        <Segment raised>
          <List animated divided size="big">
            {profilesList}
          </List>
        </Segment>
      </React.Fragment>

    )

  }

}

export default ProfileListItem;