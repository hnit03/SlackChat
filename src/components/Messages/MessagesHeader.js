import React, { Component } from "react";
import { Header,Segment,Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends Component{
    render(){
        return(
            <Segment clearing>
                <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
                    <span>
                        Channel
                        <Icon name="star outline"/>
                    </span>
                    <Header.Subheader>2 Users</Header.Subheader>
                </Header>

                {/* Channel Search Input*/}
                <Header floated="right">
                    <Input 
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                    />
                </Header>

            </Segment>
        );
    }
}

export default MessagesHeader;