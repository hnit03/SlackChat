import React from "react";
import { Comment } from "semantic-ui-react";

class Message extends React.Component {

    state = {
        message: this.props.message,
        user: this.props.user
    }

    isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? "message_self" : "";
    };

    componentWillMount(){
        console.log(233333);
    }

    componentDidMount() {
        console.log(1111);
    }

    render(){

        const { message,user } = this.state;

        return(
            <Comment>
                <Comment.Avatar src={message.user.avatar} />
                <Comment.Content className={this.isOwnMessage(message, user)}>
                <Comment.Author as="a">{message.user.name}</Comment.Author>
                <Comment.Metadata></Comment.Metadata>
                <Comment.Text>{message.content}</Comment.Text>
                </Comment.Content>
            </Comment>
        );
    }
}

export default Message;
