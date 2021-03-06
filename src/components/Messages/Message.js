import React from "react";
import moment from "moment";
import {  Comment, Dropdown, Image } from "semantic-ui-react";

class Message extends React.Component {

    state = {
        message: this.props.message,
        user: this.props.user
    }

    isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? "message_self" : "";
    };

    timeFromNow = timestamp => moment(timestamp).fromNow();

    isImage = (message)=>{
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
    }

    render(){

        const { message,user } = this.state;

        return(
            <Comment>
                <Comment.Avatar src={message.user.avatar} />
                <Comment.Content className={this.isOwnMessage(message, user)}>
                <span>
                    <Comment.Author as="a">{message.user.name}</Comment.Author>
                    <Comment.Metadata>{this.timeFromNow(message.timestamp)}</Comment.Metadata>
                    <Dropdown
                        icon='ellipsis horizontal'
                        floating
                        labeled
                        button
                        style={{ marginLeft: "10px" }}
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                icon="trash" 
                                text='Retrieve' 
                                onClick={() => this.props.removeMessage(message.timestamp)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </span>
                
                { this.isImage(message) ? 
                    <Image src={message.image} className="message_image"/> : 
                    <Comment.Text>{message.content}</Comment.Text>
                }
                </Comment.Content>
            </Comment>
        );
    }
}

export default Message;
