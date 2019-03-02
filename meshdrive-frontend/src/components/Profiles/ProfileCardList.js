import React from 'react'
import { ListGroupItem, Label } from "reactstrap";
import 'semantic-ui-css/semantic.min.css';
import { Card, Icon, Image } from 'semantic-ui-react'

class ProfileCardList extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        let profile = this.props.profile;
        const marginStyle = {
            padding: "15px"
        }
        const profileCards = profile.map(p => {
            return (
                <Card  onClick={()=>{console.log(p.name)}}>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' />
                    <Card.Content>
                        <Card.Header>{p.name}</Card.Header>
                        <Card.Meta>{p.email}</Card.Meta>
                        <Card.Description>{p.name} is a comedian living in Nashville.</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a style={{marginRight:"5px"}}>
                            <Icon name='user' />
                            10 Followers  
                        </a>
                        <a>
                            <Icon name='file' />
                            4 public files 
                        </a>
                       
                    </Card.Content>
                </Card>
            );
        })
        return (
            <React.Fragment>
                <Card.Group>
                {profileCards}
                </Card.Group>
            </React.Fragment>

        )

    }

}

export default ProfileCardList;