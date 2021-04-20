import React, { Component } from "react";
import { Accordion, Header, Icon, Image, List, Segment } from "semantic-ui-react";

class MetaPanel extends Component{
    state ={
        currentChannel:this.props.currentChannel,
        privateChannel: this.props.isPrivateChannel,
        activeIndex : 0
    }

    setActiveIndex = (event, titleProps) =>{
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    }

    displayUserPosts = posts =>{
        console.log(posts);
        Object.entries(posts)
        .sort((a, b) => b[1] - a[1])
        .map(([key, val], i) => (
            <List.Item key={i}>
                <Image avatar src={val.avatar} />
                <List.Content>
                    <List.Header as="a">{key}</List.Header>
                    <List.Description>{val.count} posts</List.Description>
                </List.Content>
            </List.Item>
        ));
    }

    render(){
        const { activeIndex,privateChannel,currentChannel } =this.state;
        const { userPosts } = this.props;
        if(privateChannel || !currentChannel) return null;

        return(
            <Segment loading={!currentChannel}>
                <Header as="h3" attached="top">About {currentChannel.name}</Header>
                <Accordion styled attached="true">
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="info"/>
                        Channel Details
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        {currentChannel.details}
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="user circle"/>
                        Top Posters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <List>
                            {userPosts && this.displayUserPosts(userPosts)}
                        </List>
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name="pencil alternate"/>
                        Created By
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Header as='h3' >
                            <Image circular src={currentChannel.createdBy.avatar} />
                            {currentChannel.createdBy.name}
                        </Header>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        );
    }
}

export default MetaPanel;