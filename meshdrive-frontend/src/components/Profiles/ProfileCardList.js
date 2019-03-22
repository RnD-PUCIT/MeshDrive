import React from 'react'
import { ListGroupItem, Label } from "reactstrap";
import 'semantic-ui-css/semantic.min.css';
import { Card, Icon, Image, Button,Message } from 'semantic-ui-react'

class ProfileCardList extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        let profile = this.props.profile;


        
        const profileCards = profile.map(p => {
            return (
                <Card color='teal' key={p.id}>
                    <Card.Content>
                        <Image floated="left" width="80px" height="80px" src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' />

                        <Card.Header>{p.name}</Card.Header>
                        <Card.Meta>{p.email}</Card.Meta>
                        <Card.Description><Icon name='user' /> {p.no_of_followers} Followers </Card.Description>
                        <Card.Description> <Icon name='user' /> {p.no_of_followings} Following   </Card.Description>
                        <Button circular primary floated="right" icon="add"/>
                           

                    </Card.Content>

                </Card>
            );
        })
        return (
            <React.Fragment>
                <Card.Group itemsPerRow={4}>
                    {profileCards}
                </Card.Group>
            </React.Fragment>

        )

    }

}

export default ProfileCardList;