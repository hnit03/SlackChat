import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions';
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import Typing from "./Typing";
import Sleketon from "./Sleketon";

class Messages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    isChannelStarred: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('user'),
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    typingRef: firebase.database().ref('typing'),
    typingUsers: [],
    connectedRef: firebase.database().ref('.info/connected'),
    listeners: []
  };

  componentDidMount() {
    const { channel, user, listeners } = this.state;

    if (channel && user) {
      this.removeListeners(listeners);
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }
  
  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  componentDidUpdate(prevProps, prevState){
    if (this.messageEnd) {
      this.scrollToBottom();
    }
  }

  addToListeners = (id, ref, event) =>{
    const index = this.state.listeners.findIndex(listener =>{
      return listener.id  === id && listener.ref === ref && listener.event === event;
    });

    if (index !== -1) {
      const newListener = {id, ref, event};
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  }

  removeListeners = listeners =>{
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  }

  removeMessage = (messageID) =>{
    this.state.messagesRef
    .child(this.state.channel.id)
    .on('value',snap =>{
      snap.forEach(childs =>{
        childs.forEach(child=>{
          if(child.val() === messageID){
            this.state.messagesRef
              .child(this.state.channel.id)
              .child(childs.key)
              .remove()
              .catch(err =>{
                console.log(err);
              })
          }
        })
      })
    });
    
    this.addMessageListener(this.state.channel.id);
  }

  scrollToBottom = () =>{
    this.messageEnd.scrollIntoView({ behavior:'smooth' });
  }

  isProgressBarVisible = (percent) =>{
    if (percent > 0) {
      this.setState({
        progressBar: true
      });
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListener(channelId);
  };

  addTypingListener = channelID =>{
    let typingUsers = [];
    this.state.typingRef
    .child(channelID)
    .on('child_added',snap =>{
      typingUsers = typingUsers.concat({
        id: snap.key,
        name: snap.val()
      })
      this.setState({ typingUsers })
    });
    this.addToListeners(channelID, this.state.typingRef, 'child_added');

    this.state.typingRef
    .child(channelID)
    .on('child_removed',snap =>{
      const index = typingUsers.filter(user => user.id !== snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(channelID, this.state.typingRef, 'child_removed');

    this.state.connectedRef
    .on('value',snap=>{
      if(snap.val() === true){
        this.state.typingRef
        .child(channelID)
        .child(this.state.user.uid)
        .onDisconnect()
        .remove(err =>{
          if (err !== null) {
            console.log(err);
          }
        })
      }
    })
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
    this.addToListeners(channelId, ref, 'child_added');
  };

  countUserPosts = messages =>{
    let userPosts = messages.reduce((acc,message)=>{
      if (message.user.name in acc) {
        acc[message.user.name].count +=1;
      } else{
        acc[message.user.name] = {
          avatar : message.user.avatar,
          count: 1
        }
      }
      return acc;
    },{});
    this.props.setUserPosts(userPosts);
  }

  addUserStarsListener = (channelID, userID) =>{
    this.state.usersRef
    .child(userID)
    .child('starred')
    .once('value')
    .then(data =>{
      if (data.val() !== null) {
        const channelIDs = Object.keys(data.val());
        const prevStarred = channelIDs.includes(channelID);
        this.setState({ isChannelStarred: prevStarred });
      }
    })
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  handleStar = () =>{
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }),() =>this.starChannel());
  }

  starChannel = () =>{
    if (this.state.isChannelStarred) {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      });
    }
    else{
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .child(this.state.channel.id)
      .remove(err =>{
        if (err !== null) {
          console.error(err);
        }
      });
    }
  }

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };

  displayMessages = messages =>{
    return messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
        removeMessage={this.removeMessage}
      />
    ));
  }

  displayChannelName = channel => {
    return channel ? `${channel.name}` : '';
  };

  displayTypingUsers = users =>(
    users.length > 0 && users.map(user => (
      <div style={{display:"flex", alignItems:"center"}}>
        <span className="user_typing">{user.name} is typing</span> <Typing/>
      </div>
    ))
  )

  displayMessageSleketon = loading =>
    loading ? (
      <React.Fragment>
        {[...Array(10)].map((_,i)=>(
          <Sleketon key={i} />
        ))}
      </React.Fragment>
    ): null
  

  render() {
    // prettier-ignore
    const { messagesRef, messages, channel, user, numUniqueUsers, typingUsers,messagesLoading,
      progressBar, searchTerm, searchResults, searchLoading, privateChannel,isChannelStarred } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className={progressBar ? "messages_progress" : "messages"}>
            {this.displayMessageSleketon(messagesLoading)}
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
              {this.displayTypingUsers(typingUsers)}
              <div ref={node => (this.messageEnd = node)} ></div>
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
          isProgressBarVisible={this.isProgressBarVisible}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
