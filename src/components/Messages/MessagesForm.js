import React, { Component } from "react";
import { Segment,Button, Input } from 'semantic-ui-react';

class MessagesForm extends Component{
    render(){
        return(
            <Segment className="message_form">
                <Input 
                    fluid
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    placeholder="Write your message"
                    label={<Button icon='add'/>}
                    labelPosition='left'
                />

                <Button.Group icon widths="2">
                    <Button 
                        icon="edit" 
                        color="orange" 
                        content="Reply"
                        labelPosition="left"
                    />
                    <Button 
                        icon="cloud upload" 
                        color="teal" 
                        content="Upload Media"
                        labelPosition="right"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessagesForm;