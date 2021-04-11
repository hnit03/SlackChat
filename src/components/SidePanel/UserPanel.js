import React, { Component } from "react";
import { Dropdown, Grid, Header, Icon } from "semantic-ui-react";

class UserPanel extends Component{
    dropdownOption = () =>[
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change avatar</span>
        },
        {
            key:'signout',
            text: <span>Sign out</span>
        }
    ]

    render(){
        return(
            <Grid style={{background:'#3498db'}}>
                <Grid.Column>
                    <Grid.Row style={{padding:'1.2rem', margin: 0}}>
                    {/* App Header */} 
                        <Header inverted floated="left" as="h2">
                        <Icon name="code"/>
                            <Header.Content>SlackChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    {/* User Dropdown */} 
                    <Header style={{padding: '0.25em'}} inverted as="h4">
                        <Dropdown trigger={
                            <span>User</span>
                        } options={this.dropdownOption()}/>
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;