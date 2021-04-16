import React, { Component } from "react";
import { Header,Segment,Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends Component{
    render(){

        const { channelName,numUniqueUsers,handleSearchChange,searchLoading } = this.props;

        return(
            <Segment clearing>
                <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
                    <span>
                        { channelName }
                        <Icon name="star outline"/>
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input*/}
                <Header floated="right">
                    <Input 
                        loading={searchLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                        onChange={handleSearchChange}
                    />
                </Header>

            </Segment>
        );
    }
}

export default MessagesHeader;